//yarn hardhat run scripts/run_scripts.js --network localhost
//yarn hardhat run scripts/update-front-end.js --network goerli

const script1 = require("./1.create-event-contract.js")
const script2 = require("./2.disable-event-contract.js")
const script3 = require("./3.mint-event-ticket.js")
const script4 = require("./4.approve-and-list-event-ticket.js")
const script5 = require("./5.buy-event-ticket.js")
const script6 = require("./6.cancel-event-ticket-listing.js")
const script7 = require("./7.withdraw-marketplace-proceeds.js")
const script8 = require("./8.mint-event-ticket-from-marketplace.js")
// const script_after = require("/scripts/99.update-front-end.js")

// Run the script files in sequence
async function runTask() {
    // const newEventContractAddress = await script1()
    // const newTokenId = await script3()
    // await script4(newTokenId)
    // await script5(newTokenId)
    // await script4(newTokenId)
    // await script6(newTokenId)
    // await script7()
    // await script8()

    for (let i = 0; i < 5; i++) {
        await script8()
    }
}

runTask()

// script1().then((s) => {
//     script2(s)
// }).then

// script1()
//     .then((newEventContractAddress) => script2(newEventContractAddress))
//     .then(() => {
//         console.log("All scripts have completed successfully.")
//         process.exit(0)
//     })
//     .catch((error) => {
//         console.error("Error running scripts:", error)
//         process.exit(1)
//     })
