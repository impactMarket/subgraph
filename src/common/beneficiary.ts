import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
    BeneficiaryEntity,
    CommunityEntity,
    UBIEntity,
    UserActivityEntity,
} from '../../generated/schema';
import { loadOrCreateCommunityDaily } from './community';
import { loadOrCreateDailyUbi } from './ubi';

export function genericHandleBeneficiaryAdded(
    _community: Address,
    _beneficiary: Address,
    _by: Address,
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
        // add beneficiary activity
        const activity = new UserActivityEntity(_hash);
        activity.user = _beneficiary;
        activity.by = _by;
        activity.community = community.id;
        activity.timestamp = _blockTimestamp.toI32();
        activity.activity = 'added';
        activity.save();
        // update ubi
        const ubi = UBIEntity.load('0')!;
        ubi.beneficiaries += 1;
        ubi.save();
        // update daily ubi
        const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
        ubiDaily.beneficiaries += 1;
        ubiDaily.save();
        // update community
        community.beneficiaries += 1;
        community.save();
        // update community daily
        communityDaily.beneficiaries += 1;
        communityDaily.save();
    }
}

export function genericHandleBeneficiaryRemoved(
    _community: Address,
    _beneficiary: Address,
    _by: Address,
    _hash: string,
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
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.beneficiaries -= 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
            ubiDaily.beneficiaries -= 1;
            ubiDaily.save();
            // update beneficiary
            beneficiary.state = 1;
            beneficiary.save();
            // add beneficiary activity
            const activity = new UserActivityEntity(_hash);
            activity.user = _beneficiary;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'removed';
            activity.save();
            // update community
            community.beneficiaries -= 1;
            community.removedBeneficiaries += 1;
            community.save();
            // update community daily
            communityDaily.beneficiaries -= 1;
            communityDaily.save();
        }
    }
}

export function genericHandleBeneficiaryJoined(
    _community: Address,
    _beneficiary: Address
): void {
    const beneficiary = BeneficiaryEntity.load(_beneficiary.toHex());
    if (beneficiary) {
        // update beneficiary
        beneficiary.community = _community.toHex();
        beneficiary.save();
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
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.claimed = ubi.claimed.plus(_amount);
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
            ubiDaily.claimed = ubiDaily.claimed.plus(_amount);
            ubiDaily.save();
            // update beneficiary
            beneficiary.preLastClaimAt = beneficiary.lastClaimAt;
            beneficiary.lastClaimAt = _blockTimestamp.toI32();
            beneficiary.save();
            // update community
            community.claimed = community.claimed.plus(_amount);
            community.save();
            // update community daily
            communityDaily.claimed = communityDaily.claimed.plus(_amount);
            communityDaily.save();
        }
    }
}

// TODO: handle beneficiary joined, changing the beneficiary community registry
