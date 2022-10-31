import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, BigNumber } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("NFT721", function () {
  let TMNT: ContractFactory;
  let tmnt: Contract;
  let Splinter: SignerWithAddress;
  let Leonardo: SignerWithAddress;
  let Donatello: SignerWithAddress;
  let Mikey: SignerWithAddress;

  before(async function () {
    [Splinter, Leonardo, Donatello, Mikey] = await ethers.getSigners();
  });

  beforeEach(async function () {
    TMNT = await ethers.getContractFactory("TMNT");
    tmnt = await TMNT.deploy();
    await tmnt.deployed();
  });

  it("Mint: Should mint properly", async function () {
    await tmnt.mint();
    await tmnt.connect(Leonardo).mint();

    expect(await tmnt.balanceOf(Splinter.address)).to.equal(1);
    expect(await tmnt.balanceOf(Leonardo.address)).to.equal(1);
  });

  // ?Is testing a value stored in .env ok?
  it("Token URI: Should return correct URI", async function () {
    const URI = "https://gateway.pinata.cloud/ipfs/QmZTmtRyHgeyzqzy652q37zmQrU22M1ALTojvTGUs3jjAj/1.json";
    await tmnt.mint();
    expect(await tmnt.tokenURI(1)).to.equal(URI);
  });

  it("Transfer: Should transfer", async function () {
    await tmnt.mint();
    await tmnt.transferFrom(Splinter.address, Mikey.address, 1);

    expect(await tmnt.balanceOf(Mikey.address)).to.equal(1);
    expect(await tmnt.balanceOf(Splinter.address)).to.equal(0);
    expect(await tmnt.ownerOf(1)).to.equal(Mikey.address);
  });

  it("Transfer: Should safeTransfer", async function () {
    await tmnt.mint();
    await tmnt["safeTransferFrom(address,address,uint256)"](Splinter.address, Mikey.address, 1);

    expect(await tmnt.balanceOf(Mikey.address)).to.equal(1);
    expect(await tmnt.balanceOf(Splinter.address)).to.equal(0);
    expect(await tmnt.ownerOf(1)).to.equal(Mikey.address);
  });

  it("Approval: Should approve", async function () {
    await tmnt.mint();
    await tmnt.approve(Donatello.address, 1);
    await tmnt.connect(Donatello).transferFrom(Splinter.address, Leonardo.address, 1);

    expect(await tmnt.balanceOf(Leonardo.address)).to.equal(1);
    expect(await tmnt.ownerOf(1)).to.equal(Leonardo.address);

    expect(tmnt.connect(Mikey).transferFrom(Leonardo.address, Splinter.address, 1)).to.be.revertedWith("ERC721: caller is not token owner nor approved")
  });

  it("Events: Emit Transfer", async function () {
    expect(await tmnt.mint()).to.emit(tmnt, "Transfer").withArgs('0', Splinter.address, 1);
  });

  it("Events: Emit Approval", async function () {
    await tmnt.mint();
    expect(await tmnt.approve(Mikey.address, 1)).to.emit(tmnt, "Approval").withArgs(Splinter.address, Mikey.address, 1);
  });
});

