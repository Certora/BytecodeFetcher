let fs = require('fs')
let fetch = require("node-fetch")
let ethers = require("ethers")
let  whatsabi = require("@shazow/whatsabi")

let EtherScanAPI = process.env.ETHERSCAN_KEY
let InfuraAPI = process.env.INFURA_ENDPOINT

const env = {
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    NETWORK: "ethers",
};

async function fetchJSON(url) {
    return await (await fetch(url)).json(); // improve error handling here
}


async function fetchData(address) {
    console.log("Getting Etherscan Info", address)
    let data = await fetchJSON("https://api.etherscan.io/api?module=contract&action=getsourcecode&address=" + address + "&apikey=" + EtherScanAPI)
    if (data && data.result && data.result.length) {
        return data.result[0]
    } else {
        console.log("Fail", address)
        return {}
    }
}

async function main() {
    const address = process.argv.slice(2)[0]
    if (address == null) {
        console.log("Must provide an address")
        return
    }
    let provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/" + InfuraAPI)
    let deployedCode = await provider.getCode(address)


    if (deployedCode == "0x") {
        console.log("Empty code for " + address)
        fs.writeFileSync("example_" + address + ".json", "") // saving a little bit of space
    } else {
        let info = await fetchData(address)

        const abi = whatsabi.abiFromBytecode(deployedCode);
        abi.forEach((it, index, array) => {
            //If there is no name defined for the function, fallback to the sighash selector as name.
            if(it.name == undefined){it.name = it.selector}
            array[index] = it
        });
        let data = {
            "address": address,
            "ABI": JSON.stringify(abi),
            "SourceCode": info.SourceCode,
            "ContractName": info.ContractName,
            "CompilerVersion": info.CompilerVersion,
            "OptimizationUsed": info.OptimizationUsed,
            "ConstructorArguments": info.ConstructorArguments,
            "ContractCreationCode": info.ContractCreationCode,
            "DeployedCode": deployedCode
        }
        fs.writeFileSync("example_" + address + ".json", JSON.stringify(data, null, 4))
    }
}

main()