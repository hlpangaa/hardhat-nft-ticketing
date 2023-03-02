const { ethers, network } = require("hardhat")

async function script7() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    if (network.config.chainId == "31337") {
        seller = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        seller = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }

    console.log(
        `-----------------------SCRIPT7----WITHDRAW-FUND-----------------------------------------`
    )
    console.log("checking original balance in NFT marketplace...")
    const proceeds = await nftMarketplace.getProceeds(seller)
    console.log(`Proceeds: ${proceeds}`)
    console.log(`Seller: ${seller}`)

    console.log("Withdrawing fund in NFT marketplace...")

    const nftMarketplaceWithdrawProceedstx = await nftMarketplace.withdrawProceeds()
    const nftMarketplaceWithdrawProceedstxReceipt = await nftMarketplaceWithdrawProceedstx.wait(1)

    console.log("checking final balance in NFT marketplace...")
    const f_proceeds = await nftMarketplace.getProceeds(seller)
    console.log(`Proceeds: ${f_proceeds}`)
    console.log(`Seller: ${seller}`)

    console.log(
        `-----------------------SCRIPT7----WITHDRAW-FUND-----------------------------------------`
    )
}

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })
module.exports = script7
