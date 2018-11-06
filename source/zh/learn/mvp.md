---
title: 最简可用离子网络（Plasma MVP）
lead: 最简可用离子网络。Learn more about Minimal Viable Plasma by exploring it in depth.
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    引子: /zh/learn
    离子网络（Plasma）框架: /zh/learn/framework.html
  after:
    离子网络现金(Plasma Cash): /zh/learn/cash.html
    离子网络借记（Plasma Debit）: /zh/learn/debit.html
    对比: /zh/learn/compare.html
---

## 最简可用离子网络（Plasma MVP）
[Plasma MVP](https://ethresear.ch/t/minimal-viable-plasma/426) 极简的基于 [UTXO](https://www.investopedia.com/terms/u/utxo.asp)的离子网络链（plasma chain）。
最简可用离子网络（Plasma MVP）设计支持高吞吐量的的支付，但是除此外，并不支持相对复杂的构建，比如脚本和智能合约。
那在这个页面，我们会介绍最简可用离子网络（Plasma MVP）背后的设计过程。
你会了解最简可用离子网络（Plasma MVP）到底是怎样工作的，还有它的设计考量。
我们还提供了详细的 [设计文档](/zh/resources#plasma-mvp-specification)，这样你可以实现自己的最简可用离子网络（Plasma MVP）！

---

### 背景
区块链目前非常的慢（比特币和以太坊等主流的链）。其他号称高速的链大多也只是在测试网中达到过几千每秒的交易速度。
而即使想满足最简单的支付应用场景，区块链也必须要提速。
如果我们在以太坊上处理交易的话，每秒仅仅能处理10-25笔交易。
而现实生活的交易的话，每秒至少要能处理几千笔。
更别提以太坊的交易费在拥堵的时候非常高，因为交易的数额和交易的优先级无关，所以即使很小数额的交易，链对安全的保证也是没有调整的。这显然很没必要。

#### 链下扩容
我们很久前就知道，有一种相对简单的扩容去区块链的方法，那就是 [造](https://gendal.me/2014/10/26/a-simple-explanation-of-bitcoin-sidechains/) [新](https://bitcoinmagazine.com/guides/what-altcoin/) [链](https://github.com/ethereum/wiki/wiki/Sharding-FAQs).
如果我们增加链的数量，那么，所有的链的处理吞吐量总和也会增加。
但是，每次性能出问题就加新链并不是好办法。
增加新链只会减少整个区块链生态的安全性（有限的总验证算力需要分给更多的链），并且带来糟糕的用户体验。

[侧链](https://blockstream.com/sidechains.pdf)的引入，提供了一种新的选项，这样我们可以创造新的资产锚定于主链的”侧“链。
和其他的区块链系统一样，侧链需要自己的共识机制来确定区块的次序。
如果共识机制崩溃，或者被攻击，用户的资产则有被盗的风险。而这就是我们需要通过离子网络（Plasma）来解决的问题。

---

### 共识
区块链通常需要共识机制。
离子网络（Plasma）链是特别的区块链，这在于即使在离子网络（Plasma）共识机制崩溃的时候，用户的资产也可以有保证。
因此，最简单的离子链依赖于一个叫做“运营员”（**operator**）的组件。
一个“运营员”（**operator**）是离子链的实际操控者，并且负责创建所有区块。
如果你想更多了解区块链的专有名词，我们可以说最简可用离子网络（Plasma MVP）是依赖于“权威证明”的（**Proof-of-Authority**）。

这可能感觉多少有些奇怪，我们通常讲去中心化，在设计区块链协议种，不去信任第三方么？ 
但是离子网络（Plasma）的特性可以保证用户的资产，即使在“运营员”想要做恶的时候，也是可以保证的。
这个核心特性，使得通过最简可用离子网络（Plasma MVP）实现私有链，同时保证用户始终完全掌控资产，成为可能。
接下来，我们会介绍具体是如何保证用户对资产的控制的。

### 充值
用户开始使用离子链，要先在一个以太坊的智能合约中**充值**。
最基本的最简可用离子网络（Plasma MVP）只允许用户充值ETH，但是设计很容易通过扩展来支持ERC20代币。
当用户充值的时候，一个离子链上的区块会专门为这一笔单独的交易产生。
这笔交易会充值的用户创建一个新的和用户充值价值相等的交易余额（output）。
在用户充值之后，用户就可以开始在离子链上进行交易了！

### 交易
用户可以在离子链上用过使用已经拥有的余额（output）进行交易，并产生新的余额。
在实际操作中，这意味着用户需要对一笔交易进行签名，然后把交易发给“运营员”

接下来，离子链“运营员”会把收到的很多交易按照次序打包到一个区块里面。
当“运营员”收到足够多的交易的时候，它就会把这个区块的commitment发到以太坊。
为了解释这个commitment具体的原理，我们要先了解一下Merkle trees。

#### Merkle Trees
Merkle trees在区块链领域中是极为重要的数据结构(广义讲在计算机科学中也是如此)。
简单讲，Merkle trees可以让我们能够在一组数据中写入一些新的数据，在不需要暴露具体数据的情况下，允许用户证明，自己新的数据的确已经被包含在这一组数据中了。

比如，假设我有10个数字，那我可加入一个新的数字的写入（commitment）并且证明，我特定的新的数字已经被加入到了这组数字中。
这样的写入，数据量很小，并且大小固定的，所以发布到以太坊很便宜。

发散这个想法，我们可以用类似的方法写入一组新的交易。然后，我们之后可以证明，特定的交易已经被包含。
而这完全就是“运营员”的实际作用！每个新的区块都会包含一组交易，而之后会被转化成一个Merkle tree。
这个Merkle Tree 的根节点就是同每个离子链区块一同发布到以太坊的写入操作（**commitment**）。

### 提现
用户必须能够从离子链对他们的资产进行提现（我们有时候也称之为从链上”退出“）
当用户需要提现的时候，他们会向以太坊提出”退出“的trannsaction。

#### 开始一次退出
Because funds in MVP are represented as UTXOs, each exit must point to a specific output.
We also want to make sure that only the person who actually owns that output can withdraw it.
Therefore, in order to start a withdrawal, a user needs to submit a **Merkle Proof** along with the exit.
The smart contract checks this proof to make sure that the transaction that created the output was actually included in some block.
The contract then also checks that the output is owned by the user who started the exit.

#### 挑战一个退出
However, if that's all that was needed in order to withdraw, then users would be able to withdraw outputs they'd already spent! We want to make sure that the output being referenced is actually unspent, so we introduce a **challenge period**.
Basically, a challenge period is a period of time in which people can challenge the validity of the exit by proving that the UTXO is actually spent.
Users can prove a UTXO is spent by revealing another transaction that spends the UTXO signed by the user who started the exit.

#### 退出优先级
The exit protocol we just described allows people to withdraw their funds from the plasma chain.
Unfortunately, the plasma operator is allowed to do evil things, like include double-spending transactions, and we can't really do anything to stop them.
The operator can even start a withdrawal from an output created by an invalid transaction.

How do we handle this? Well, we want users who made valid transactions to get funds before any user who makes an invalid transaction.
Conveniently, we only need to add a few rules to make sure user funds are safe.
The first of these rules is that UTXO have an "exit priority" based on when they were included in the plasma chain.
The exact priority is based on the "position" of the UTXO in the blockchain.
This position is first determined by the block, then the index of the transaction in the block, then the index of the output in the transaction.
This gives us a unique, static position for every single UTXO.

Note then that "older" UTXOs withdraw before newer ones.
That means that if an invalid transaction is ever included in the blockchain, then all transactions that occurred before the invalid transaction will be processed before that invalid one.
We've solved half of our problem! 

#### 签名确认
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

### 监控离子网络侧链
In order to keep their funds completely safe, users need to watch the plasma chain every once in a while.
This consists of running a piece of software that automatically syncs (downloads) the plasma chain and makes sure everything is running as expected.
Users should run this software at least once every few days, although the exact time depends on parameters set by the Plasma MVP smart contract.

If the plasma chain is running normally, then users don't need to do anything else.
However, if something ever goes irreversibly wrong (hopefully an extremely rare occurrence), then the user's wallet will automatically start to withdraw their funds from the plasma chain.
This automatic withdrawal is what keeps user funds safe, even in the very worst case when a malicious operator is trying to steal funds.

Although this is critical for users to be 100% sure that their funds are safe, companies know that users just won't run this sort of software all the time.
This is why it's really important to design systems that incentivize certain people to run this software on other user's behalf, sort of like watchtowers in the lightning network.
Companies should also run the software that watches the plasma chain and alerts users in whatever way possible if something goes wrong.

---

### 更可用的离子网络（More Viable Plasma）
Confirmation signatures make for pretty bad user experience.
Users need to sign a signature before making a transaction, wait to see the transaction included in a valid block, and then sign another signature.
These second signatures must also be included within a plasma block, reducing block space available for more transactions!
[More Viable Plasma](https://ethresear.ch/t/more-viable-plasma/2160), also known as MoreVP, is an extension to Minimal Viable Plasma that removes the need for confirmation signatures.

Plasma MVP relies on confirmation signatures because withdrawals are processed in order based on the position of the output being withdrawn.
In a nutshell, MoreVP modifies the process through which users can withdraw their funds.
The ordering of each withdrawal becomes based on the position of the *youngest input* to the transaction that created an output.

This new ordering requires lots of updates to the challenges that make sure only honest users can withdraw their funds.
An [updated version](https://github.com/omisego/elixir-omg/blob/develop/docs/morevp.md) of the MoreVP specification is currently being maintained and expanded by OmiseGO.
