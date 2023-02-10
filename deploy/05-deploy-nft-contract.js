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
    const _eventInfo = [
        "event descrption", //descrption;
        "default", //queuingMechanism;
        "ipfs://QmPFmytBjskRqaFeBWq3Ub41sL9JMrGPAejTQcybJMMupP",
        100, //seatcap1;
        100, // seatcap2;
        100, // seatcap3;
        100, // seatprice1;
        100, // seatprice2;
        100, // seatprice3;
        1, // priceCelling;
        1638352800, // startTime;
        0, // endTime;
    ]
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const marketplace = nftMarketplace.address
    const feeRecipient = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"

    log("----------------------------------------------------")
    const arguments = [_name, _symbol, _eventInfo, marketplace, feeRecipient]
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

module.exports.tags = ["all", "eventfactory"]
