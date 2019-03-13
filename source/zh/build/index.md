---
title: 动手开发
lead: 离子网络的生态需要你的力量。有许多项目正在使用离子网络作为框架火热的开发。这个页面维护了一个正在活跃的开源项目，你也可以参与！
sublead: 如果你在维护一个活跃的离子网络项目，尽管给我们开一个Github issue! 我们会把你的项目加入到这个页面. 同理，如果你发现这个页面上有需要更正的地方，也尽管给我们提Github issue。
date: 2018-08-21 16:26:02
categories:
tags:
---

## FourthState Labs
[<i class="fab fa-github"></i>](https://github.com/fourthstate)

FourthState Labs 是 Blockchain @ Berkeley 专注的离子网络的开发团队。


### plasma-mvp-rootchain
[<i class="fab fa-github"></i>](https://github.com/FourthState/plasma-mvp-rootchain)

FourthState Labs 在维护一个 Plasma MVP（极简离子网络）的以太坊智能合约。

**Stack:**
+ Solidity
+ JavaScript (Truffle)

### plasma-mvp-sidechain
[<i class="fab fa-github"></i>](https://github.com/FourthState/plasma-mvp-sidechain)

FourthState labs 在分开开发另一个 Plasma MVP 的基于tendermint consensus的客户端。

**Stack:**
+ Go

---

## OmiseGO
[<i class="fas fa-globe"></i>](https://omisego.network) [<i class="fab fa-github"></i>](https://github.com/omisego)

OmiseGO 在用 plasma 搭建一个可扩容的去中心化交易所和支付网络。

### plasma-contracts
[<i class="fab fa-github"></i>](https://github.com/omisego/plasma-contracts)

OmiseGO的生产环境plasma合约在这个repository里面。 The master branch currently tracks optimized Plasma MVP contracts.

**Stack:**
+ Solidity
+ Python

### plasma-mvp
[<i class="fab fa-github"></i>](https://github.com/omisego/plasma-mvp)

OmiseGO 在为他们的去中心化交易所搭建一个Plasma MVP的参考实现。 这个repo里的合约通常没有那么优化，但是比较有可读性。

**Stack:**
+ Solidity
+ Python

### plasma-cash
[<i class="fab fa-github"></i>](https://github.com/omisego/plasma-cash)

OmiseGO 的 Plasma Cash合约 和客户端实现，虽然项目是由很多外部的开发者维护的。

**Stack:**
+ Solidity
+ Python

---

## Loom Network
[<i class="fas fa-globe"></i>](https://loomx.io/) [<i class="fab fa-github"></i>](https://github.com/loomnetwork)

Loom 用 plasma 来扩展他们的针对专属应用（application specific）的侧链 (DAppChains).

### plasma-erc721
[<i class="fab fa-github"></i>](https://github.com/loomnetwork/plasma-erc721)

Loom 计划用 Plasma Cash 来确保他们侧链上不可替代资产的安全。

**Stack:**
+ Solidity
+ JavaScript (Truffle)
+ Python
+ Go


---

## Wolk
[<i class="fas fa-globe"></i>](https://wolk.com) [<i class="fab fa-github"></i>](https://github.com/wolkdb)

Wolk 在采用Plasma Cash作为他们呢去中心化的数据库服务架构的一部分。

### Plasmacash
[<i class="fab fa-github"></i>](https://github.com/wolkdb/deepblockchains/tree/master/Plasmacash)

Wolk 维护了一些 Plasma Cash 主链合约的实现。

**Stack:**
+ Solidity

---

## Lucidity
[<i class="fas fa-globe"></i>](https://lucidity.tech) [<i class="fab fa-github"></i>](https://github.com/luciditytech)

Lucidity 在用 Plasma Cash 结合一种稳定币应用在AdTech供应链支付中。

### Plasma Cash
[<i class="fab fa-github"></i>](https://github.com/luciditytech/lucidity-plasma-cash)

Lucidity维护了一套Plasma Cash的实现作为他们的侧链架构的一部分。这个repo包含了一个疏松Merkle Tree的实现，应用场景是AdTech供应链中多方参与的虚拟货币支付。

**Stack:**
+ Solidity
+ Javascript

---

## Kyokan
[<i class="fas fa-globe"></i>](https://plasma.kyokan.io/) [<i class="fab fa-github"></i>](https://github.com/kyokan)

Kyokan 在开发一套 plasma 的即插即用的库，这样让开发者可以更容易的开发离子链应用而不用担心底层的细节。

### Plasma MVP
[<i class="fab fa-github"></i>](https://github.com/kyokan/plasma)

Kyokan维护了一套Go语言实现的 Plasma MVP和子链。

**Stack:**
+ Solidity
+ Javascript (Truffle)
+ Golang
