# Bytecode Fetcher

This script allows you to fetch a smart contract's bytecode blob based on its Ethereum address.
It is useful for running the [Certora Prover](https://www.certora.com) on a contract whose source code is not available.

Credit for original script: [BoringCrypto](https://github.com/boringcrypto).

## Setup
```
npm install
```

Set `ETHERSCAN_KEY` as your Etherscan API key, and `INFURA_ENDPOINT` as your Infura project ID.

## Running
```
node fetchBytecodeToRunWithProver.js 0xYOUR_ADDRESS
```

A file called `example_0xYOUR_ADDRESS.json` is created and it can be given to the Certora Prover like this:
```
certoraRun --bytecode example_0xYOUR_ADDRESS.json --bytecode_spec PATH_TO_SPEC_FILE.spec
```
