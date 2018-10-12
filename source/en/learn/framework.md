---
title: The Plasma Framework
lead: 
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    Introduction: /en/learn
  after:
    Plasma MVP: /en/learn/mvp.html
    Plasma Cash: /en/learn/cash.html
    Plasma Debit: /en/learn/debit.html
    Comparison: /en/learn/compare.html
---

## The Plasma Framework
Before we start, remember that Plasma is a *framework* for building scalable applications.
There isn't any single project called "Plasma."
Instead, there are lots of different projects that use the tools provided by the Plasma framework.
This tends to be pretty confusing when you're first learning about Plasma (and that's fine!). 

This framework nature can make Plasma hard to explain.
The original [paper](http://plasma.io/plasma.pdf) describing Plasma runs into this problem too.
It's difficult to describe exactly what Plasma *is* without giving examples of how it can be used.
At the same time, it's important to remember that those examples are only a very small slice of what's possible. 

As a result, it's necessary to introduce Plasma as a framework before describing examples of applications inside the framework.
This section might sound pretty vague if you're used to thinking of Plasma as one specific project!
Don't worry, we'll go into as much detail as possible about some of those applications later on.

---

### Why do we need Plasma?
Before we try to explain what Plasma *is*, we should first understand *why* Plasma exists.
This is going to be a relatively high-level overview and will try to avoid going into a lot of detail, but it should set the stage for the rest of this website.
Basically, it boils down to the fact that current blockchain systems are pretty slow by modern standards.
To handle even simple payments in any widespread capacity, blockchains would need to process something on the order of a few thousand transactions per second.
Ethereum can currently only support 20-30 transactions per second at a max depending on network conditions. 

This discrepancy between what already exists and what needs to exist is generally called the "**blockchain scalability**" problem, and it's not an easy problem to solve!
We want to scale blockchain systems, but we also want to make sure we scale in a way that preserves security and decentralization.
After all, that's why we started building blockchains in the first place. 

Projects are tackling the scalability problem in lots of different ways.
Some of these projects are attempting to make blockchains more scalable by upgrading the blockchains themselves.
We often call this "layer 1" scaling because we're modifying the base layer.
Other projects are trying to build things on *top* of existing systems.
We usually refer to this as "layer 2" scaling because we're adding a new layer and not changing the underlying system. 

Plasma fits into this second category of "layer 2" scaling projects.
It's important to understand how layer 2 projects tend to work and what they're trying to accomplish.
Many layer 2 designs come from the observation that it's not necessary for everyone to know about every transaction that occurs on the network. 

Let's think about this for a second.
Imagine you buy a coffee from your local coffee shop every morning.
Besides the fact that that's a lot of coffee and you should definitely cut down, you might eventually notice that it's easier to pay if you use the shop's prepaid mobile wallet.
You load money into the wallet once and you don't have to pull out your wallet every time.
It's also faster and cheaper for the merchant because they don't have to go through a payment processor every time.
It's a win-win for everyone.

If we break this down, we can see that we're basically putting money into a local "ledger" that you maintain with the coffee shop, almost like a prepaid tab.
We've made everything easier because there's no reason to let the rest of the world know that you've made a payment to the coffee shop.
As long as you and the shop agree about your current balance, everything is easier. 

So this is really at the core of most layer 2 projects.
The above example is quite simple - it only involves two participants (you and the coffee shop).
However, people wanted to see if we could extend that idea to entire blockchains.
Would it be possible to transfer money from one blockchain to smaller (and cheaper) blockchain temporarily, move the money around on the second chain, and eventually transfer money back?
Turns out, it is!
Here's where we start to see the evolution of "sidechains." 

The basic idea here is that we can take assets from one chain and transfer them to another (called the "sidechain") by locking the assets up on the primary chain (or "root chain") and "creating" them again on the sidechain.
When you want to go back, you simply need to "destroy" the asset on the sidechain and unlock them on the root chain.

This sounds pretty simple, but there's one big catch - someone has to agree to "create" those assets on the sidechain.
So who gets to "create" the assets?
Well, the consensus mechanism, basically.
The idea here is that if the sidechain consensus mechanism is functioning properly, then your assets are safe.
Unfortunately, the sidechain is usually much less safe than the root chain.
If someone manages to create money "out of nowhere" that doesn't correspond to assets being locked up on the root chain, they can "destroy" these assets (that they fraudulently created) and steal lots of money. 

Obviously this isn't ideal.
As long as the sidechain is safe, your assets are safe.
But if the sidechain ever breaks down, then your assets might be stolen! Here's where we introduce Plasma.
Plasma was first developed as a way to get some of the benefits of sidechains while ensuring that the assets stored on the sidechain are always safe (as long as the root chain is safe).
We don't get *all* of the utility of sidechains, but we preserve some of the most important things (like being able to make transactions cheaply) while also maintaining security.
The fundamental principle of Plasma is that all user assets can always "fall back" to the root chain in the event of a security failure on the sidechain.

---

### Plasma Building Blocks
Blockchains are slow and expensive.
We want to make blockchains fast and cheap, but we don't want to sacrifice safety.
That's why we need Plasma.

So what exactly *is* Plasma?
Plasma is a way of building scalable decentralized applications that don't sacrifice security for speed.
Let's explore the components that make this possible.

##### Off-chain Execution
Plasma applications do a majority of their work outside of the "root chain" (e.g. Ethereum).
Root chains tend to be slow and costly because they need to be very secure.
If an application can do any work outside of the root blockchain, it should.

For example, in [Plasma MVP](./plasma-mvp.html), almost every transaction occurs outside of Ethereum.
Only deposits and withdrawals, the points of entry and exit, are ever handled on the smart contract.
This is a standard workflow for Plasma applications.
Anything that doesn't require assets/data moving in and out of your smart contract can probably be handled off-chain.

##### State Commitments
When we're doing so much off-chain, we need some way to make sure that our changes are final.
This is why we make use of something called a "state commitment."
A [state commitment](https://en.wikipedia.org/wiki/Commitment_scheme) is a cryptographic way to store a compressed version of the state of your application.

However, storing *everything* about your application would defeat the point of Plasma entirely.
We typically make use of [Merkle trees](./plasma-mvp.html#merkle-trees) instead.
These commitments become kind of like save points for your application.

##### Exits
Plasma applications make use of these commitments whenever a user wants to leave the Plasma chain.
We usually refer to this as "exiting" the application.

Let's illustrate this by imagining a payment network application!
The state commitments for this application will probably contain some information about how much money each user currently has.
If a user wants to withdraw ("exit") their money from this application, they need to prove to the smart contract that they have money to withdraw.
To do this, the user can use something called a [Merkle proof](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/).

---

These are the basic building blocks of most Plasma applications.
Next you'll be introduced to Plasma MVP, the first formal Plasma application to be specified.
There we'll explore how these blocks can be applied to create a real Plasma payment network.
