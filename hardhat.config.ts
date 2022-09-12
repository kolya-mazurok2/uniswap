import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-chai-matchers';
import 'dotenv/config';

const RINKEBY_URL = process.env.RINKEBY_URL;
const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

interface HardhatUserConfigWithGasReporter extends HardhatUserConfig {
  gasReporter: {
    enabled: boolean;
    gasPrice: number;
    coinmarketcap: string;
    currency: string;
  };
}

const config: HardhatUserConfigWithGasReporter = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: process.env.REPORT_GAS !== undefined || process.env.NODE_ENV === 'production',
        runs: 200
      }
    }
  },
  networks: {
    rinkeby: {
      url: RINKEBY_URL,
      accounts: [PRIVATE_KEY]
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    gasPrice: Number(process.env.GAS_PRICE) || 21,
    coinmarketcap: process.env.COIN_MARKET_API_KEY || '',
    currency: 'USD'
  }
};

export default config;
