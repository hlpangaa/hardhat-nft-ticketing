const { ethers, network } = require("hardhat")

async function main() {
    const tokenContractAddress = "0x1E2A8a1e464791b2a4e0D15D7f2aa9020c0Df083" //get new

    const eventFactory = await ethers.getContract("EventFactory")
    console.log("Disalbing Event Contract...")
    const eventFactoryDisableTokenContractTx = await eventFactory.disableTokenContract(
        tokenContractAddress
    )
    const eventFactoryDisableTokenContractTxReceipt =
        await eventFactoryDisableTokenContractTx.wait(1)
    /*
    for (const event of eventFactoryDisableTokenContractTxReceipt.events) {
        console.log(event.event)
    }
*/
    console.log(`event: ${eventFactoryDisableTokenContractTxReceipt.events[0].event}`)
    console.log(`_msgSender: ${eventFactoryDisableTokenContractTxReceipt.events[0].args[0]}`)
    console.log(
        `tokenContractAddress: ${eventFactoryDisableTokenContractTxReceipt.events[0].args[1]}`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
