---
title: Research
lead: Plasma is pretty new. There's still lots of research to be done! This page maintains a list of active research areas, open questions, and background resources.
sublead: Researching something cool and Plasma related? Open an issue on GitHub and we'll publish the relevant information to this page.
date: 2018-08-21 16:26:02
categories:
tags:
---

## General Research
Lots of research goes into making Plasma better in general!
This section contains broader research topics that impact most Plasma designs.

<br>

### Cheaper Commitments
Plasma contracts make commitments to blocks instead of publishing the full blocks themselves.
Although this is already much cheaper than using Ethereum directly, it can still get pretty expensive!

Most commitments are 32 byte hashes.
Ethereum transactions currently cost a base fee of 21000 gas, plus an additional 20000 gas for storing the hash.
That means we're already at **41000 gas for a simple commitment**, and that doesn't calculate any additional computation costs!

If a Plasma chain is publishing a block every 15 seconds, then it's making **2102400** commitments per year.
Current gas prices tend to hover at about 2-3 gwei, so that's about **100,000 USD annually** to run a Plasma chain!

Obviously that's a little unrealistic.
We already have some tricks to save gas, like only publishing a block once every 6-12 Ethereum blocks (finality time).
However, there's still plenty of room for improvement.

Some research has gone into repeatedly reusing Ethereum memory space to make commitments more efficient.
Check out this post on [Merkle Mountain Ranges](https://ethresear.ch/t/double-batched-merkle-log-accumulators-for-efficient-plasma-commitments/2313) in Plasma for an example.
This cuts down the commitment cost by about 50%, but that's still not perfect.

#### Research Questions
+ How can further reduce the gas cost to submit a commitment?
+ Can multiple chains coordinate to commit at the same time?
+ Can a chain make fewer commitments but retain the same level of security?

#### Resources
+ [Merkle Mountain Ranges](https://github.com/opentimestamps/opentimestamps-server/blob/master/doc/merkle-mountain-range.md)
+ [Double-batched Merkle log accumulator](https://ethresear.ch/t/double-batched-merkle-log-accumulator/571)
+ [Double Batched Merkle Log Accumulators for Efficient Plasma Commitments](https://ethresear.ch/t/double-batched-merkle-log-accumulators-for-efficient-plasma-commitments/2313)

<br>

### Fast Finality
Although most current Plasma implementations significantly increase transaction throughput, they don't improve on finality time.
In fact, without some additional constructions, we're typically still limited to the finality time of the root chain.
Ethereum's "safe finality" time is about 6 minutes (25 confirmations or so). 

Slow finality isn't acceptable user experience for many applications.
We shouldn't expect people to sit around for a few minutes just to find out if their transaction went through or not.
Therefore, we want to find some sort of mechanism that allows for "fast" finality (preferably almost instant).

State channels are a well known way to reach fast finality in the context of certain applications.
However, state channels have their own UX challenges and won't be the right solution for every application.

Another way to reach some sense of finality is known as "cryptoeconomic" finality.
Basically, cryptoeconomic finality guarantees that a transaction *will* be included in the chain within some period of time, or someone will cover the full amount.
In the context of Plasma, this "counterparty" will probably be the operator.

A simple example of cryptoeconomic finality might involve a customer making a purchase. 
We want this transaction to be guaranteed as quickly as possible.
The merchant might make a deal with the operator that states the operator will include this transaction within some period.
If the operator doesn't include the transaction, the merchant can take the transaction amount straight from the operator.
Therefore, the operator is incentivized to include the transaction in a timely manner and the merchant knows they'll get the money either way.

This is cool but there are some things that need to be worked out.
For example, what happens when there isn't a single operator but multiple validators?
If the validators can't be sure they'll be able to include the transaction, they might not sign these contracts.
Also, we don't want the counterparty to "overpromise," so we need to make sure each contract is properly backed.

#### Research Questions
+ Are there other methods for reaching finality?
+ Can we make "finality contracts" when we have multiple validators?
+ How do we prevent finality counterparties from overpromising?

#### Resources
+ [On Settlement Finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality/)
+ [Cryptoeconomic finality](https://github.com/omisego/research/issues/29)

<br>

### Running the Numbers
This is a great research topic for people who are relatively new to Plasma.
We have lots of different Plasma designs, but not many people have done the important math!

So what sort of math still needs to be done?
Well, it'd be useful, for example, to get a general overview of how much data the average person might have to store in Plasma Cash.
It would also be useful to model the size of blocks in Plasma MVP.

We also really need to know how fast certain signature schemes are to validate!
It could be that ECDSA isn't the correct choice and that we should use a different scheme.
These things really just need to be researched and tested.

Below is a non-exhaustive list of things that would be useful to model.
Feel free to add more suggestions if you have them!

#### Research Questions
+ How much data will the average user have to store in Plasma Cash?
+ How long does it take to verify a signature under different schemes?
+ How large should a Plasma MVP exit bond be?
+ How many simultaneous Plasma chains can Ethereum handle?

#### Resources
+ [Math: Plasma MVP vs. Plasma Cash](https://github.com/omisego/research/issues/33)

<br>

### zk-SNARKs
Zero knowledge succinct arguments of knowledge (or zk-SNARKs) are a relatively recent technological development.
Basically, they allow us to create certain general purpose programs that can keep information secret.
Vitalik's [blog post](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6) on zk-SNARKs is a great place to start if you're unfamiliar with how they work.

Some work has been done exploring the utility of zk-SNARKs in Plasma.
For example, it might be possible to create a SNARK circuit that allows the operator to prove they've only included valid transactions in a block.
This would largely mitigate the need for mass exits in Plasma MVP.

Currently, the biggest barrier tends to be proof calculation time.
Hashes circuits tend to take on the order of a few seconds to compute.
As a result, it'll probably take on the order of hours to generate a proof that an entire Plasma block is valid.

zk-SNARKs have plenty of applications, we just need to find them and figure out which are feasible.
Lots of research questions still need to be explored!

#### Research Questions
+ How can we potentially make use of zk-SNARKs in Plasma?
+ How long would a block validity proof take to generate?
+ Can we make use of STARKs?
+ Can we feasibly add private transactions with SNARKs?

#### Resources
+ [Zk-SNARKs: Under the Hood](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6)
+ [Zk-SNARKs for Plasma](https://ethresear.ch/t/plasma-is-plasma/2195)
+ [Plasma snapp](https://ethresear.ch/t/plasma-snapp-fully-verified-plasma-chain/3391)

---

## Plasma MVP
This is a list of research topics that apply mainly to Plasma MVP.
Some of this research will be useful to other designs, though!

<br>

### Mass Exits
Unlike Plasma Cash, the design of Plasma MVP requires that users be able to quickly exit in the case of a safety failure.
Basically, we need everyone to be able to "exit" the Plasma chain within some short period of time (e.g. one week).

However, we currently require that every user submit an exit for every single UTXO they own.
This is not particularly efficient.
Even a maximally efficient exit will cost at least ~30000 gas (likely much more).
Assuming (for the sake of argument) that we can take up the entire Ethereum block space for a week, we can process about 10m exits.

To put this number in perspective, the current Bitcoin UTXO set is on the order of tens of millions.
Fortunately, we can make things much more efficient using something called mass exits.
The basic idea behind mass exits is that we can exit lots and lots of UTXOs at the same time. 

One simple way to enable mass exits is to allow users to specify some function that can "aggregate" UTXOs.
The user can then submit a bitmap (a big string of 0s and 1s) that tells the root chain contract which UTXOs the user is trying to exit (0 = no, 1 = yes).

There's still a lot of research to be done determining the most efficient aggregation function.
One proposed way to do this is to add metadata to each transaction and allow users to aggregate by that metadata.
This way, large sets of users can exit together.


#### Research Questions
+ What are the most efficient ways to aggregate UTXOs in mass exits?

#### Resources
+ [Proving UTXO sum validity for mass exits](https://ethresear.ch/t/proving-utxo-sum-validity-for-mass-exits/2023)
+ [Basic Mass Exits for Plasma MVP](https://ethresear.ch/t/basic-mass-exits-for-plasma-mvp/3316)

<br>

### Fast Withdrawals
Plasma chains typically require that users wait for a challenge period to pass before they can withdraw funds.
Although this is a security mechanism, it's also quite annoying.
Users typically want to be able to access their funds within a short period of time.

There are lots of different ways to reduce this waiting period.
The most basic way is to simply make the waiting period shorter.
Unfortunately, this also decreases the security of the Plasma chain.

One more complex way to reduce the waiting period is to allow users to "sell" their exits.
The user receives funds immediately, and the buyer of the exit will wait out the period instead.
Generally, exits will sell at some specified discount to account for the amount of time the buyer needs to wait.

However, there are probably other ways to reduce the exit period!
For example, efficient mass exits will reduce the amount of time necessary to exit the entire chain.
It would also be useful to look into user experience of "selling exits" to see if we can make the process as smooth as possible.

#### Research Questions
+ How do we determine optimal challenge period length?
+ How do we improve the user experience of "selling exits"?
+ How else can we reduce challenge period length without reducing security?

#### Resources
+ [Simple Fast Withdrawals](https://ethresear.ch/t/simple-fast-withdrawals/2128)
+ [Enabling Fast Withdrawals for Faulty Plasma Chains](https://ethresear.ch/t/enabling-fast-withdrawals-for-faulty-plasma-chains/2909)

<br>

### Atomic Swaps
A lot of projects are planning to use Plasma as part of a decentralized exchange.
One fundamental component of most decentralized exchanges is the atomic swap.
An atomic swap is basically a trade that either executes or fails.
We never want a situation in which one party receives funds and the other party doesn't.

We also want to ensure that the atomic swap remains as trustless as possible.
It's possible to design a simple atomic swap by simply requiring both users to sign off on a transaction trading funds.
However, this gives the last user to sign a "free option" on the trade (they can refuse to sign).
For these reasons it's become important to design an atomic swap mechanism that doesn't give any user an unfair advantage.

Some potential solutions have been explored, but nothing tangible currently exists.
The most complete proposals suggest a system of "partial" transactions.
Instead of signing a full transaction, a user would sign a transaction that leaves certain fields blank.
These transactions are only valid when they're paired with other transactions that fulfill certain criteria (e.g. same order pair, same exchange rate).

Unfortunately, this design still doesn't provide for repeated partial fills.
A user would have to sign a new transaction for each partial fill, instead of signing a trade once and having the order filled multiple times.
This is a huge open area of research and there's a lot to be explored!

#### Research Questions
+ How can we allow for partial order fills with atomic swaps?
+ What are the pros and cons of different atomic swap protocols?

#### Resources
+ [Using Relayers for Order Matching](https://github.com/omisego/research/issues/20)

<br>

### Confirmation Signatures

Confirmation signatures are one of the most annoying mechanisms required by the Plasma MVP design.
Basically, confirmation signatures require that a user sign one signature to create a transaction and then sign a second to "validate" it.
This is a security consideration that prevents a Plasma consensus mechanism from placing invalid transactions "before" valid ones.

Unfortunately, the user experience of confirmation signatures is pretty bad.
Getting users to sign a single message is hard enough, getting them to sign two messages just to make a single transaction will be even harder.
There's also a particular concern for decentralized exchanges, as confirmation signatures create a built-in free option on every trade.

This has spurred the search for a better way to ensure that malicious consensus mechanisms can't steal funds.
The biggest research effort in this area is "More Viable Plasma," an upgrade to Minimal Viable Plasma with a different exit game.
However, More Viable Plasma is still confusing for most people and current implementations are relatively gas-inefficient.

Research into alternative exit games with better UX than confirmation signatures is always useful.
The best way to get started working on this topic is to understand why confirmation signatures are necessary, why they're bad UX, and how people have attempted to remove them.
Hopefully the resources provided prove helpful!

#### Research Questions
+ How can we safely remove confirmation signatures?
+ How do we make a gas-efficient implementation of More Viable Plasma?

#### Resources
+ [Why Do We Need Confirmation Signatures?](https://ethresear.ch/t/why-do-dont-we-need-two-phase-sends-plus-confirmation/1866/14?u=kfichter)
+ [Confirmation Signatures Must Be Included on the Plasma Chain](https://ethresear.ch/t/plasma-vulnerabiltity-sybil-txs-drained-contract/1654)
+ [Griefing Vectors in Confirmation Signatures](https://ethresear.ch/t/griefing-vectors-in-confirmation-signatures/2301)

---

## Plasma Cash
Plasma Cash works well for non-fungible tokens. 
Can we extend that so it works well for fungible ones too?

<br>

### Merging/Splitting
Plasma Cash was built primarily for non-fungible assets.
People have started to look into "merging" or "splitting" these assets as a way to enable a sort of fungibility.
If we can find a simple way to represent these merges or splits, then we can basically simulate fungibility.

Ideally, we would like users to be able to split an asset into pieces of any size and to be able to merge similar assets into one larger asset.
This mainly applies to assets that would normally be fungible (like ETH), but could probably apply to other things too.

Every withdrawal in Plasma Cash must point to a specific asset.
As a result, it's usually pretty simple to split assets because we can just withdraw part of the existing asset and decrease the balance represented by that asset.

However, this also makes merging across different assets hard.
A user would have to reference each asset included in their "merged" asset in order to exit.
These merged assets might contain dozens, if not hundreds, of component assets.
An efficient way to point at multiple assets, possibly in the form of a bitfield, would make exiting cheaper and simpler.

Existing proposals for splitting tend to require the user hold a new "coin" for each asset created by the split.
This vastly increases the already large amount of proof data a user is required to store.
Improvements to Plasma Cash proof size would probably make this point less important.

#### Research Questions
+ How can we efficiently represent the components of a merged assets?
+ How can we reduce the proof data added by each split?
+ How else can we represent merges and splits?
+ How does merging and splitting impact Plasma XT?

#### Resources
+ [Proposal for Plasma Cash Splitting and Merging](https://ethresear.ch/t/one-proposal-for-plasma-cash-with-coin-splitting-and-merging/1447)
+ [Arbitrary Coin Merging in Plasma Cash](https://ethresear.ch/t/plasma-cash-plasma-with-much-less-per-user-data-checking/1298/53)

<br>

### Shorter Proofs
Plasma Cash requires that users generate a "proof of validity" when sending a token to another user.
This proof is composed of Merkle proofs for each block since the token's inception.
The size of this proof therefore grows linearly with the size of the Plasma Cash chain.  

To illustrate this, let's take a look at the numbers.
Remember that Plasma Cash transaction proofs consist of Merkle proofs for every block since the coin's deposit.
The size of a Merkle proof depends on the height of the Merkle tree.
For simplicity, we'll take a conservative height 10 tree (2^10 = 1024 coins).

If the tree is generated with Ethereum's keccak256, then each sibling hash will be 32 bytes.
We need to provide 10 siblings for a height 10 tree, so that's 320 bytes per proof.
We also have to add some additional information like the index and the leaf being proven, but we'll just ignore that for now.

Let's say a user deposited a coin at the beginning of the year.
If a Plasma block is created every 15 seconds, then the chain will produce 4\*60\*24\*365 = 2102400 Plasma blocks per year.
If the user wants to send the coin, they need to provide a Merkle proof for each block.
We said our proof was about 320 bytes, so that's a total of 320\*2102400 = 672768000 bytes = 0.67 gigabytes of proof data, just to transfer a single coin!

These numbers get much bigger if we want to support thousands or millions of coins.
We want to decrease this proof size as much as possible!
For example, it might be possible to compress the proofs for blocks where the coin wasn't spent with a Bloom filter.
We might also be able to use zk-SNARKs to decrease the proof size at the cost of extra computation for the prover.
We can also make use of checkpointing mechanisms, like Plasma XT, which allow users to create checkpoints and put a cap on the proof size.

#### Research Questions
+ How can we use zk-SNARKs to reduce the Plasma XT proof size?
+ Can we compress the proofs for periods where the coin was unspent?

#### Resources
+ [Plasma XT](https://ethresear.ch/t/plasma-xt-plasma-cash-with-much-less-per-user-data-checking/1926)
+ [Plasma Cash Without Any Blockchain at All](https://ethresear.ch/t/plasma-cash-without-any-blockchain-at-all/1974/3)

<br>

### Checkpoints
This topic is generally related to decreasing the size of Plasma Cash transaction proofs.
However, the topic is interesting enough that it deserves its own section.

Plasma Cash transaction proofs are large and grow linearly with the size of the Plasma chain.
One way to reduce the required proof size is to create state checkpoints.
If these checkpoints can be considered part of the canonical history ("the owner of coin X at time T is known to be Y"), then we only need to create proofs back to the checkpoint.
This gives us an upper bound on the proof size.

It's possible to create these checkpoints if we allow the operator to submit a state root that becomes "the truth" after some period of time.
We add this extra waiting period in case the operator withholds the contents of the state tree or publishes some invalid root.
However, this functionality would break the nice property of Plasma Cash that users are never forced to act without receiving compensation for their actions.

Instead, we introduce a new mechanism by which users can explicitly choose to participate in a checkpoint.
The details of this mechanism (nicknamed "Plasma XT") are described in [this post on ethresear.ch](https://ethresear.ch/t/plasma-xt-plasma-cash-with-much-less-per-user-data-checking/1926).

Plasma XT is a step in the right direction, but it's not totally ideal.
The cost to checkpoint 8,000 coins is about 100,000 gas. 
This is relatively cheap, but it's still on the order of a few thousand USD every year for the average Plasma Cash chain.
Some work could still be done to make this process cheaper.

The user experience of Plasma XT is also relatively poor and involves a multi-step process.
A user needs to request to be checkpointed, receive the entire checkpoint tree, and then send back the signed checkpoint.
We also place a lot of responsibility on the operator.
There might be a way to create these checkpoints in a more decentralized manner or in a way that improves UX.

#### Research Questions
+ Are there better ways to checkpoint things in Plasma Cash?
+ How can we make Plasma XT cheaper?
+ How can we improve the user experience of Plasma XT?

#### Resources
+ [Plasma XT](https://ethresear.ch/t/plasma-xt-plasma-cash-with-much-less-per-user-data-checking/1926)
+ [Plasma checkpoint cost](https://ethresear.ch/t/plasma-checkpoint-cost-and-block-time/2016)
