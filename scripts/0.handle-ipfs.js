const { ethers, network } = require("hardhat")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./scripts/ipfs-test-img"
// const tokenUris = [
//     "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
//     "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
//     "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
// ]
const metadataTemplate = {
    name: "hin",
    description: "hin's revisit",
    image: "ipfs://Qmf2xvUekEhSrEcG4NCrBWXBFjw11b9wzoRdCq9pQzFVbR",
    attributes: [
        {
            seatType: "VIP",
            seatCap: 100,
            priceCelling: 1.5,
            mechanism: "fixed price",
            startTime: "10 Dec 2022",
            endTime: 0,
            royaltyFeesInBips: 250,
            feeRecipient: "0x0A270fB0CEa1cCB113860B0Af6CbB98c1a0c04C8",
        },
    ],
}
async function main() {
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }
}

async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `${tokenUriMetadata.name}!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
