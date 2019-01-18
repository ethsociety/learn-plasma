---
title: Plasma Prime
lead: Discover how Plasma 101 Resources
date: 2019-01-18 12:30:02
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

## Plasma Prime

This is a high-level overview of the things I think people should look at if trying to understand the current state of plasma. It's probably missing a lot, feel free to ping me if you think something should be on this list. Apologies in advance if I missed anything!

---

### Introduction

These resources are basic, high-level overviews of plasma. These are meant to prime you on the general idea of plasma without going into too much detail.

* [The Plasma Framework](https://www.learnplasma.org/en/learn/framework.html)
* [What is Plasma? Plasma Cash?](https://medium.com/crypto-economics/what-is-plasma-plasma-cash-6fbbef784a)
* [An introduction to Plasma](https://hackernoon.com/plasma-8bba7e1b1d0f)

---

### Generalized Plasma

A lot of people want to know about "generalized" plasma chains - chains where you can run general applications (like smart contracts). Unfortunately, this is a lot harder than it seems.

* [Why is EVM-on-Plasma hard?](https://medium.com/@kelvinfichter/why-is-evm-on-plasma-hard-bf2d99c48df7)
* [Plasma Leap](https://ethresear.ch/t/plasma-leap-a-state-enabled-computing-model-for-plasma/3539/1)

---

### State of Plasma

This is the "where we're at" section. These resources will give you a high-level look at the different research going on and who's working on what.

* [Plasma World Map](https://ethresear.ch/t/plasma-world-map-the-hitchhiker-s-guide-to-the-plasma/4333)
* [The State of Plasma #1](https://media.consensys.net/the-state-of-plasma-1-6b48c1e4b295?gi=55e5d4ed6a8a)
* [Whatever happened to nested plasma chains?](https://medium.com/@kelvinfichter/whatever-happened-to-nested-plasma-chains-ee9d66d33536)

---

### Current Projects

* [Actively Maintained Plasma Repositories](https://www.learnplasma.org/en/build/)

---

### Current Research

* [Plasma Research Questions](https://www.learnplasma.org/en/research/)

---

### Research Frontier

These topics are what I'd consider the current frontier of plasma research and what's being most actively explored.

---

#### Plasma Prime

Plasma Prime is a fancy new design that makes use of RSA accumulators (section below) to solve the problem of [large history proofs in Plasma Cash](https://ethresear.ch/t/plasma-xt-plasma-cash-with-much-less-per-user-data-checking/1926). Unfortunately there aren't any good and cohesive documents that explain Plasma Prime (yet). The implementers call below is likely the best high-level overview of Plasma Prime to date.

* [Plasma Cash (Predecessor to Plasma Prime)](https://www.learnplasma.org/en/learn/cash.html)
* [Plasma Prime (Implementers Call)](https://www.youtube.com/watch?v=YjTF05SeYxo&feature=youtu.be&t=68)
* [Plasma Prime Design Proposal](https://ethresear.ch/t/plasma-prime-design-proposal/4222)

---

#### RSA Accumulators

An RSA accumulator is a type of [cryptographic accumulator](https://en.wikipedia.org/wiki/Accumulator_(cryptography)). The first link below is likely the best place to get started understanding what RSA accumulators are, the other links are good if you want to understand how they're being used in plasma land.

* [A Deep Dive on RSA Accumulators](https://blog.goodaudience.com/deep-dive-on-rsa-accumulators-230bc84144d9?gi=4d9b04db130a)
* [RSA Accumulators for Plasma Cash history reduction](https://ethresear.ch/t/rsa-accumulators-for-plasma-cash-history-reduction/3739/1)
* [Compact RSA inclusion/exclusion proofs](https://ethresear.ch/t/compact-rsa-inclusion-exclusion-proofs/4372)
* [Short RSA exclusion proofs for Plasma Prime](https://ethresear.ch/t/short-rsa-exclusion-proofs-for-plasma-prime/4318/1)

---

#### "Defragmentation"

Recent work introduces a new way of thinking about [fungible tokens in Plasma Cash](https://ethresear.ch/t/plasma-cash-was-a-transaction-format/4261). Basically, we represent tokens as a big number line. Users own "chunks" (ranges) of this number line. These ranges can be combined if they're immediately next to each other and user data storage grows with the number of chunks instead of the number of total owned tokens.

This introduces the interesting problem of defragging the ranges. As users spend their tokens, they slowly break apart their ranges and receive ranges in weird spots. We want to determine an optimal method for reducing the average number of ranges that people own.

* [Plasma Cash defragmentation](https://ethresear.ch/t/plasma-cash-defragmentation/3410)
* [Plasma Cash defragmentation, take 2](https://ethresear.ch/t/plasma-cash-defragmentation-take-2/3515)
* [Plasma Cash defragmentation, take 3](https://ethresear.ch/t/plasma-cash-defragmentation-take-3/3737)
* [Plasma Cash was a transaction format](https://ethresear.ch/t/plasma-cash-was-a-transaction-format/4261)

---

#### Zero Knowledge

As zero knowledge constructions become increasingly more viable for production, people are starting to propose more ZK-based plasma designs.

* [SNARK based Side-Chain for ERC20 tokens](https://ethresear.ch/t/snark-based-side-chain-for-erc20-tokens/4361)
* [A sketch for a STARK-based accumulator](https://ethresear.ch/t/a-sketch-for-a-stark-based-accumulator/4382/1)
* [Short S[NT]ARK exclusion proofs for Plasma](https://ethresear.ch/t/short-s-nt-ark-exclusion-proofs-for-plasma/4438)