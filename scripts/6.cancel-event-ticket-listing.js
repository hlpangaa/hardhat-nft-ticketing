const { ethers, network } = require("hardhat")
const newTokenId = ""

async function script6(newTokenId) {
    const tokenId = newTokenId

    const eventContract = await ethers.getContract("EventContract")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    console.log(
        `-----------------------SCRIPT6----CANCEL-LISTING-----------------------------------------`
    )
    console.log("Canceling listing of a event ticket...")
    const nftMarketplaceCancelListingtx = await nftMarketplace.cancelListing(
        eventContract.address,
        tokenId
    )
    const nftMarketplaceCancelListingtxReceipt = await nftMarketplaceCancelListingtx.wait(1)
    /*
    for (const event of nftMarketplaceCancelListingtxReceipt.events) {
        console.log(`event: ${event.event}`)
    }
*/

    console.log(`event: ${nftMarketplaceCancelListingtxReceipt.events[0].event}`)
    console.log(`seller: ${nftMarketplaceCancelListingtxReceipt.events[0].args[0]}`)
    console.log(`nftAddress: ${nftMarketplaceCancelListingtxReceipt.events[0].args[1]}`)
    console.log(`tokenId: ${nftMarketplaceCancelListingtxReceipt.events[0].args[2]}`)
    console.log(
        `-----------------------SCRIPT6----CANCEL-LISTING-----------------------------------------`
    )
}

// main(newTokenId)
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

module.exports = script6
