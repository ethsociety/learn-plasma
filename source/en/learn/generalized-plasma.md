---
title: Generalized Plasma
lead: Why is EVM-on-Plasma hard?
date: 2018-12-22 11:15:02
categories:
tags:
links:
  before:
    Introduction: /en/learn
    The Plasma Framework: /en/learn/framework.html
    Plasma MVP: /en/learn/mvp.html
    Plasma Cash: /en/learn/cash.html
    Plasma Debit: /en/learn/debit.html
  after:
    Comparison: /en/learn/compare.html
---

## Generalized Plasma

It is difficult to create a Plasma chain that operates a lot like Ethereum does today and is capable of running more general smart contracts. This page seeks to address the question, ["Why is EVM-on-Plasma hard?,"](https://medium.com/@kelvinfichter/why-is-evm-on-plasma-hard-bf2d99c48df7) with an introduction to possible solutions, such as the informal “Plasma VM” design.

## Current Plasma Designs and Limitations for General Smart Contracts

Most of the current work around Plasma basically just makes use of very simple UTXOs or non-fungible tokens. Creating a a Plasma chain that allows users to deploy EVM smart contracts poses unresolved design issues over withdrawals, namely:

(1) It’s not always clear who gets to move a contract from the Plasma chain to the root chain;

(2) If anyone can modify the state of the contract, then anyone can block an exit; and

(3) Validating EVM state changes inside the EVM is hard.

### It’s not always clear who gets to move a contract from the Plasma chain to the root chain.

One fundamental property of Plasma is that state represented on a Plasma chain must be able to be withdrawn to the root chain (e.g. Ethereum) in a way that maintains the integrity of that state. In other words, you should be able to freely move assets from the Plasma chain to the root chain, and vice versa, which is particularly important when a Plasma consensus mechanism goes “bad” and users are forced to withdraw their assets.

In the case of smart contracts, it is difficult to maintain the secure withdrawal properties of Plasma without a clear answer to "**who gets to move a contract from the Plasma chain to the root chain,**" including moving the state, balance, and code of such contract. The risk of mischief here is problematic for Plasma chain security and a better mechanism is needed: if we allowed just anyone to withdraw the contract, then (rude) users would almost definitely just withdraw as many contracts as possible to make the Plasma chain unusable.   

### If anyone can modify the state of the contract, then anyone can block an exit.

To recap the Plasma chain withdrawal process: remember that we can block an exit if we show that the state being withdrawn is somehow invalid. In the event that a contract is withdrawn, its current state is specified; during the contract's exit challenge period, there is the chance that its state might change (such as transferring ownership of a digital asset) and make the original exit ripe for blocking. **If anyone can modify the state of the contract, then anyone can block an exit,** which is not ideal for Plasma security.

### Validating EVM state changes inside the EVM is hard.

Finally, and related to the above example, we need to validate that the state change presented in a challenge is actually a valid state change and **validating EVM state changes inside the EVM is hard.** 

Specifically, if we want to validate single EVM steps in a trustless way, then we need to implement the EVM inside the EVM, which is non-trivial, to say the least. Check out this [EIP](https://github.com/ethereum/EIPs/issues/726) to understand why it’s so difficult (gas limits inside gas limits, etc.)

## Potential Solutions

With regard to the issues highlighted above, it is simple to resolve withdrawal authority in the case of a simple account contract with one owner, for example; similarly, in the case of a multi-sig account, we could also design a few different mechanisms to determine when the multisig is moved to the root chain: e.g., maybe every user in the multisig needs to sign off, maybe n-of-m users need to sign off, or maybe only one user needs to sign off. These seem to be valid solutions for mechanism design.

For more complicated contract ownership questions, it is difficult to resolve withdrawal authority without risking too much centralization or high costs. For example, while a voting mechanism could help determine when a contract moves from the Plasma chain to the root chain, (i) a small set of eligible voters would highly centralize control over the contract, while on the other hand, (ii) the more users eligible to vote, the more expensive the voting mechanism.  

In terms of validating EVM executions, TrueBit could offer a potential solution, though this option would basically kill the security properties of Plasma by making it dependent on an external system.

### Plasma VM

Resolving these tensions is an active area of research and discussion. One promising solution, informally dubbed “Plasma VM," basically involves breaking typical smart contracts down to a level where these questions don’t matter as much. 

Specifically, Plasma VM proposes reframing authority to move a contract from the Plasma chain to the root chain using "mini smart contracts"; in other words, instead of worrying about "who gets to move a contract from the Plasma chain to the root chain," Plasma VM stipulates that it might be more clear who’s responsible for moving stuff to the root chain if, instead of moving the entire contract, everyone were moving their own "mini smart contracts" that can only be modified by their respective owners.

Accordingly, this simple shift in design makes the first and second problems almost entirely irrelevant. The overall gist: it’s probably easiest to use something like TXVM and a high-level language that feels like writing EVM smart contracts but automatically breaks things down in the way just outlined above.
