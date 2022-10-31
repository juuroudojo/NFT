import { ethers } from "hardhat";

async function main() {
  let ipfs = "https://gateway.pinata.cloud/ipfs/QmWn5BUiq9iRNreeKHQt8MeXPJATBA8Vu3nFf6M4PSJxov/"
  const GLS = await ethers.getContractFactory("GLS");
  const gls = await GLS.deploy(ipfs);

  await gls.deployed();

  console.log("GLS deployed to:", gls.address);

  const GLSFactory = await ethers.getContractFactory("GLSFactory");
  const glsFactory = await GLSFactory.deploy(
    gls.address,
    2004,
    "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed"
  );
  await glsFactory.deployed();
  console.log("PokemonsFactory deployed to: ", glsFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});