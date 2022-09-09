import { ethers } from 'hardhat';

const INITIAL_SUPPLY = 100000;

async function main() {
  const FactoryContractFactory = await ethers.getContractFactory('Factory');
  const factoryContract = await FactoryContractFactory.deploy();
  await factoryContract.deployed();
  console.log(`Factory deployed to: ${factoryContract.address}`);

  const TokenContractFactory = await ethers.getContractFactory('Token');
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

  const primaryExchangeAddress = await factoryContract.createExchange(primaryTokenContract.address);
  const secondaryExchangeAddress = await factoryContract.createExchange(
    secondaryTokenContract.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
