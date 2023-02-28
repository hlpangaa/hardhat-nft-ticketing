const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const _name = "Hin"
    const _symbol = "Hin"
    const _contractURI = "ipfs://QmPFmytBjskRqaFeBWq3Ub41sL9JMrGPAejTQcybJMMupP"
    const _supplyCap = 10
    const _mintFee = ethers.utils.parseEther("0.1") //100000000000000000
    const _priceCellingFraction = 110
    const _royaltyFeesInBips = 250
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const marketplace = nftMarketplace.address
    if (network.config.chainId == "31337") {
        feeRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        feeRecipient = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }

    log("----------------------------------------------------")
    const arguments = [
        _name,
        _symbol,
        _contractURI,
        _supplyCap,
        _mintFee,
        _priceCellingFraction,
        _royaltyFeesInBips,
        marketplace,
        feeRecipient,
    ]
    const contract = await deploy("EventContract", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(contract.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "EventContract"]
