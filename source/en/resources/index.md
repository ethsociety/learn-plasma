---
title: Resources
lead: This page contains resources you might find useful.
date: 2018-08-21 16:26:02
categories:
tags:
---

## Contributing
### Making GitHub Issues
If you're not familiar with GitHub, this is the place for you.
All of the resources on this website are available publicly on [GitHub](https://github.com/ethsociety/plasma-website).
GitHub is basically a website that allows people to store code online.
Whenever we make changes to this website, we're really updating the published code!
This means you can see all of the content that makes up this website.
It also means you can help add content!

A fundamental feature of GitHub is the ability to create new threads called "issues."
Basically, this is a way for anyone (including you!) to request new features, report bugs, or give general feedback.
For example, you can open a new issue if you spot a typo somewhere on the website!
Your issues help us make this website better.
We want to make sure things are as clear as possible.
If there's something you don't understand, we want to know!

You'll want to make a GitHub account if you don't have one already ([click here](https://github.com/join)).
If you'd like to make your first issue, start by heading over to the [LearnPlasma GitHub page](https://github.com/ethsociety/plasma-website).
You should see something like this:

![github1](/img/misc/github/github1.png)
<br><br>

Now, you'll want to click on the tab titled "Issues." If you can't find the tab, you can get to the issues page directly by heading to this link:
[https://github.com/ethsociety/plasma-website/issues](https://github.com/ethsociety/plasma-website/issues).

You should be on this page:

![github2](/img/misc/github/github2.png)
<br><br>

Click the green "New issue" button and you'll end up on a page with a form where you can describe your issue:

![github3](/img/misc/github/github3.png)
<br><br>

This form has room for two main components, the issue title and the issue body.
The issue title is the summary of your issue that other people will see on the "Issues" page.
You should try to keep this title as short and clear as possible!
Something short like "Typo on the home page" or "Requesting more content about Plasma Cash" quickly lets us know how to help.

The issue body is the main content of your issue.
Here, you'll want to fill in any relevant information to the issue at hand.
If you spot a typo, a link to the page with the typo would be much appreciated.
If you're requesting new content or you find something confusing, a summary of what's unclear makes it easier to put out better content.

Once you've filled in the relevant information, hit the "Submit new issue" button and you're done!
You've just submitted your first GitHub issue.
Hopefully this helped - if you're still stuck you can make a post on the [LearnPlasma subreddit](http://reddit.com/r/learnplasma), tweet at the [LearnPlasma Twitter account](https://twitter.com/learnplasma), or shoot us an email at [contact@learnplasma.org](mailto:contact@learnplasma.org?Subject=GitHub%20Help).

## Plasma MVP Specification
### Root Chain Contract 
#### Events
##### `DepositCreated`

```
event DepositCreated(
    address indexed owner,
    uint amount,
    uint blockNumber
);
```

###### Requirements
* **MUST** be emitted whenever a deposit is created.

##### `BlockSubmitted`
```
event BlockSubmitted(
    uint blockNumber,
    bytes32 blockRoot
);
```

###### Requirements
* **MUST** be emitted whenever a block root is submitted.

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

###### Requirements
* **MUST** be emitted whenever an exit is started.

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

###### Description
Time in seconds an exit must wait before it can be processed.

###### `EXIT_BOND`
```
uint constant public EXIT_BOND;
```

Amount in ETH that must be provided as a bond when starting an exit.

##### Variables
###### `exitQueue`
```
PriorityQueue exitQueue;
```

###### Description
A priority queue of exits.

###### `currentPlasmaBlockNumber`
```
uint public currentPlasmaBlockNumber;
```

###### Description
Current Plasma chain block height. Should only ever be incremented so a block can’t be later rewritten.

###### `operator`
```
address public operator;
```

###### Description
Address of the operator. Although the operator does not necessarily need to remain constant, it’s likely easier if this is the case.

###### `plasmaBlocks`
```
mapping (uint => PlasmaBlock) public plasmaBlocks;
```

###### Description
A mapping from block number to `PlasmaBlock` structs that represent each block. Should only be modified when the operator calls `SubmitBlock`. 

###### `plasmaExits`
```
mapping (uint => PlasmaExit) public plasmaExits;
```

###### Description
A mapping from exit IDs to `PlasmaExit` structs, to be modified when users start or challenge exits. 

#### Methods
##### `deposit`
```
function deposit() public payable returns (uint blockNumber);
```

###### Description
Allows any user to deposit funds into the contract by attaching a value to the transaction.

###### Returns
* `uint blockNumber` - Block in which this deposit was inserted. 

###### Requirements
* **MUST** create a new `PlasmaBlock` consisting of a single transaction with an output of `msg.value` owned by `msg.sender`.
* **MUST** emit `DepositCreated`.

##### `submitBlock`
```
function submitBlock(bytes32 _blockRoot) public;
```

###### Description
Allows `operator` to submit the latest block root.

###### Params
* `bytes32 _blockRoot` - Root hash of the Merkle tree of transactions in the block.

###### Requirements
* **MUST** check that `msg.sender` is `operator`.
* **MUST** insert a new `PlasmaBlock` with `_blockRoot` and `block.timestamp`.
* **MUST** increment `currentPlasmaBlockNumber` by one.
* **MUST** emit `BlockSubmitted`.

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

###### Description
Allows any user to attempt to withdraw funds from the contract by pointing to a transaction output.

###### Params
* `uint _txoBlockNumber` - Block number in which the transaction output was created.
* `uint _txoTxIndex` - Index of the transaction inside the block.
* `uint _txoOutputIndex` - Index of the output inside the transaction (either 0 or 1).
* `bytes _encodedTx` - RLP encoded transaction that created the output.
* `bytes _txInclusionProof` - Merkle proof that `_encodedTx` was included at `_txoBlockNumber` and `_txoTxIndex`.
* `bytes _txSignatures` - Initial signatures by the owners of each input to the transaction.
* `bytes _txConfirmationSignatures` - Confirmation signatures by the owners of each input to the transaction.

###### Returns
* `bool success` - `true` if the exit was successful, `false` otherwise.

###### Requirements
* **MUST** use `_txInclusionProof` to check that `_encodedTx` was included in the Plasma chain at `_txoBlockNumber` and `_txoTxIndex`.
* **MUST** check that `msg.sender` owns the output of `_encodedTx` given by `_txoOutputIndex`.
* **MUST** emit `ExitStarted`.

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

###### Description
Allows any user to prove that a given exit is invalid.

###### Params
* `uint _exitingTxoBlockNumber` - Block in which the exiting output was created.
* `uint _exitingTxoTxIndex` - Index of the transaction (within the block) that created the exiting output.
* `uint _exitingTxoOutputIndex` - Index of the exiting output within the transaction that created it (either 0 or 1).
* `bytes _encodedSpendingTx` - RLP encoded transaction that spends the exiting output.
* `bytes _spendingTxConfirmationSignature` - Confirmation signature by the owner of the exiting output over `_encodedSpendingTx`.

###### Returns
* `bool success` - `true` if the challenge was successful, `false` otherwise.

###### Requirements
* **MUST** check that `_encodedSpendingTx` spends the specified output.
* **MUST** check that `_spendingTxConfirmationSignature` is correctly signed by the owner of the `PlasmaExit`.
* **MUST** block the `PlasmaExit` by setting `isBlocked` to `true` if the above conditions pass.

##### `processExits`
```
function processExits() public returns (uint processed);
```

###### Description
Pays out any exits that have passed their challenge period.

###### Returns
* `uint processed` - Number of exits processed by this call.

###### Requirements
* **MUST** process exits in priority order, based on minimum of `exitQueue`.
* **MUST NOT** pay any withdrawals where `isBlocked` is `true`.

---

### Child Chain
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

Every transaction should consist of two inputs and two outputs, represented in the above format. The difference between the input and output amounts represent the transaction fee.

##### Encoding
All transactions should be [RLP encoded](https://github.com/ethereum/wiki/wiki/RLP). In this documentation, `encode(tx)` refers to RLP encoding a transaction in the above format.

#### Transaction Signatures
Transactions must be signed by the owner of each input. 

##### Requirements
* **SHOULD** have users sign transactions over the message `Hash(encode(tx))` for simplicity. 
* **SHOULD** use `keccak256` as `Hash` to simplify verification on Ethereum.

#### Confirmation Signatures
Transactions are only considered valid if the owner of each input also signs a second "confirmation signature." Confirmation signatures should only be signed if the transaction was included in a valid, available block.

##### Requirements
* **MUST** ask users to sign a confirmation signature once their transaction has been included in a valid, available block.
* **SHOULD** have users sign confirmations over the message `Hash(Hash(encode(tx)))` for simplicity.

#### Block Format
Each block consists of a list of transactions. The *root* of a block is computed by creating a fixed-size Merkle tree of the transactions in the block.

##### Requirements
* **SHOULD** compute the leaves of the Merkle tree as `Hash(Hash(encode(tx)) + tx.signatures)`.
* **SHOULD** pad any remaining block space with `Hash(0)`.

#### Transacting
Users can transact by signing transactions that spend UTXOs. These transactions should be sent from the client directly to the operator.
