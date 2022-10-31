import * as dotenv from "dotenv";
import { task } from "hardhat/config";
dotenv.config();

const contractAddress = "0xBBdd0DDAec6Abc8fB65D86a50E8521bF6Fc71520";

task("mint721", "Mint 721 nft")
  .setAction(async (taskArgs, hre) => {
    const Nft = await hre.ethers.getContractFactory("TMNT");
    const nft = Nft.attach(contractAddress);
    const output = await nft.mint(taskArgs.uri);
    console.log(output);
  });