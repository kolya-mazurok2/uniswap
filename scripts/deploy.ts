import { ethers } from 'hardhat';

const INITIAL_SUPPLY = 100000;

async function main() {
  const FactoryContractFactory = await ethers.getContractFactory('Factory');
  const TokenContractFactory = await ethers.getContractFactory('Token');

  const factoryContract = await FactoryContractFactory.deploy();
  await factoryContract.deployed();
  console.log(`Factory deployed to: ${factoryContract.address}`);

  const primaryTokenContract = await TokenContractFactory.deploy('Primary', 'PRM', INITIAL_SUPPLY);
  await primaryTokenContract.deployed();
  console.log(`Primary token deployed to: ${primaryTokenContract.address}`);

  const secondaryTokenContract = await TokenContractFactory.deploy(
    'Secondary',
    'SCD',
    INITIAL_SUPPLY
  );
  await secondaryTokenContract.deployed();
  console.log(`Secondary token deployed to: ${secondaryTokenContract.address}`);

  const primaryExchange = await factoryContract.createExchange(primaryTokenContract.address);
  const primaryExchangeReady = await primaryExchange.wait();
  if (primaryExchangeReady.confirmations === 1) {
    const primaryExchangeAddress = await factoryContract.getExchange(primaryTokenContract.address);
    console.log(`Primary exchange deployed to: ${primaryExchangeAddress}`);
  }

  const secondaryExchange = await factoryContract.createExchange(secondaryTokenContract.address);
  const secondaryExchangeReady = await secondaryExchange.wait();
  if (secondaryExchangeReady.confirmations === 1) {
    const secondaryExchangeAddress = await factoryContract.getExchange(
      secondaryTokenContract.address
    );
    console.log(`Secondary exchange deployed to: ${secondaryExchangeAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
