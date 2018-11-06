---
title: Plasma Cash
lead: Understand how Plasma Cash works and when to use it.
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    Introduction: /en/learn
    The Plasma Framework: /en/learn/framework.html
    Plasma MVP: /en/learn/mvp.html
  after:
    Plasma Debit: /en/learn/debit.html
    Comparison: /en/learn/compare.html
---

## Plasma Cash
[Plasma Cash](https://ethresear.ch/t/plasma-cash-plasma-with-much-less-per-user-data-checking/1298) is a plasma design primarily built for storing and transferring non-fungible tokens.
Plasma Cash was originally designed to address the mass exit problem in Plasma MVP.

---

### Consensus
Plasma Cash chains, like Plasma MVP chains, need a consensus mechanism.
This mechanism can be anything from a single operator (Proof-of-Authority) to a large set of validators (Proof-of-Stake).
The design of Plasma Cash ensures that user funds are always safe, even if the consensus mechanism misbehaves.

### Deposits
Users can start using a Plasma Cash chain by depositing assets into the chain's smart contract.
However, unlike Plasma MVP, each Plasma Cash asset is represented by a non-fungible token.
For example, if a user deposits 10 ETH into the contract, that user will receive a token worth 10 ETH.
Each token is given a unique identifier.

### Blocks
Plasma Cash blocks are very different from Plasma MVP blocks.
Each Plasma Cash block has a slot for every token in existence.
Whenever a token is spent, a record of that transaction is placed at the corresponding slot.
Here's what that would look like for a Plasma Cash chain with four tokens.

![pc-block](/img/learn/cash/pc-block.png)

In this example, token **\#4** was sent from user **A** to user **B**.
Notice that **\#1**, **#2**, and **#3** weren't spent, so we didn't put anything in those slots!
This special structure gives us something really cool.
In addition to being able to show that a token was spent in a specific block, we can also show that the token *didn't* change hands in that block.

So whereas Plasma MVP blocks form standard [Merkle trees](https://en.wikipedia.org/wiki/Merkle_tree), Plasma Cash blocks form *sparse* Merkle trees.
Standard Merkle trees don't give us a good way to prove that something *isn't* part of a specific block, but sparse Merkle trees do!
You can read more about sparse Merkle trees [here](https://medium.com/@kelvinfichter/whats-a-sparse-merkle-tree-acda70aeb837).

What's cool about this is that users don't actually need to keep track of every single token!
Transactions of one token can never be placed into the slot of another token.
Users only need to keep track of their own tokens - it doesn't even matter what's in the other slots.

### Transactions
Since users are only keeping track of their own tokens, they don't know who owns any of the other tokens.
When a user wants to send their token to another user, they need to prove that they actually own that token!
This proof consists of the full transaction history of the token - every transaction since the token was first created.
If the history is correct, then it should show the list of owners ending with the sender.

To prove that history is actually correct, the user needs to provide additional proof that each transaction in the history was correctly included in a block.
Additionally, to show that there aren't any missing transactions, the user also needs to provide a proof that the token <i>wasn't</i> spent in any other block.
Let's demonstrate this by looking at a few Plasma Cash blocks.

![pc-tx](/img/learn/cash/pc-tx.png)

By the end of these four blocks, **G** owns token **#2**, and **C** owns token **#4**.
So how does **G** prove that they actually own **#2**? Simple!
**G** just needs to prove that **#2** wasn't spent in blocks #1 and #3, and that it was transferred from **E** to **F** in block #2 and from **F** to **G** in block #4.
**G** can do this with a simple Merkle proof for each block (taking advantage of the special sparse Merkle tree construction).

Similarly, **C** can prove that they own **#4** by showing that the token wasn't spent in blocks #2 and #4, and showing that it was sent from **A** to **B** and then **B** to **C**.

### Withdrawals
Because the block structure of Plasma Cash differs so much from Plasma MVP, the process of withdrawing funds differs too.

#### Starting an Exit
When a user wants to withdraw a token, they need to submit the two latest transactions in the token's history.
For example, if **C** wants to withdraw token **#4**, they need to provide the "child" (most recent) transaction from **B** to **C**, and the "parent" transaction from **A** to **B**.
The user also needs to submit Merkle proofs that show both transactions were included in the blockchain.

#### Challenging an Exit
We need to support three types of challenges to ensure that only the true owner of a token can withdraw that token.
Withdrawals can be immediately blocked if someone proves that the withdrawing user actually spent the token later on.
Withdrawals can also be immediately blocked if someone shows that there's transaction *between* the parent and the child transactions, meaning the withdrawing user provided an invalid parent.

Someone can also challenge the withdrawal by providing some other transaction in the token's history.
This type of challenge doesn't immediately block a withdrawal.
Instead, the withdrawing user is forced to respond with the transaction that comes after the provided transaction.

### Pros and Cons
Plasma Cash is highly scalable because users only ever need to keep track of their own tokens.
However, there's a trade-off being made between scalability and flexibility.
Tokens always have a fixed denomination - there's (currently) no good way to spend a fraction of a token without going into something like Plasma Debit (which we'll discuss in the next section).
This makes Plasma Cash unsuitable for use cases where fractions of tokens are necessary, like exchanges.

Additionally, the proofs that need to be sent along with each transaction can grow pretty quickly.
These proofs need to go all the way back to the block in which the token was deposited.
Once the Plasma Chain has been running for a while, these proofs might get prohibitively large.

Let's do a quick calculation:

Imagine we have a Plasma Cash chain with a (very) conservative 1000 tokens.
This results in a sparse Merkle tree with ten levels, which means each Merkle proof needs to provide ten sibling hashes.
Every sibling hash is 32 bytes, so each Merkle proof is 32 \* 10 = 320 bytes!

Now let's imagine this chain is producing one block every 15 seconds (the current Ethereum block time).
That's 4 \* 60 \* 24 \* 365 = 2102400 blocks a year.

We know that the proof to send a single token grows by 320 bytes per block.
After a year, that proof would grow to 320 \* 2102400 = 672768000 bytes, or **0.67** gigabytes!
That's already way too much to be transmitted in a reasonable amount of time over even home networks. 

Plasma Cash is still great for certain things.
Support for non-fungible tokens makes Plasma Cash perfect for things like supply-chain logistics or even [card games](https://www.kickstarter.com/projects/328862817/zombie-battleground-the-new-generation-of-ccg-tcg)!
