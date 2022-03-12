import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { BeneficiaryEntity, CommunityEntity, UBIEntity, UserActivityEntity } from '../../generated/schema';
import { fiveCents, normalize } from '../utils';
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
        const communityDaily = loadOrCreateCommunityDaily(_community, _blockTimestamp);
        // load beneficiary
        const beneficiaryId = _beneficiary.toHex();
        let beneficiary = BeneficiaryEntity.load(beneficiaryId);
        // alpha version of smart contracts had an issue.
        // it allowed to add a user as beneficiary even though it was a beneficiary already.
        let noContractsAlphaIssue = true;

        if (!beneficiary) {
            beneficiary = new BeneficiaryEntity(beneficiaryId);
            beneficiary.address = _beneficiary;
            beneficiary.community = community.id;
            beneficiary.state = 0;
            beneficiary.lastClaimAt = 0;
            beneficiary.preLastClaimAt = 0;
            beneficiary.claims = 0;
            beneficiary.claimed = BigDecimal.zero();
            beneficiary.since = _blockTimestamp.toI32();
        } else if (beneficiary && Address.fromString(beneficiary.community).notEqual(_community)) {
            // save previous entry of beneficiary in another community
            const previousBeneficiary = new BeneficiaryEntity(_hash);

            previousBeneficiary.address = beneficiary.address;
            previousBeneficiary.community = beneficiary.community;
            previousBeneficiary.state = beneficiary.state;
            previousBeneficiary.lastClaimAt = beneficiary.lastClaimAt;
            previousBeneficiary.preLastClaimAt = beneficiary.preLastClaimAt;
            previousBeneficiary.claims = beneficiary.claims;
            previousBeneficiary.claimed = beneficiary.claimed;
            previousBeneficiary.save();
            //
            beneficiary.community = community.id;
            beneficiary.state = 0;
            beneficiary.lastClaimAt = 0;
            beneficiary.preLastClaimAt = 0;
            beneficiary.claims = 0;
            beneficiary.claimed = BigDecimal.zero();
            beneficiary.since = _blockTimestamp.toI32();
        } else if (
            // readded into same community
            beneficiary &&
            Address.fromString(beneficiary.community).equals(_community)
        ) {
            if (beneficiary.state == 0) {
                noContractsAlphaIssue = false;
            } else {
                community.removedBeneficiaries -= 1;
            }
        }

        if (noContractsAlphaIssue) {
            // add beneficiary activity
            const activity = new UserActivityEntity(_hash);

            activity.user = _beneficiary;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'ADDED';
            activity.save();
            beneficiary.save();
            // update ubi
            const ubi = UBIEntity.load('0')!;

            ubi.beneficiaries += 1;
            ubi.claimed = ubi.claimed.plus(fiveCents);
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            ubiDaily.beneficiaries += 1;
            ubiDaily.claimed = ubiDaily.claimed.plus(fiveCents);
            ubiDaily.save();
            // update community
            community.beneficiaries += 1;
            community.claimed = community.claimed.plus(fiveCents);
            community.estimatedFunds = community.estimatedFunds.minus(fiveCents);
            community.maxClaim = community.maxClaim.minus(community.decreaseStep);
            community.save();
            // update community daily
            communityDaily.beneficiaries += 1;
            communityDaily.claimed = communityDaily.claimed.plus(fiveCents);
            communityDaily.save();
        }
    }
}

// eslint-disable-next-line max-params
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

        if (beneficiary && beneficiary.state !== 1) {
            const communityDaily = loadOrCreateCommunityDaily(_community, _blockTimestamp);
            // update ubi
            const ubi = UBIEntity.load('0')!;

            ubi.beneficiaries -= 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            ubiDaily.beneficiaries -= 1;
            ubiDaily.save();
            // add beneficiary activity
            const activity = new UserActivityEntity(_hash);

            activity.user = _beneficiary;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'REMOVED';
            activity.save();
            // update beneficiary
            beneficiary.state = 1;
            beneficiary.save();
            // update community
            community.beneficiaries -= 1;
            community.removedBeneficiaries += 1;
            community.maxClaim = community.maxClaim.plus(community.decreaseStep);
            community.save();
            // update community daily
            communityDaily.beneficiaries -= 1;
            communityDaily.save();
        }
    }
}

export function genericHandleBeneficiaryJoined(_community: Address, _beneficiary: Address): void {
    const beneficiary = BeneficiaryEntity.load(_beneficiary.toHex());

    if (beneficiary && beneficiary.community !== _community.toHex()) {
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
            const communityDaily = loadOrCreateCommunityDaily(_community, _blockTimestamp);
            const normalizedAmount = normalize(_amount.toString());
            // update ubi
            const ubi = UBIEntity.load('0')!;

            ubi.claimed = ubi.claimed.plus(normalizedAmount);
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            ubiDaily.claimed = ubiDaily.claimed.plus(normalizedAmount);
            ubiDaily.save();
            // update beneficiary
            beneficiary.preLastClaimAt = beneficiary.lastClaimAt;
            beneficiary.lastClaimAt = _blockTimestamp.toI32();
            beneficiary.claims += 1;
            beneficiary.claimed = beneficiary.claimed.plus(normalizedAmount);
            beneficiary.save();
            // update community
            community.claims += 1;
            community.claimed = community.claimed.plus(normalizedAmount);
            community.estimatedFunds = community.estimatedFunds.minus(normalizedAmount);
            community.save();
            // update community daily
            communityDaily.claimed = communityDaily.claimed.plus(normalizedAmount);
            communityDaily.save();
        }
    }
}
