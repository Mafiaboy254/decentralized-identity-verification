import { ethers } from "hardhat";
import { expect } from "chai";
import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DecentralizedIdentityVerification", function () {

    async function deployContractFixture() {
        const [owner, addr1, addr2, verifier] = await ethers.getSigners();

        const identityContract = await ethers.deployContract("DecentralizedIdentityVerification");

        return { identityContract, owner, addr1, addr2, verifier };
    }

    it("should allow a user to register their identity", async function () {

        const { identityContract, addr1 } = await loadFixture(deployContractFixture);

        await identityContract.connect(addr1).registerIdentity("Alice", "01/01/1990", "ID12345");

        // we can't directly access identity details as they are private 
        // but if we try to register again it should revert
        await expect(
            identityContract.connect(addr1).registerIdentity("Alice", "01/01/1990", "ID12345")
        ).to.be.revertedWith("Identity already registered.");
    });

    it("should allow only the owner to add a verifier", async function () {
        const { identityContract, addr1, verifier } = await loadFixture(deployContractFixture);

        await identityContract.connect(addr1).registerIdentity("Alice", "01/01/1990", "ID12345");

        await expect(identityContract.connect(addr1).addVerifier(verifier.address)).to.be.revertedWith("Only owner can perform this action.");

        await identityContract.addVerifier(verifier.address);
        expect(await identityContract.isVerifier(verifier.address)).to.be.true;
    });

    it("should allow an authorized verifier to verify an identity", async function () {
        const { identityContract, addr1, verifier } = await loadFixture(deployContractFixture);

        await identityContract.connect(addr1).registerIdentity("Alice", "01/01/1990", "ID12345");

        await identityContract.addVerifier(verifier.address);

        await identityContract.connect(verifier).verifyIdentity(addr1);

        expect(await identityContract.checkVerificationStatus(addr1)).to.be.true;
    });

    it("should prevent verification of non-registered identity", async function () {
        const { identityContract, addr1, verifier } = await loadFixture(deployContractFixture);

        await identityContract.addVerifier(verifier);

        await expect(identityContract.connect(verifier).verifyIdentity(addr1)).to.be.revertedWith("User not registered.");
    });

    it("should allow checking verification status without revealing other details", async function () {
        const { identityContract, addr1, verifier } = await loadFixture(deployContractFixture);

        await identityContract.connect(addr1).registerIdentity("Alice", "01/01/1990", "ID12345");

        // Initially not verified
        expect(await identityContract.checkVerificationStatus(addr1)).to.be.false;

        await identityContract.addVerifier(verifier);
        await identityContract.connect(verifier).verifyIdentity(addr1);

        // After verification
        expect(await identityContract.checkVerificationStatus(addr1)).to.be.true;
    });
});
