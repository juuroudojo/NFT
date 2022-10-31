import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, BigNumber } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("GLSFactory", function () {
  let GLS: ContractFactory;
  let gls: Contract;
  let GLSFactory: ContractFactory;
  let glsFactory: Contract
  let ipfs = "https://gateway.pinata.cloud/ipfs/QmWn5BUiq9iRNreeKHQt8MeXPJATBA8Vu3nFf6M4PSJxov/"

  let Luffy: SignerWithAddress;
  let Zoro: SignerWithAddress;
  let Sanji: SignerWithAddress;
  let Brook: SignerWithAddress;
  
  let vrfCoordinatorV2Mock: ContractFactory;
  let hardhatVrfCoordinatorV2Mock: Contract;
  

  beforeEach(async function () {
    // Signers
    [Luffy, Zoro, Sanji, Brook] = await ethers.getSigners();
    
    // Deploying GLS contract
    GLS = await ethers.getContractFactory("GLS");
    gls = await GLS.deploy(ipfs);
    await gls.deployed();
    
    // Deploying VRFCoordinator
    vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    hardhatVrfCoordinatorV2Mock = await vrfCoordinatorV2Mock.deploy(0, 0);
    await hardhatVrfCoordinatorV2Mock.deployed();
    await hardhatVrfCoordinatorV2Mock.createSubscription();
    await hardhatVrfCoordinatorV2Mock.fundSubscription(1, ethers.utils.parseEther("7"));

    // Deploying GLSFactory contract
    GLSFactory = await ethers.getContractFactory("GLSFactory");
    glsFactory = await GLSFactory.deploy(
      gls.address,
      1,
      hardhatVrfCoordinatorV2Mock.address
    );
    await glsFactory.deployed();

    await gls.initialize(glsFactory.address);

    await hardhatVrfCoordinatorV2Mock.addConsumer(1, glsFactory.address);
  });

  describe("Main functionality", function () {
    it("Should mint a random character to Zoro", async function () {
      const tx = await glsFactory.connect(Zoro).getRandomCharacter();
      const { events } = await tx.wait();
      const [requestId] = events.filter((x: { event: string; }) => x.event === "RequestedRandomness")[0].args;

      await hardhatVrfCoordinatorV2Mock.fulfillRandomWords(requestId, glsFactory.address);
    });

    it("Should mint a random character to Sanji", async function () {
      const tx = await glsFactory.connect(Sanji).getRandomCharacter();
      const { events } = await tx.wait();
      const [requestId] = events.filter((x: { event: string; }) => x.event === "RequestedRandomness")[0].args;

      await hardhatVrfCoordinatorV2Mock.fulfillRandomWords(requestId, glsFactory.address);

      expect(glsFactory.connect(Sanji).getRandomCharacter()).to.be.revertedWith("You can only mint 1 character for free!");
    });

    it("Should buy character correctly", async function() {
      expect(gls.connect(Zoro).mintCharacter(Zoro.address, 2)).to.be.revertedWith("Revert message");
      expect(glsFactory.buyRandomCharacter()).to.be.revertedWith( "Not enough berries!");

      expect(gls.connect(Sanji).mintBerries(Zoro.address, 8, 100, 0x00)).to.be.revertedWith('revertMessage');

      expect(glsFactory.getBerries({value: "0"})).to.be.revertedWith("Can't be zero!");
      await glsFactory.getBerries({value: ethers.utils.parseEther("0.1")});
      await glsFactory.buyRandomCharacter();
    });

    it("Should burn characters correctly", async function() {
      expect(gls.connect(Zoro).initialize(Zoro.address)).to.be.revertedWith('revertMessage');

      gls.initialize(Zoro.address);
      gls.connect(Zoro).mintCharacter(Zoro.address, 1);

      expect(gls.connect(Sanji).burnCharacter(Zoro.address, 1)).to.be.revertedWith('revertMessage');

      gls.connect(Zoro).burnCharacter(Zoro.address, 1);
    });
  });

  describe("uri", function () {
    it("Should return correct NFT metadata", async function () {
      const blackbeardUri = "https://gateway.pinata.cloud/ipfs/QmWn5BUiq9iRNreeKHQt8MeXPJATBA8Vu3nFf6M4PSJxov/1.json";

      expect(await gls.uri(1)).to.equal(blackbeardUri);
    });
  });

  describe("supportsInterface", function () {
    it("Should return a bool indicating whether the interface is supported", async function () {
      expect(await gls.supportsInterface("0x70a08231"))
        .to.be.a('boolean');
    });
  });

  describe("asSingletonArray", function () {
    it("Should return an array", async function () {
      let ar = await gls.asSingletonArray(1);
      console.log(ar);
    });
  });
  });