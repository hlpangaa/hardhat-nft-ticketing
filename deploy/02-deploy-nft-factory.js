const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const marketplace = nftMarketplace.address
    if (network.config.chainId == "31337") {
        feeRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        feeRecipient = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }

    const platformFee = 0

    log("----------------------------------------------------")
    const arguments = [marketplace, feeRecipient, platformFee]
    const eventFactory = await deploy("EventFactory", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(eventFactory.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "eventfactory"]
