import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const METADATA_BASE_URI = "ipfs://bafybeiclu2xddpmbpgipirkjdrpxtnimpzm5a3cvfzlbpfa4irnyqfhf4u/metadata/";
const COLLECTION_NAME = "Butterfly Presale";
const COLLECTION_SYMBOL = "BFLY";
const MAX_SUPPLY = 100n;
const MINT_PRICE_WEI = 10_000_000_000_000_000n; // 0.01 ether

const deployButterflyPresale: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  log("\n🚀 Deploying ButterflyPresale...");

  await deploy("ButterflyPresale", {
    from: deployer,
    args: [COLLECTION_NAME, COLLECTION_SYMBOL, METADATA_BASE_URI, MAX_SUPPLY, MINT_PRICE_WEI, deployer],
    log: true,
    autoMine: true,
  });

  log("✅ ButterflyPresale deployed");
};

deployButterflyPresale.tags = ["ButterflyPresale"];

export default deployButterflyPresale;
