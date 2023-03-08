const { ethers, network } = require("hardhat")

async function main() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const eventFactory = await ethers.getContract("EventFactory")
    const eventContract = await ethers.getContract("EventContract")
    if (network.config.chainId == "31337") {
        user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    } else {
        user = "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8"
    }

    console.log("checking events listed in the market place address...")
    console.log("use graphQL check createdEvent")

    marketplaceEvent = [
        "0xfa5ac92efa9f92751fece922988190a0b5a18f63",
        "0x7082d0273dfc7942ea7e1b22238c9faae8c34d90",
        "0x42a5711e05c4e9390d70a9431a559ec83d5a9170",
        "0x1f2fbcc0dab80847e8fcac00d8eacc571a4511e2",
    ]

    let ownNft = []

    for (let i = 0; i < marketplaceEvent.length; i++) {

        const eventContract = new ethers.Contract(marketplaceEvent[i], abi, signer)
        const nft_num = await eventContract.balanceOf(user)
        console.log(`use have balance of ${nft_num.toString()} in ${marketplaceEvent[i]}`)
        for (let j = 0; j < nft_num.toString(); j++) {
            const res1 = await eventContract.tokenOfOwnerByIndex(user, j)
            ownNft.push({ nftAddress: marketplaceEvent[i], tokenId: res1.toString() })
            console.log(`append nft index ${j}`)
        }
    }

    console.log(`user has below NFT: ${ownNft}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// console.log("checking token that owned by user address...")
// const proceeds = await nftMarketplace.getProceeds(seller)
// console.log(`Proceeds: ${proceeds}`)
// console.log(`Seller: ${seller}`)

// console.log("Withdrawing fund in NFT marketplace...")

// const nftMarketplaceWithdrawProceedstx = await nftMarketplace.withdrawProceeds()
// const nftMarketplaceWithdrawProceedstxReceipt = await nftMarketplaceWithdrawProceedstx.wait(1)

// console.log("checking final balance in NFT marketplace...")
