---
title: Plasma Debit（离子网络借记）
lead: Discover how Plasma Debit combines Plasma Cash and payment channels.
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    引子: /zh/learn
    离子网络（Plasma）框架: /zh/learn/framework.html
    最简可用离子网络（Plasma MVP）: /zh/learn/mvp.html
    Plasma Cash: /zh/learn/cash.html
  after:
    对比: /zh/learn/compare.html
---

## Plasma Debit（离子网络借记）
[Plasma Debit](https://ethresear.ch/t/plasma-debit-arbitrary-denomination-payments-in-plasma-cash/2198) 与Plasma Cash类似, 区别是每个代币都是一个用户和运营员之间的支付通道（payment channel）。
这有点像一个大的闪电网络枢纽，但是正如Plasma Cash 代币，支付通道本身也可以被转账。

---

### 共识机制
就像 Plasma Cash 或 Plasma MVP一样, Plasma Debit 的离子链也可以选用任何共识机制。
但是，由于支付通道的引入，相比于一群验证者，Plasma Debit 更适用于采用一个单独的运营员。

### 充值
Plasma Debit的充值与[Plasma Cash的充值](/zh/learn/cash.html#deposits)基本一样。
用户向主链的智能合约发送资产，然后，在离子链上一个独特的代币会相应被创造。
与Plasma Cash不同的是，这个代币同时也是一个使用共识机制的支付通道。
有许多人同时共同参与的支付通道很难实现，所以这里更适用的是单独的运营员模式。

![pd-channels](/img/learn/debit/pd-channels.png)

### 交易事务
Plasma Debit与Plasma Cash的主要不同在于交易事务。
相比于每次在需要的支付的时候，转账整个代币，你只需要使用支付通道就好了！
当一个用户需要向另一个用户转账的时候，他只需要向离子链的运营员转账，然后让运营员同时向另一个用户转账。

问题是这要求转账的收款者也需要和运营员之间有一个支付通道！
更具体的说，收款者需要在一个*运营员有资产的*支付通道。
如果收款者暂时与运营员还没有支付通道，那么这就会是个很大的用户体验问题。
我们没法指望每人都提前加入到网络中，这可怎么办呢？

这就是我们可以利用Plasma Debit类似于Plasma Cash的一些特性的地方了。
Plasma Debit中的支付通道本身是代币，就像Plasma Cash一样 - 它们也可以被转账给别的用户。

比如说**A**有一个支付通道并且打算发送 1 ETH 给 **B**，而**B**暂时还没有在网络中。

**B** 没法直接自己创建一个支付通道，因为他需要一个运营员有至少1个ETH的支付通道。
这意味，运营员需要为**B**创建一个支付通道。
如果每有一个新的用户加入到网络中，运营员就要创建一个新的支付通道的话，那也太麻烦了，但幸好他们并不需要！
运营员只需要提前与他自己创建一批支付通道就好，然后在之后必要的时候把他们转给第一次收款的用户。

![pd-xfer](/img/learn/debit/pd-xfer.png)

那现在 **A** 和 **B**都有了所需的支付通道了，我们就可以开始进行通道转账了！
这类的支付是非常快的（几乎立刻到账）并且非常简单。

![pd-payment](/img/learn/debit/pd-payment.png)

### 提现
提现对于Plasma Debit来说也进本和 [Plasma Cash中的提现一样](/zh/learn/cash.html#withdrawals)。
但是，要记住的是Plasma Debit的支付通道允许你只花代币的一部分（fractional parts）。
所以，相比于必须提现整个代币，用户现在可以只提现代币的一部分。
如果用户花费了一个1ETH代币的一半，那他依然可以提现0.5个ETH。

通常讲，Plasma Debit的退出挑战与Plasma Cash一样。
这些挑战机制保证提现者确实是代币的拥有者。
但如果用户已经花费了代币的一半，但却想提现一整个代币呢？ 
Plasma Debit为此增加了一类挑战：如果有人证明有一笔更新的有提现用户签名的（不同的）账户余额，那么提现会被立刻阻止。


### 方案的优缺点
Plasma Debit相对Plasma Cash有很大提升。
因为它类似雷电枢纽的机制，交易非常的廉价并且迅捷。
最好的是，你只需要关注自己的交易通道。

但是，这个设计也有自己的缺点。
与Plasma Cash类似，用户每次将一个通道转给另外一个用户，都需要提供证明。
这样的证明可能会变的[非常大](/zh/learn/cash.html#pros-and-cons).

像我们之前提到过的，用户需要与运营员有交易通道，才可以收款。
交易员很可能会需要预先创建很多交易通道来转给新用户。
而每一个这样的通道，都需要运营员锁一些资产。
根据网络的大小看，这可能需要锁很多的资产！

虽然这里我们不打算深入的讨论，但是交易通道这种方案本身也有自己的问题。
这些主要还是会造成终端用户的体验问题。

而对于跨币种支付Plasma Debit并不比Plasma Cash好很多。
目前还没有很好的Plasma Debit去中心化交易所的提案。
