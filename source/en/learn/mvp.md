---
title: Plasma MVP
lead: 
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    Introduction: /en/learn
    The Plasma Framework: /en/learn/framework.html
  after:
    Plasma Cash: /en/learn/cash.html
    Plasma Debit: /en/learn/debit.html
---

## Plasma MVP
[Plasma MVP](https://ethresear.ch/t/minimal-viable-plasma/426) is a design for an extremely simple [UTXO](https://www.investopedia.com/terms/u/utxo.asp)-based Plasma chain.
The basic Plasma MVP specification enables high-throughput payment transactions, but does not support more complicated constructions like scripts or smart contracts.
On this page, we'll go through the design process behind Plasma MVP.
You'll become familiar with exactly how Plasma MVP works, and why it's built the way it is. 

---

### Background
Blockchains are currently really, really slow.
We need blockchains to be much faster if we want to use them for even simple use-cases like payments.
If we process payments on Ethereum, we only get a total of ~10-25 transactions per second (TPS).
We need something like a few thousand TPS to even begin to handle daily retail transactions.
Furthermore, Ethereum transaction fees tend to be high because tiny transactions are treated with the same level of security as massive ones, even when this isn't necessary. 

#### Scaling Off-Chain
We've known for a while that one way to scale blockchains is to [create](https://gendal.me/2014/10/26/a-simple-explanation-of-bitcoin-sidechains/) [new](https://bitcoinmagazine.com/guides/what-altcoin/) [blockchains](https://github.com/ethereum/wiki/wiki/Sharding-FAQs).
If we increase the number of blockchains that can process transactions, then we can increase the total number of transactions that can be processed.
However, just making a new blockchain whenever we hit our limit isn't a great solution.
Independent blockchains simultaneously decrease the total security of the ecosystem and create poor user experience.

The introduction of [sidechains](https://blockstream.com/sidechains.pdf) provided an alternative that allows for the creation of "side" blockchains where assets pegged to a "parent" blockchain.
Like most blockchain systems, these sidechains require their own consensus mechanism to determine the canonical set and ordering of blocks.
If this consensus mechanism fails, or is overpowered, user funds on the sidechain could be at risk of theft.
This is where we introduce Plasma.

---

### Consensus
Blockchains typically need consensus mechanisms.
Plasma chains are special types of blockchains that can guarantee the safety of user funds even if the Plasma consensus mechanism fails.
As a result, the simplest version of MVP relies on something called an **operator**.
An operator is a single entity that effectively runs the entire Plasma chain by creating blocks.
If you're more familiar with blockchain terminology, this is what we generally mean when we say that MVP relies on **Proof-of-Authority**.

This might seem a little strange - we generally don't want to trust third parties when we're designing blockchain protocols.
However, the unique design of Plasma ensures that user funds are safe even if the operator attempts to misbehave.
This key feature also makes it possible to use Plasma MVP for private blockchains while making sure users always retain control over their assets! Now we'll explain more about why user funds are always secure.

### Deposits
Users start using the Plasma chain by **depositing** funds into a smart contract on Ethereum.
The basic MVP specification only allows users to deposit ETH, but the spec can be easily extended to support ERC20s.
When users deposit these funds, a block is created on the Plasma chain that only includes a single transaction.
This transaction creates a new output for the depositor with a value equal to the value of the funds deposited.
Once a user has deposited, they're ready to start making transactions on the Plasma chain!

### Transactions
Users can transact on the Plasma chain by spending an output they own and creating new outputs.
In practice, this means signing a signature that confirms the user is willing to make the transaction.
This transaction (and the corresponding signature) is then sent off to the **operator**.

The operator will receive a bunch of transactions and then include them into an ordered list of transactions called a **block**.
Once the operator receives enough transactions to fill a block (although they can always include less), the operator will submit a commitment to this block to Ethereum.
To explain exactly how this commitment thing works, let's first talk about Merkle trees.

#### Merkle Trees
Merkle trees are an extremely important data structure in the blockchain world (and computer science in general).
Basically, Merkle trees give us the ability to **commit** to some set of data in a way that hides the data, but allows users to prove that some piece of information was in the set.
For example, if I have ten numbers, I can create a commitment to those numbers and then later prove that one specific number was in that set of numbers.
These commitments are a small, constant size, which makes them cheap to publish to Ethereum!

We can extend this idea so that we can commit to a set of transactions.
Then, we can later prove that a specific transaction is in that set of transactions.
This is exactly what the operator does! Every block is composed of a set of transactions, which is turned into a Merkle tree.
The root of this tree is the **commitment** that gets published to Ethereum along with each Plasma block.

### Withdrawals
Users need to be able to withdraw their funds from the Plasma chain (we sometimes also refer to this as "exiting" the chain).
When users want to withdraw from the Plasma chain, they submit an "exit" transaction on Ethereum.

#### Starting an Exit
Because funds in MVP are represented as UTXOs, each exit must point to a specific output.
We also want to make sure that only the person who actually owns that output can withdraw it.
Therefore, in order to start a withdrawal, a user needs to submit a **merkle proof** along with the exit.
The smart contract checks this proof to make sure that the transaction that created the output was actually included in some block.
The contract then also checks that the output is owned by the user who started the exit.

#### Challenging an Exit
However, if that's all that was needed in order to withdraw, then users would be able to withdraw outputs they'd already spent! We want to make sure that the output being referenced is actually unspent, so we introduce a **challenge period**.
Basically, a challenge period is a period of time in which people can challenge the validity of the exit by proving that the UTXO is actually spent.
Users can prove a UTXO is spent by revealing another transaction that spends the UTXO signed by the user who started the exit.

#### Exit Priority
The exit protocol we just described allows people to withdraw their funds from the Plasma chain.
Unfortunately, the Plasma operator is allowed to do evil things, like include double-spending transactions, and we can't really do anything to stop them.
The operator can even start a withdrawal from an output created by an invalid transaction.

How do we handle this? Well, we want users who made valid transactions to get funds before any user who makes an invalid transaction.
Conveniently, we only need to add a few rules to make sure user funds are safe.
The first of these rules is that UTXO have an "exit priority" based on when they were included in the Plasma chain.
The exact priority is based on the "position" of the UTXO in the blockchain.
This position is first determined by the block, then the index of the transaction in the block, then the index of the output in the transaction.
This gives us a unique, static position for every single UTXO.

Note then that "older" UTXOs withdraw before newer ones.
That means that if an invalid transaction is ever included in the blockchain, then all transactions that occurred before the invalid transaction will be processed before that invalid one.
We've solved half of our problem! 

#### Confirmation Signatures
Now what happens if a transaction gets included **after** the bad transaction? This can totally happen if a user makes a transaction, the transaction is sent to the operator, and the operator puts an invalid transaction before the user's valid transaction.
Users could try to exit from the inputs to the transaction, but that exit could be challenged by revealing the signed spend.

We deal with this scenario by requiring that transactions are invalid until they're signed twice.
Whenever a user makes a transaction, they'll sign a first signature to have that transaction included in a block.
Then, once the transaction is included in a valid block, the user will sign a second signature, called a **confirmation signature**.
Users correctly following this rule will never sign a confirmation signature unless they know that their transaction was included in a valid block.

We add an extra rule that exit challenges also have to provide the confirmation signature.
Now, if the operator includes a user's transaction after their invalid transaction, the user simply won't sign a confirmation signature.
A transaction included after an invalid transaction won't have a confirmation signature, and therefore won't be valid.
Every correctly behaving user can therefore get their funds back.

---

### More Viable Plasma
Confirmation signatures make for pretty bad user experience.
Users need to sign a signature before making a transaction, wait to see the transaction included in a valid block, and then sign another signature.
These second signatures must also be included within a Plasma block, reducing block space available for more transactions!
[More Viable Plasma](https://ethresear.ch/t/more-viable-plasma/2160), also known as MoreVP, is an extension to Minimal Viable Plasma that removes the need for confirmation signatures.

Plasma MVP relies on confirmation signatures because withdrawals are processed in order based on the position of the output being withdrawn.
In a nutshell, MoreVP modifies the process through which users can withdraw their funds.
The ordering of each withdrawal becomes based on the position of the *youngest input* to the transaction that created an output.

This new ordering requires lots of updates to the challenges that make sure only honest users can withdraw their funds.
An [updated version](https://github.com/omisego/elixir-omg/blob/develop/docs/morevp.md) of the MoreVP specification is currently being maintained and expanded by OmiseGO.
