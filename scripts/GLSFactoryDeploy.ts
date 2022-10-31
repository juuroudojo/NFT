import { ethers } from "hardhat";

async function main() {
  const PokemonsFactory = await ethers.getContractFactory("PokemonsFactory");
  const pokemonsFactory = await PokemonsFactory.deploy(
    "Level.sol address",
    "Stones.sol address",
    "Pokemons.sol address",
    "Chainlink subsctiption id",
    "Chainlink VRF coordinator V2 address"
  );

  await pokemonsFactory.deployed();

  console.log("PokemonsFactory deployed to: ", pokemonsFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});