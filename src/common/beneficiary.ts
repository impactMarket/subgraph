import { Address, BigInt } from '@graphprotocol/graph-ts';

import { BeneficiaryEntity, CommunityEntity } from '../../generated/schema';
import { loadOrCreateCommunityDaily } from './community';

export function genericHandleBeneficiaryAdded(
    _community: Address,
    _beneficiary: Address,
    _hash: string,
    _blockTimestamp: BigInt
): void {
    const community = CommunityEntity.load(_community.toHex());
    if (community) {
        const communityDaily = loadOrCreateCommunityDaily(
            _community,
            _blockTimestamp
        );
        // load beneficiary
        const beneficiaryId = _beneficiary.toHex();
        let beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (!beneficiary) {
            beneficiary = new BeneficiaryEntity(beneficiaryId);
        } else if (
            beneficiary &&
            Address.fromString(beneficiary.community).notEqual(_community)
        ) {
            // save previous entry of beneficiary in another community
            const previousBeneficiary = new BeneficiaryEntity(_hash);
            previousBeneficiary.address = beneficiary.address;
            previousBeneficiary.community = beneficiary.community;
            previousBeneficiary.state = beneficiary.state;
            previousBeneficiary.lastClaimAt = beneficiary.lastClaimAt;
            previousBeneficiary.preLastClaimAt = beneficiary.preLastClaimAt;
            previousBeneficiary.save();
        }
        // add beneficiary
        beneficiary.address = _beneficiary;
        beneficiary.community = community.id;
        beneficiary.state = 0;
        beneficiary.lastClaimAt = 0;
        beneficiary.preLastClaimAt = 0;
        beneficiary.save();
        // update community
        community.totalBeneficiaries += 1;
        community.save();
        // update community daily
        communityDaily.beneficiaries += 1;
        communityDaily.save();
    }
}

export function genericHandleBeneficiaryRemoved(
    _community: Address,
    _beneficiary: Address,
    _blockTimestamp: BigInt
): void {
    const community = CommunityEntity.load(_community.toHex());
    if (community) {
        const beneficiary = BeneficiaryEntity.load(_beneficiary.toHex());
        if (beneficiary) {
            const communityDaily = loadOrCreateCommunityDaily(
                _community,
                _blockTimestamp
            );
            // update beneficiary
            beneficiary.state = 1;
            beneficiary.save();
            // update community
            community.totalBeneficiaries -= 1;
            community.save();
            // update community daily
            communityDaily.beneficiaries -= 1;
            communityDaily.save();
        }
    }
}

export function genericHandleBeneficiaryClaim(
    _community: Address,
    _beneficiary: Address,
    _amount: BigInt,
    _blockTimestamp: BigInt
): void {
    const community = CommunityEntity.load(_community.toHex());
    if (community) {
        const beneficiary = BeneficiaryEntity.load(_beneficiary.toHex());
        if (beneficiary) {
            const communityDaily = loadOrCreateCommunityDaily(
                _community,
                _blockTimestamp
            );
            // update beneficiary
            beneficiary.preLastClaimAt = beneficiary.lastClaimAt;
            beneficiary.lastClaimAt = _blockTimestamp.toI32();
            beneficiary.save();
            // update community
            community.totalClaimed = community.totalClaimed.plus(_amount);
            community.save();
            // update community daily
            communityDaily.claimed = communityDaily.claimed.plus(_amount);
            communityDaily.save();
        }
    }
}
