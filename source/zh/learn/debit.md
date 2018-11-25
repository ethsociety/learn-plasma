---
title: 离子网络借记（Plasma Debit）
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

## 离子网络借记（Plasma Debit）
[Plasma Debit](https://ethresear.ch/t/plasma-debit-arbitrary-denomination-payments-in-plasma-cash/2198) is like Plasma Cash, except every token is a payment channel between the user and the chain operator.
It's sort of like a big Lightning hub, but the channels can be transferred just like a Plasma Cash token!

---

### 共识机制
Like Plasma Cash or Plasma MVP, Plasma Debit can make use of pretty much any consensus mechanism.
However, because of the way it makes use of payment channels, Plasma Debit is more suited for single operators than for lots of validators.

### 充值
Deposits in Plasma Debit are basically the same as [deposits in Plasma Cash](/zh/learn/cash.html#deposits).
Users send some asset to the plasma chain's smart contract, and a unique token is created for those assets.
Unlike Plasma Cash, this token is also a payment channel with the consensus mechanism!
It's hard to have a payment channel with lots of people simultaneously, so this really lends itself to single operators.

![pd-channels](/img/learn/debit/pd-channels.png)

### 交易事务
Transactions are really where Plasma Debit differs from Plasma Cash.
Instead of needing to transfer the entire token to someone whenever you'd like to make a payment, you can simply make use of the payment channel!
When a user wants to pay another user, they simply pay the operator and have the operator pay the other user simultaneously.

The problem here is that the recipient needs to have a payment channel with the operator too!
More specifically, the recipient needs to have a channel *where the operator has funds*.
This is a huge user experience issue if the recipient doesn't already have a payment channel with the operator.
We can't expect everyone to be part of the network in advance, so what do we do?

Here's where we take advantage of the Plasma Cash-like features of Plasma Debit.
The payment channels in Plasma Debit are tokens, just like in Plasma Cash - they can be transferred to other users!
Let's say **A** has a payment channel and wants to send money (1 ETH) to **B**, who isn't part of the network yet.

**B** can't just create this payment channel by themselves because they need a channel where the operator has at least 1 ETH.
Instead, the operator needs to create the channel for **B**.
It'd be inconvenient for the operator to have to create a new channel whenever a user joins the network, but they don't need to!
The operator can just create a bunch of channels in advance (with themselves), and transfer them to users who are receiving a payment for the first time.

![pd-xfer](/img/learn/debit/pd-xfer.png)

Now that **A** and **B** both have the necessary channels, we can start making channel payments!
These payments are super fast (almost instant!) and super simple.

![pd-payment](/img/learn/debit/pd-payment.png)

### 提现
Withdrawals in Plasma Debit are also basically the same as [withdrawals in Plasma Cash](/zh/learn/cash.html#withdrawals).
However, remember that Plasma Debit payment channel transactions allow you to spend fractional parts of your tokens.
So instead of having to withdraw entire tokens, users are allowed to withdraw fractions of tokens.
If a user spent half of a 1 ETH token, then they're allowed to withdraw 0.5 ETH.

Generally the exit challenges stay the same as in Plasma Cash.
These challenges ensure that the person withdrawing a token is actually that token's owner.
But what if a user tries to withdraw an entire token when they already spent half of it?
Plasma Debit solves this by adding one more challenge that blocks the exit if someone reveals a later balance signed by the withdrawing user.

### 方案的优缺点
Plasma Debit is a big improvement over Plasma Cash.
Because it acts like a big Lightning hub, transactions are cheap and super fast.
Best of all, you still only need to keep track of your own channels. 

However, the design does have its downsides.
Users still need to transmit a proof whenever they want to transfer a channel to someone else, just like in Plasma Cash.
This proof can be [pretty big](/zh/learn/cash.html#pros-and-cons).

As we mentioned before, users needs a payment channel with the operator in order to receive money.
Operators will probably create lots of channels in advance that can be transferred to new users.
Each of these channels requires the operator lock up some funds.
Depending on how big the network gets, that might be a lot locked up funds!

Although we won't get too much into them, payment channels also have problems of their own.
These mainly create UX headaches for end-users.

Plasma Debit isn't much better than Plasma Cash for cross-currency payments.
There currently aren't any great Plasma Debit DEX proposals.
