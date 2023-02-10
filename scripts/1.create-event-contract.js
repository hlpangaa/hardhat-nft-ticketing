const { ethers, network } = require("hardhat")

async function main() {
    const _name = "Hin"
    const _symbol = "Hin"
    const _eventInfo = [
        "event descrption", //descrption;
        "default", //queuingMechanism;
        "ipfs://QmPFmytBjskRqaFeBWq3Ub41sL9JMrGPAejTQcybJMMupP",
        100, //seatcap1;
        100, // seatcap2;
        100, // seatcap3;
        100, // seatprice1;
        100, // seatprice2;
        100, // seatprice3;
        1, // priceCelling;
        1638352800, // startTime;
        0, // endTime;
    ]

    const eventFactory = await ethers.getContract("EventFactory")
    console.log("Creating Event Contract...")
    const eventFactoryCreateNFTContractTx = await eventFactory.createNFTContract(
        _name,
        _symbol,
        _eventInfo
    )
    const eventFactoryCreateNFTContractTxReceipt = await eventFactoryCreateNFTContractTx.wait(1)

    /*
    for (const event of eventFactoryCreateNFTContractTxReceipt.events) {
        console.log(event.event)
    }*/

    console.log(`event: ${eventFactoryCreateNFTContractTxReceipt.events[2].event}`)
    console.log(`creator: ${eventFactoryCreateNFTContractTxReceipt.events[2].args[0]}`)
    console.log(`nft: ${eventFactoryCreateNFTContractTxReceipt.events[2].args[1]}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
