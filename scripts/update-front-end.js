//yarn hardhat run scripts/update-front-end.js --network goerli
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
    if (network.config.chainId.toString() == 5) {
        const nftMarketplace_deployment_json = JSON.parse(
            fs.readFileSync(`./deployments/goerli/NftMarketplace.json`, "utf8")
        )
        const eventFactory_deployment_json = JSON.parse(
            fs.readFileSync(`./deployments/goerli/EventFactory.json`, "utf8")
        )
        const eventContract_deployment_json = JSON.parse(
            fs.readFileSync(`./deployments/goerli/EventContract.json`, "utf8")
        )
        nftMarketplace_abi = nftMarketplace_deployment_json["abi"]
        eventFactory__abi = eventFactory_deployment_json["abi"]
        eventContract__abi = eventContract_deployment_json["abi"]
        fs.writeFileSync(
            `${frontEndAbiLocation}NftMarketplace.json`,
            JSON.stringify(nftMarketplace_abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation}EventFactory.json`,
            JSON.stringify(eventFactory__abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation}EventContract.json`,
            JSON.stringify(eventContract__abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation2}NftMarketplace.json`,
            JSON.stringify(nftMarketplace_abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation2}EventFactory.json`,
            JSON.stringify(eventFactory__abi)
        )
        fs.writeFileSync(
            `${frontEndAbiLocation2}EventContract.json`,
            JSON.stringify(eventContract__abi)
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

        console.log(nftMarketplace_deployment_json.receipt.blockNumber)

        networks = {
            goerli: {
                NftMarketplace: {
                    address: nftMarketplace_deployment_json.address,
                    startBlock: nftMarketplace_deployment_json.receipt.blockNumber,
                },
                EventFactory: {
                    address: eventFactory_deployment_json.address,
                    startBlock: eventFactory_deployment_json.receipt.blockNumber,
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
