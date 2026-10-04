# BoundxyzV2

[![Bound](assets/bound-logo.svg)](https://bound.xyz)

Vault & Factory Staking System, maintained by iam-rekt.

A re-engineered staking model inspired by Curve Finance's vote-escrow design and ve(3,3) concepts, adapted for token-locking vaults, time-decaying voting power, and epoch-based rewards.

## Publication scope and safety

- Includes the local contract sources and reusable deployment scripts; contract logic is unchanged by this publication.
- Credentials, wallet-specific administration/recovery scripts, and deployment records are intentionally excluded.
- Network configuration is supplied for Base, HyperEVM, and Robinhood Chain. Confirm current network requirements and explorer settings before use.
- Factory tier deployment fees default to 3 and 10 native tokens (HYPE on HyperEVM, ETH on Base); these are not USD prices. Review before deploying on another chain.
- `Asset.sol` is a test token with unrestricted minting, not a production asset.
- Publishing this repository is not a security audit or verification of existing on-chain deployments.

A robust, multi-tenant smart contract system for token locking with linear decay voting power, NFT boosts, a competitive leaderboard, and a tiered, factory-based deployment model.

---

## Overview

The system consists of two main components:

-   **`Vault.sol`**: The core contract where users lock ERC20 tokens and NFTs to gain voting power. This power decays over time, and users participate in reward "epochs" to earn a share of token distributions.
-   **`VaultFactory.sol`**: A factory that deploys new `Vault` instances as gas-efficient clones. It manages a multi-tier system, allowing vault creators to choose a fee structure that suits their community.

---

## Core Mechanics

### 1. Voting Power Mechanism

-   **Linear Decay**: A user's base voting power is proportional to their locked token amount and decays linearly to zero from the moment of deposit until their lock period ends.
-   **Lock Extension**: Users can extend their lock duration or add more tokens at any time to reset their voting power decay, keeping them competitive in reward epochs.
-   **NFT Boosts**: Users can lock NFTs from approved collections to receive a percentage-based boost on their voting power, increasing their share of rewards.

### 2. Epoch and Reward System

-   **Reward Epochs**: Admins can start time-bound reward periods ("epochs") by funding them with any ERC20 token.
-   **Participation**: Users with active locks can participate in an epoch to become eligible for its rewards.
-   **Proportional Rewards**: Rewards are distributed based on each user's total voting power (including NFT boosts) calculated as an "area under the curve" for the duration of the epoch.

### 3. Leaderboard Competition

-   **Vault Top Holder**: The system tracks the user with the highest cumulative voting power across all epochs.
-   **Bonus Rewards**: A portion of each epoch's reward pool is reserved as a bonus for the current top holder, adding a competitive element.

### 4. Tiered Fee Structure

-   The `VaultFactory` offers three deployment tiers, each with a different economic model for deployment costs, deposit fees, and performance fees on rewards.
-   This allows vault creators to choose a model that aligns with their project's maturity and goals.

---

## Features

### Vault Contract (`Vault.sol`)

-   **Token & NFT Locking**: Locks ERC20 tokens and ERC721 NFTs to generate time-weighted voting power.
-   **Epoch-Based Rewards**: Manages reward distribution for multiple, distinct reward periods.
-   **Leaderboard Tracking**: Identifies and rewards the top community contributor.
-   **Security**: Built with OpenZeppelin contracts for security best practices (Reentrancy Guard, Ownable) and is upgradeable via the factory.
-   **Emergency Features**: Includes admin-controlled pause and emergency withdrawal mechanisms to protect user funds.

### Vault Factory (`VaultFactory.sol`)

-   **Gas-Efficient Deployment**: Uses a clone factory pattern to deploy new `Vault` instances cheaply.
-   **Tier Management**: Manages the three distinct vault tiers and their associated fee structures.
-   **Permissioned Creation**: Can be configured to allow only approved partners to create new vaults.
-   **System Configuration**: The owner can set key addresses, such as the `Vault` implementation and the main fee beneficiary.

---

## Getting Started

### Prerequisites

-   Node.js >=18.x
-   Yarn or npm
-   A Base Mainnet RPC URL and private key with ETH on Base (e.g., from [Alchemy](https://alchemy.com) or [Infura](https://infura.io))

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/iam-rekt/BoundxyzV2.git
    cd BoundxyzV2
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Copy `deployments/.env.example` to `deployments/.env` and populate it locally. Hardhat reads this file. Never commit credentials:
    ```
    BASE_MAINNET_RPC_URL="YOUR_BASE_MAINNET_RPC_URL_HERE"
    PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"
    ETHERSCAN_API_KEY="YOUR_BASESCAN_API_KEY_HERE"
    ```

### Deployment

The entire system, including all core contracts, a test ERC20 token, and a sample vault, can be deployed with a single command.

1.  Run the deployment script for Base Mainnet:
    ```bash
    npx hardhat run deployments/deploy_all.ts --network base
    ```
2.  The script will log the addresses of all deployed contracts and automatically attempt to verify them on Etherscan.

For HyperEVM, select `--network hyperevm`; for Robinhood Chain, select `--network robinhood`.
Deployment spends real native tokens. HyperEVM large-contract deployments may require enabling big blocks on the sender first.
Results are saved locally to ignored `deployments/deployed_<network>.json` files. Explorer verification can fail independently of deployment.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
