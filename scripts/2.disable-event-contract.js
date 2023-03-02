const { ethers, network } = require("hardhat")
const newEventContractAddress = ""

async function script2(newEventContractAddress) {
    const tokenContractAddress = newEventContractAddress //get new
    console.log(
        `-----------------------SCRIPT2----DISABLE-EVENT-----------------------------------------`
    )

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
    console.log(
        `-----------------------SCRIPT2----DISABLE-EVENT-----------------------------------------`
    )
}

// main(newEventContractAddress)
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })
module.exports = script2
