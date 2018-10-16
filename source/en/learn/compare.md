---
title: Compare
lead: Learn about the differences between the most popular plasma design applications.
date: 2018-08-21 16:26:02
categories:
tags:
links:
  before:
    Introduction: /en/learn
    The Plasma Framework: /en/learn/framework.html
    Plasma MVP: /en/learn/mvp.html
    Plasma Cash: /en/learn/cash.html
    Plasma Debit: /en/learn/debit.html
---

## Compare

<div id="plasma-comparison-table" class="table-responsive">
  <table class="table table-bordered table-font-md">
    <thead>
      <tr>
        <th>Plasma Design</th>
        <th>Plasma MVP</th>
        <th>Plasma Cash</th>
        <th>Plasma Debit</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>
          Composition
        </th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>
          Block Data Structure
        </th>
        <td>
          <ul>
            <li>Binary Merkle tree</li>
            <li>Block proposers create blocks(e.g Operator in PoA)</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Sparse Merkle tree with 'slots' (representing each coin or user's unique deposit)</li>
            <li>Each block has a 'slot' for each coin (unique deposit)</li>
            <li>When a coin is spent, transaction proof is recorded in that coin's respective slot in the block</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Sparse Merkle tree with 'slots' (representing each coin or user's unique deposit)</li>
            <li>Each block has a 'slot' for each coin (unique deposit)</li>
            <li>When coin is spent, transaction proof is recorded in that coin's respective slot in the block</li>
            <li>Unlike Plasma Cash, coin also acts a payment channel where the operator acts as a hub</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Consensus</th>
        <td>Any consensus (e.g., PoW, PoA, PoS)</td>
        <td>Any consensus (e.g., PoW, PoA, PoS)</td>
        <td>Single or few operators preferred over many because of payment channel structure</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th>Features</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>Deposits</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">Value Representation:</span> UTXOs</li>
            <li><span class="font-weight-bold">MVP:</span> ETH, ERC20 support possible</li>
            <li><span class="font-weight-bold">MoreVP:</span> ETH, ERC20 support possible</li>
          </ul>
        </td>
        <td>
          <ul>
            <li><span class="font-weight-bold">Value Representation:</span> Unique coin IDs for each deposit (e.g., 1ETH deposit = (1ETH) NFT coin)</li>
            <li>NFTs only (FTs unscalable as merging/splitting creates large Merkle roots for small denominations)</li>
            <li>Pending coin defragmentation research to support FTs</li>
          </ul>
        </td>
        <td>
          <ul>
            <li><span class="font-weight-bold">Value Representation:</span> Accounts with unique coin IDs for each deposit</li>
            <li>NFTs and FTs (Debit is similar to Cash but allows fractions of tokens as coins represent payment channels not deposits themselves)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Transactions</th>
        <td>
          <ul>
            <li>Users spend UTXOs to create new outputs</li>
            <li>UTXO transfers in any denomination</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Users spend coin IDs to create new outputs</li>
            <li>Coins non-divisible, merging/splitting difficult to implement</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Between account/coin owner and chain operator</li>
            <li>Coins non-divisible, no merging or splitting</li>
            <li>Users have payment channels with operators, in the form of coins</li>
            <li>New users who don't have a payment channel are provided a channel by the operator to facilitate transactions</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Fees</th>
        <td>
          <ul>
            <li>Users pay plasma transaction fees to validators and gas fees when exiting/withdrawing to rootchain or other chains</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Users pay plasma transaction fees to validators and gas fees when exiting/withdrawing to rootchain or other chains</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Users pay via operator-led payment channel instead of directly to other users, operator subtracts transaction fees from value being transferred</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Signatures</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">MVP:</span> Transaction signature before block inclusion, confirmation signature post-inclusion; signatures must be sent to operator (PoA)</li>
            <li><span class="font-weight-bold">MoreVP:</span> Transaction signature only, no confirmation signatures</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Confirmation signatures to avoid griefing</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>No confirmation signatures</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Exits/Withdrawals</th>
        <td>
          <ul>
            <li>Proof of unspent UTXO required to exit, confirmation signatures required for MVP</li>
            <li><span class="font-weight-bold">MVP:</span> Exit priority based on priority, older UTXOs have priority</li>
            <li><span class="font-weight-bold">MoreVP:</span> Exit priority based on youngest input of exit txn, as long as input is from valid txn</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Proof of coin's latest two transactions, proof of block inclusion</li>
            <li>No exit priority</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Proof of coin's latest two transactions, proof that fraction of coin hasn't been previously spent proof of block inclusion</li>
            <li>No exit priority</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Bonds</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">MVP:</span> Exit bond</li>
            <li><span class="font-weight-bold">MoreVP:</span> Exit bond and piggyback bond (for in-flight transactions if chain is byzantine, without confirmation signatures</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Exit bond</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Exit bond</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Challenges</th>
        <td>
          <ul>
            <li>Challenge by submitting proofs of spent UTXO</li>
            <li>Challenger puts up bond against their challenge</li>
            <li>Challenge period est. 7-14 days (limited by capacity if each exit in a mass exit was challenged)</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Challenge by submitting proofs of spent coin, proofs of invalid spending between latest two transactions or proofs of some other invalid transaction in coin's history</li>
            <li>Challenger puts up bond against their challenge</li>
            <li>Challenge period est. 7-14 days (limited by capacity if each exit in a mass exit was challenged)</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Challenge by submitting proofs of spent coin, proofs of invalid spending between latest two transactions or proofs of some other invalid transaction in coin's history</li>
            <li>Challenger puts up bond against their challenge</li>
            <li>Challenge period est. 7-14 days (limited by capacity if each exit in a mass exit was challenged)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Proofs Required</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">State Updates:</span> Proofs of UTXO ownership, state transitions and block inclusion</ul>
            <li><span class="font-weight-bold">Challenges:</span> Proof of spent UTXO, lack of signatures or no block inclusion</ul>
          </ul>
        </td>
        <td>
          <ul>
            <li><span class="font-weight-bold">State Updates:</span> Proofs of coin ownership, past transfers and block inclusion</li>
            <li><span class="font-weight-bold">Challenges:</span> Proof of spent coins, lack of signatures or no block inclusion</li>
            <li>Enables much less per-user data checking as users only need to keep track of their own coins</li>
            <li>Proofs are also passed onto other users and only proofs of spent coins need to be included in blocks</li>
          </ul>
        </td>
        <td>
          <ul>
            <li><span class="font-weight-bold">State Updates:</span> Proofs of coin ownership, past transfers and block inclusion</li>
            <li><span class="font-weight-bold">Challenges:</span> Proof of spent coins, lack of signatures or no block inclusion</li>
            <li>Enables much less per-user data checking as users only need to keep track of their own coins</li>
            <li>Proofs are also passed onto other users and only proofs of spent coins need to be included in blocks</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Other Features</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">MoreVP:</span> Omitting confirmation signatures for user experience introduces increased complexity if chain is byzantine (e.g., block withholding) putting in-flight transactions at risk, solved by requiring an exit bond</li>
          </ul>
        </td>
        <td>
          <ul>
            <li><span class="font-weight-bold">Cash:</span> Coins have automatic proof of exclusion if they are not included in block</li>
            <li><span class="font-weight-bold">XT:</span> Addition of checkpointing to the rootchain to reduce size of Merkle root per coin, thus limiting storage/computation requirements per chain</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Resembles a large 'Lightning Hub' on a plasma chain</li>
            <li>Users hold payment channels with operator alone (not other users)</li>
            <li>Operators create many channels in advance to ensure new users can transact with existing users</li>
          </ul>
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th>Utility</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>Pros</th>
        <td>
          <ul>
            <li><span class="font-weight-bold">MVP:</span> Scalable, all signatures sent to operator in PoA</li>
            <li><span class="font-weight-bold">MoreVP:</span> Scalable and more trustless than MVP</li>
            <li>High fungibility</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Very scalable, watchers or users themselves need to only keep track of their own coins not all coins on the chain</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Very scalable, watchers or users themselves need to only keep track of their own coins</li>
            <li>Enables transactions with NFTs and FTs</li>
            <li>Efficient balance updates don't need to be included in blocks as agreement can be made between operator and coinholder (similar to channels)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Cons</th>
        <td>
          <ul>
            <li>Watchers or users themselves are required to watch and challenge invalid exits</li>
            <li>Transaction bonding creates poor UX .</li>
            <li>Potential for honest bond slashing if operator withholds blocks and user attempts to re-submit transaction (once operator begins creating blocks again, the 2nd transaction will be 'invalid')</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Watchers or users themselves need to watch and challenge invalid transactions with their own coins, (vigilance is necessary, may be poor UX)</li>
            <li>Coins are in fixed denomination (no splitting/merging)</li>
            <li>Coin proofs can be massive (must prove all the way back to block where coin was created)</li>
            <li>Transaction bonding creates poor UX</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Heavy reliance on operator, can be hedged by creating a set of rotating operators</li>
            <li>Coin proofs can be massive (must prove all the way back to block where coin was created)</li>
            <li>Requires operator to lock up significant funds in advance to fund payment channels</li>
            <li>Transaction size constrained by initial coin deposit size  (similar to lightning/payment channels) </li>
            <li>Enabling decentralized exchange on Debit is non-trivial</li>
            <li>Payment channels can create UX challenges</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th>Use Cases</th>
        <td>
          <ul>
            <li>Transactions of NFTs or FTs</li>
            <li>Low-trust use cases (PoA)</li>
            <li>Exchanges, capital markets trading, securities</li>
            <li>P2P payments, remittances, recurring/bill payments</li>
            <li>Loyalty/rewards, gaming </li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Transactions of NFTs only (collectibles, data tokens etc); pending coin defragmentation research to support FTs</li>
            <li>Asset management (real estate, art, securities)</li>
            <li>Gaming </li>
          </ul>                                                                            
        </td>
        <td>
          <ul>
            <li>Transactions of NFTs or FTs</li>
            <li>Use cases with high-trust of operators, ewallet or service providers</li>
            <li>Prepaid or wallet top-up payments</li>
            <li>P2P payments, remittances, recurring/bill payments</li>
            <li>Loyalty/rewards, gaming</li>
            <li>Asset management (real estate, art, securities)</li>
          </ul>
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th>Resources</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>
          <a href="https://ethresear.ch">ethresear.ch</a>
        </th>
        <td>
          <a href="https://ethresear.ch/c/plasma">Plasma (All)</a>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <th>
          <a href="https://www.learnplasma.org">learnplasma.org</a>
        </th>
        <td>
          <a href="https://www.learnplasma.org/docs/plasma-mvp.html">Plasma MVP</a>
        </td>
        <td>
          <a href="https://www.learnplasma.org/docs/plasma-cash.html">Plasma Cash</a>
        </td>
        <td>
          <a href="https://www.learnplasma.org/docs/plasma-debit.html">Plasma Debit</a>
        </td>
      </tr>
      <tr>
        <th>GitHub</th>
        <td>
          <a href="https://github.com/omisego/plasma-mvp">Plasma MVP (OmiseGO)</a>
        </td>
        <td>
          <a href="https://github.com/loomnetwork/plasma-cash">Plasma Cash (Loom Network)</a>
        </td>
        <td>
        </td>
      </tr>
    </tbody>
  </table>
</div>
