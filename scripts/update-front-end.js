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
    if (process.env.UPDATE_FRONT_END) {
        console.log(`Writing to front end... in :`)
        console.log(`1. ${frontEndContractsFile},`) //nextJS nextworkMapping
        console.log(`2. ${frontEndContractsFile2},`) //subgraph nextworks
        console.log(`3. ${frontEndAbiLocation},`) //nextJS ABI
        console.log(`4. ${frontEndAbiLocation2}`) //subgraph ABI

        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    //next-js abi - need 3:
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const eventFactory = await ethers.getContract("EventFactory")
    fs.writeFileSync(
        `${frontEndAbiLocation}EventFactory.json`,
        eventFactory.interface.format(ethers.utils.FormatTypes.json)
    )
    const eventContract = await ethers.getContract("EventContract")
    fs.writeFileSync(
        `${frontEndAbiLocation}EventContract.json`,
        eventContract.interface.format(ethers.utils.FormatTypes.json)
    )

    //subgraph abi only listen marketplace and factory contract;
    if (network.config.chainId.toString() == 5) {
        const nftMarketplace_deployment_json = JSON.parse(
            fs.readFileSync(`./deployments/goerli/NftMarketplace.json`, "utf8")
        )
        const eventFactory_deployment_json = JSON.parse(
            fs.readFileSync(`./deployments/goerli/EventFactory.json`, "utf8")
        )
        nftMarketplace_abi = nftMarketplace_deployment_json["abi"]
        eventFactory__abi = eventFactory_deployment_json["abi"]
        fs.writeFileSync(
            `${frontEndAbiLocation2}NftMarketplace.json`,
            JSON.stringify(nftMarketplace_abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation2}EventFactory.json`,
            JSON.stringify(eventFactory__abi)
        )
    }
}

async function updateContractAddresses() {
    // handle next JS networkmapping
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const eventFactory = await ethers.getContract("EventFactory")

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
            EventFactory: [eventFactory.address],
        }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))

    // handle subgraph networks.json -- need to get blocknumber

    if (chainId == 5) {
        const nftMarketplace_deployment_json = JSON.parse(
            fs.readFileSync("./deployments/goerli/NftMarketplace.json", "utf8")
        )
        const eventFactory_deployment_json = JSON.parse(
            fs.readFileSync("./deployments/goerli/EventFactory.json", "utf8")
        )

        networks = {
            goerli: {
                NftMarketplace: {
                    address: [nftMarketplace_deployment_json.addres],
                    startBlock: [nftMarketplace_deployment_json.receipt.logs.blockNumber],
                },
                EventFactory: {
                    address: [eventFactory_deployment_json.addres],
                    startBlock: [eventFactory_deployment_json.receipt.logs.blockNumber],
                },
            },
        }
        fs.writeFileSync(frontEndContractsFile2, JSON.stringify(networks))
        console.log("remember to update subgraph.yaml!! need to do manually")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
