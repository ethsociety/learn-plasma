---
title: Build Minimum Viable Plasma omisego/plasma-mvp
date: 2018-08-21 15:54:06
categories:
- cat1
- cat2
tags:
- tag1
- tag2
---

Lets start testing [plasma-mvp](https://github.com/omisego/plasma-mvp).

One possible configuration will be:

+ Ethereum supports the `root_chain` contract.
+ The Python `child_chain` reference implementation handles events when they are fired in the root contract.
+ The `client` and `cli` can communicate with the `child_chain` RPC.
