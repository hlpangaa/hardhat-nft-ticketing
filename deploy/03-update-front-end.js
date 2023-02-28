const {
    frontEndContractsFile,
    frontEndContractsFile2,
    frontEndAbiLocation,
    frontEndAbiLocation2,
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")

async function main() {
    if (process.env.UPDATE_FRONT_END && network.config.chainId == "5") {
        console.log(
            `Writing to front end... in ${frontEndAbiLocation2} and ${frontEndContractsFile2}`
        )
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    fs.writeFileSync(
        `${frontEndAbiLocation2}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const eventFactory = await ethers.getContract("EventFactory")
    fs.writeFileSync(
        `${frontEndAbiLocation}EventFactory.json`,
        eventFactory.interface.format(ethers.utils.FormatTypes.json)
    )
    fs.writeFileSync(
        `${frontEndAbiLocation2}EventFactory.json`,
        eventFactory.interface.format(ethers.utils.FormatTypes.json)
    )

    const eventContract = await ethers.getContract("EventContract")
    fs.writeFileSync(
        `${frontEndAbiLocation}EventContract.json`,
        eventContract.interface.format(ethers.utils.FormatTypes.json)
    )
    fs.writeFileSync(
        `${frontEndAbiLocation2}EventContract.json`,
        eventContract.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const eventFactory = await ethers.getContract("EventFactory")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (
            !contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address) &&
            !contractAddresses[chainId]["EventFactory"].includes(nftMarketplace.address)
        ) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
            contractAddresses[chainId]["EventFactory"].push(eventFactory.address)
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
            EventFactory: [eventFactory.address],
        }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
