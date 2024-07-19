// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract DecentralizedIdentityVerification {
    struct Identity {
        string name;
        string dateOfBirth;
        string governmentId;
        bool isVerified;
    }

    address public owner;
    mapping(address => Identity) private identities;
    mapping(address => bool) private verifiers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    modifier onlyVerifier() {
        require(
            verifiers[msg.sender],
            "Only authorized verifier can perform this action."
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerIdentity(
        string calldata name,
        string calldata dateOfBirth,
        string calldata governmentId
    ) external {
        require(
            bytes(identities[msg.sender].name).length == 0,
            "Identity already registered."
        );
        identities[msg.sender] = Identity(
            name,
            dateOfBirth,
            governmentId,
            false
        );
    }

    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }

    function verifyIdentity(address user) external onlyVerifier {
        require(
            bytes(identities[user].name).length != 0,
            "User not registered."
        );
        identities[user].isVerified = true;
    }

    function checkVerificationStatus(
        address user
    ) external view returns (bool) {
        return identities[user].isVerified;
    }

    function isVerifier(address verifier) external view returns (bool) {
        return verifiers[verifier];
    }
}
