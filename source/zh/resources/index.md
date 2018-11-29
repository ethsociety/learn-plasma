---
title: 资源
lead: 这个页面包含一些可能对你有用的资源。
date: 2018-08-21 16:26:02
categories:
tags:
---

## 参与进来
### 在GitHub提Issues
如果你对Github不是很熟悉，可以从这里开始。
这个网站的所有资源都公开在这里[GitHub](https://github.com/ethsociety/plasma-website).
GitHub基本上是一个允许人们在线存储代码的网站。
每当我们对本网站进行更改时，我们都会更新已发布的代码！
这意味着您可以查看构成本网站的所有内容。
这也意味着您可以帮助添加内容！

GitHub的一个基本特性是能够创建称为“issues”的新话题。
基本上，这是任何人（包括您！）的一种方式，可以请求新功能，报告错误或提供一般反馈。
例如，如果您在网站上的某处发现拼写错误，则可以打开新问题！
您的问题可以帮助我们改善网站。
我们希望确保事情尽可能清晰明白。
如果你有什么不明白的地方，我们想了解！

如果你还没有Github账户，可以在这里([注册](https://github.com/join)).
如果你想开自己的第一个 issue， 可以从这里开始 [LearnPlasma的GitHub page](https://github.com/ethsociety/plasma-website).
会看到类似这个的页面:

![github3](/img/misc/github/github3.png)
<br><br>

然后点"Issues." 如果你找不到这个tab,可以直接点击这个链接:
[https://github.com/ethsociety/plasma-website/issues](https://github.com/ethsociety/plasma-website/issues).

然后你应该会到这个页面:

![github2](/img/misc/github/github2.png)
<br><br>

点绿色的按钮"New issue"然后你就会到一个可以让你描述issue的页面：

![github3](/img/misc/github/github3.png)
<br><br>


此表单有两个主要组成部分，即问题标题和问题正文。
问题标题是您的问题摘要，其他人将在“Issue”页面上看到。
你应该尽量保持这个标题内容的简洁和清晰！
像“主页上的错字”或“请求更多关于Plasma Cash的内容”之类的东西很快就让我们知道如何提供帮助。

问题正文是您问题的主要内容。
在这里，您需要填写手头问题的任何相关信息。
如果您发现拼写错误，将非常感谢提供指向错误页面的链接。
如果您要求新内容或者发现令人困惑的内容，那么写明你觉得那里不清楚，可以帮助我们更容易地推出更好的内容。

填写相关信息后，点击“提交新问题”按钮即可完成！
您刚刚提交了第一个GitHub问题。

完成相关内容之后，点 "Submit new issue" 就完成了！
你刚完成了自己的第一个GitHub issue.
希望这对你有所帮助 - 如果你还有困难，可以在这里发帖： [LearnPlasma subreddit](http://reddit.com/r/learnplasma), 向这发推特 [LearnPlasma Twitter account](https://twitter.com/learnplasma), 或者直接给我们发邮件 [contact@learnplasma.org](mailto:contact@learnplasma.org?Subject=GitHub%20Help).

## Plasma MVP 的设计标准
### 主链合约 
#### Events
##### `DepositCreated`

```
event DepositCreated(
    address indexed owner,
    uint amount,
    uint blockNumber
);
```

###### 要求
* **必须** 在每笔充值时产生。

##### `BlockSubmitted`
```
event BlockSubmitted(
    uint blockNumber,
    bytes32 blockRoot
);
```

###### 要求
* **必须** 必须在每个区块根被提交时产生。

##### `ExitStarted`
```
event ExitStarted(
    address indexed owner,
    uint blockNumber,
    uint txIndex,
    uint outputIndex,
    uint amount
);
```

###### 要求
* **必须** 必须在每笔退出发生时产生。

#### Structs
##### `PlasmaBlock`

```
struct PlasmaBlock {
    bytes32 root;
    uint timestamp;
}
```

##### `PlasmaExit`

```
struct PlasmaExit {
    address owner;
    uint amount;
    bool isActive;
    bool isBlocked;
}
```

#### Storage
##### Constants
###### `CHALLENGE_PERIOD`
```
uint constant public CHALLENGE_PERIOD;
```

###### 描述
一个退出在被处理前必须要等待的秒数。

###### `EXIT_BOND`
```
uint constant public EXIT_BOND;
```

退出前必须提供来作为基金的ETH数额。

##### Variables
###### `exitQueue`
```
PriorityQueue exitQueue;
```

###### 描述
A priority queue of exits.

###### `currentPlasmaBlockNumber`
```
uint public currentPlasmaBlockNumber;
```

###### 描述
现在Plasma chain的区块高度。单调递增，所以之后的区块不可以重写。

###### `operator`
```
address public operator;
```

###### 描述
运营员的地址。虽然运营员不见的非要时常量，但这样可以简化问题。

###### `plasmaBlocks`
```
mapping (uint => PlasmaBlock) public plasmaBlocks;
```

###### 描述
从区块编号对应到代表区块内容的`PlasmaBlock` structs的map。 应该 只有在运营员调用`SubmitBlock`的时候可以被更改。

###### `plasmaExits`
```
mapping (uint => PlasmaExit) public plasmaExits;
```

###### 描述
从exit IDs 对应到 `PlasmaExit` structs的map，在用户开始退出或挑战退出的时候被更改。

#### Methods
##### `deposit`
```
function deposit() public payable returns (uint blockNumber);
```

###### 描述
允许任何用户通过对交易加带币值来进行充值。

###### Returns
* `uint blockNumber` - 这笔充值被打包的区块。

###### 要求
* **必须** 创建一个新的`PlasmaBlock` 块。只包含单比输出值为 `msg.value`并由 `msg.sender`所以的交易。
* **必须** emit `DepositCreated`.

##### `submitBlock`
```
function submitBlock(bytes32 _blockRoot) public;
```

###### 描述
允许 `运营员`提交最新的区块根。

###### Params
* `bytes32 _blockRoot` - 区块中交易构成的 Merkle tree 的根哈希值。

###### 要求
* **必须** 确认 `msg.sender` 是 `运营员`.
* **必须** 插入一个新的 `PlasmaBlock` ，要包含 `_blockRoot` 和 `block.timestamp`.
* **必须** 给 `currentPlasmaBlockNumber`的值增加一。
* **必须** 发出 `BlockSubmitted`.

##### `startExit`
```
function startExit(
    uint _txoBlockNumber,
    uint _txoTxIndex,
    uint _txoOutputIndex,
    bytes _encodedTx,
    bytes _txInclusionProof,
    bytes _txSignatures,
    bytes _txConfirmationSignatures
) public payable returns (bool success);
```

###### 描述
允许任何用户通过指出一笔交易的产出，来从合约进行提现。

###### Params
* `uint _txoBlockNumber` - 交易产出被创建的区块编号。
* `uint _txoTxIndex` - 交易在块中的编号。
* `uint _txoOutputIndex` - 交易中产出的编号 (只会是0 或者 1)。
* `bytes _encodedTx` - 创建产出的的交易的RLP编码。
* `bytes _txInclusionProof` - 一个Merkle proof，可以证明 `_encodedTx` 是在 `_txoBlockNumber` ，`_txoTxIndex`。
* `bytes _txSignatures` - 每个交易输入的所有人的发起签名。.
* `bytes _txConfirmationSignatures` - 每个交易的确认签名。

###### Returns
* `bool success` - `true` 如果退出成功的话。 `false`就挂了。

###### 要求
* **必须** use `_txInclusionProof` to check that `_encodedTx` was included in the Plasma chain at `_txoBlockNumber` and `_txoTxIndex`.
* **必须** check that `msg.sender` owns the output of `_encodedTx` given by `_txoOutputIndex`.
* **必须** emit `ExitStarted`.

##### `challengeExit`
```
function challengeExit(
    uint _exitingTxoBlockNumber,
    uint _exitingTxoTxIndex,
    uint _exitingTxoOutputIndex,
    bytes _encodedSpendingTx,
    bytes _spendingTxConfirmationSignature
) public returns (bool success);
```

###### 描述
允许用户证明一个退出请求是合法的。

###### Params
* `uint _exitingTxoBlockNumber` - Block in which the exiting output was created.
* `uint _exitingTxoTxIndex` - Index of the transaction (within the block) that created the exiting output.
* `uint _exitingTxoOutputIndex` - Index of the exiting output within the transaction that created it (either 0 or 1).
* `bytes _encodedSpendingTx` - RLP encoded transaction that spends the exiting output.
* `bytes _spendingTxConfirmationSignature` - Confirmation signature by the owner of the exiting output over `_encodedSpendingTx`.

###### Returns
* `bool success` - `true` if the challenge was successful, `false` otherwise.

###### 要求
* **必须** check that `_encodedSpendingTx` spends the specified output.
* **必须** check that `_spendingTxConfirmationSignature` is correctly signed by the owner of the `PlasmaExit`.
* **必须** block the `PlasmaExit` by setting `isBlocked` to `true` if the above conditions pass.

##### `processExits`
```
function processExits() public returns (uint processed);
```

###### 描述
Pays out any exits that have passed their challenge period.

###### Returns
* `uint processed` - Number of exits processed by this call.

###### 要求
* **必须** process exits in priority order, based on minimum of `exitQueue`.
* **必须 NOT** pay any withdrawals where `isBlocked` is `true`.

---

### 侧链
#### Transaction Format
```
[
    [
        [blockNumber, txIndex, outputIndex],
        [blockNumber, txIndex, outputIndex]
    ],
    [
        [owner, amount],
        [owner, amount]
    ]
]
```

每个交易应该由两个输入和两个输出组成，以上述格式表示。输入和输出金额之间的差异代表交易费用。

##### Encoding
所有交易都应该 [RLP 编码](https://github.com/ethereum/wiki/wiki/RLP). 这个文档里, `encode(tx)` 指 RLP用上面的格式编码。

#### Transaction Signatures
交易必须要有交易输入的所有者签名。

##### 要求
* **应该** have users sign transactions over the message `Hash(encode(tx))` for simplicity. 
* **应该** use `keccak256` as `Hash` to simplify verification on Ethereum.

#### Confirmation Signatures
只有每个交易的所有者都签第二个"确认签名"交易才合法。确认签名 应该 只有在确认交易已经被包含在一个合法并且可用的块里，才被签。

##### 要求
* **必须** ask users to sign a confirmation signature once their transaction has been included in a valid, available block.
* **应该** have users sign confirmations over the message `Hash(Hash(encode(tx)))` for simplicity.

#### Block Format
每个块包含一个事务列表。通过在块中创建事务的固定大小Merkle树来计算块的 *root*。

##### 要求
* **应该** 这样计算  Merkle tree的叶子 as `Hash(Hash(encode(tx)) + tx.signatures)`.
* **应该** 用 `Hash(0)`来填充剩余的区块空间。

#### 交易
用户可以通过签署使用UTXO的事务来进行交易。这些交易应该从客户端直接发送给运营员。
