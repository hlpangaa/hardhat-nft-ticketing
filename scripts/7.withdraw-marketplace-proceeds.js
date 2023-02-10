const { ethers, network } = require("hardhat")

async function main() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const seller = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"

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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
