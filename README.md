# Decentralized identity verification

This project is a decentralized identity verification system implemented in Solidity. The smart contract allows users to register their identities, and authorized verifiers can verify these identities. The system ensures that only registered identities can be verified and only authorized verifiers can perform verifications.

## Usage

### Compile the Smart Contract

To compile the Solidity contract, run:

```sh
npx hardhat compile
```

## Testing

To run the tests, use the following command:

```sh
npx hardhat test
```

The tests are written using TypeScript and utilize the ethers.js library. They cover scenarios such as:

- Registering an identity
- Adding a verifier
- Verifying an identity
- Checking verification status
- Preventing unauthorized actions
