const { ethers, network } = require("hardhat")

async function main() {
    const tokenId = 1 //mint first
    const PRICE = ethers.utils.parseEther("0.1")

    const eventContract = await ethers.getContract("EventContract")
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    console.log("Approving a event ticket...")
    const approvalTx = await eventContract.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)

    console.log("Listing a event ticket...")
    const nftMarketplaceListItemtx = await nftMarketplace.listItem(
        eventContract.address,
        tokenId,
        PRICE
    )
    const nftMarketplaceListItemtxReceipt = await nftMarketplaceListItemtx.wait(1)
    /*
    for (const event of nftMarketplaceListItemtxReceipt.events) {
        console.log(`event: ${event.event}`)
    }
*/
    console.log(`event: ${nftMarketplaceListItemtxReceipt.events[0].event}`)
    console.log(`seller: ${nftMarketplaceListItemtxReceipt.events[0].args[0]}`)
    console.log(`nftAddress: ${nftMarketplaceListItemtxReceipt.events[0].args[1]}`)
    console.log(`tokenId: ${nftMarketplaceListItemtxReceipt.events[0].args[2]}`)
    console.log(`price: ${nftMarketplaceListItemtxReceipt.events[0].args[3]}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
