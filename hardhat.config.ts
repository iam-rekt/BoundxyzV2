import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config({ path: __dirname + '/deployments/.env' });
const {
  BASE_MAINNET_RPC_URL,
  HYPEREVM_RPC_URL,
  ROBINHOOD_RPC_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  HYPEREVM_API_KEY,
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      // Pin the EVM target. Cancun is supported on HyperEVM; drop to 'shanghai'
      // only if you hit an unsupported-opcode error during deploy.
      evmVersion: 'cancun',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    base: {
      url: BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 8453,
    },
    // HyperEVM mainnet. NOTE: deploying the Vault (~23KB) exceeds the 2M-gas
    // "small block" cap — enable big blocks on the deployer EOA first
    // (Hyperliquid L1 action `usingBigBlocks`), then run deploy_all.ts.
    hyperevm: {
      url: HYPEREVM_RPC_URL || 'https://rpc.hyperliquid.xyz/evm',
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 999,
    },
    // Robinhood Chain mainnet (Arbitrum Orbit, ~10 blocks/sec). The vault
    // system is entirely block.timestamp-based, so the fast block cadence is
    // harmless; note block.number here returns the parent-chain block number.
    // Public RPC is rate-limited — set ROBINHOOD_RPC_URL to a private
    // endpoint if the deploy script hits 429s.
    robinhood: {
      url: ROBINHOOD_RPC_URL || 'https://rpc.mainnet.chain.robinhood.com',
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 4663,
    },
  },
  etherscan: {
    apiKey: {
      base: ETHERSCAN_API_KEY || '',
      hyperevm: HYPEREVM_API_KEY || '',
      // Blockscout ignores the key but the plugin requires a non-empty value.
      robinhood: 'blockscout',
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api?chainid=8453',
          browserURL: 'https://basescan.org',
        },
      },
      {
        // Verify against the HyperEVM explorer. Confirm the apiURL for your
        // chosen explorer (e.g. hyperevmscan.io) — or skip auto-verify and
        // use Sourcify instead.
        network: 'hyperevm',
        chainId: 999,
        urls: {
          apiURL: 'https://api.etherscan.io/v2/api?chainid=999',
          browserURL: 'https://hyperevmscan.io',
        },
      },
      {
        network: 'robinhood',
        chainId: 4663,
        urls: {
          apiURL: 'https://robinhoodchain.blockscout.com/api',
          browserURL: 'https://robinhoodchain.blockscout.com',
        },
      },
    ],
  },
};

export default config;
