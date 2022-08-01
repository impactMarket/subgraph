import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { BeneficiaryEntity, CommunityEntity, ManagerEntity, UBIEntity, UserActivityEntity } from '../../generated/schema';
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
        const manager = ManagerEntity.load(_by.toHex())!;
        // alpha version of smart contracts had an issue.
        // it allowed to add a user as beneficiary even though it was a beneficiary already.
        let noContractsAlphaIssue = true;
        // to prevent a alpha version issue.
        let previouslyRemoved = true;

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
            beneficiary.addedBy = _by;
            // update manager
            manager.added += 1;
        } else if (beneficiary && Address.fromString(beneficiary.community).notEqual(_community)) {
            // save previous entry of beneficiary in another community
            const previousBeneficiary = new BeneficiaryEntity(_hash);

            // if beneficiary added in another community while being active on current one
            previouslyRemoved = beneficiary.state === 1;
            if (beneficiary.state === 0) {
                const previousManager = ManagerEntity.load(beneficiary.addedBy.toHex())!;
                const previousCommunity = CommunityEntity.load(beneficiary.community)!;
                
                // increase removed on manager
                previousManager.removed += 1;
                previousManager.save();

                // decrease number of beneficiaries in community
                previousCommunity.beneficiaries -= 1;
                previousCommunity.save();
            }

            previousBeneficiary.address = beneficiary.address;
            previousBeneficiary.community = beneficiary.community;
            // needs to be as removed
            previousBeneficiary.state = 1;
            previousBeneficiary.lastClaimAt = beneficiary.lastClaimAt;
            previousBeneficiary.preLastClaimAt = beneficiary.preLastClaimAt;
            previousBeneficiary.claims = beneficiary.claims;
            previousBeneficiary.claimed = beneficiary.claimed;
            previousBeneficiary.since = beneficiary.since;
            previousBeneficiary.addedBy = beneficiary.addedBy;
            previousBeneficiary.removedBy = beneficiary.removedBy;
            previousBeneficiary.save();
            // update beneficiary
            beneficiary.community = community.id;
            beneficiary.state = 0;
            beneficiary.lastClaimAt = 0;
            beneficiary.preLastClaimAt = 0;
            beneficiary.claims = 0;
            beneficiary.claimed = BigDecimal.zero();
            beneficiary.since = _blockTimestamp.toI32();
            beneficiary.addedBy = _by;
            beneficiary.removedBy = null;
            // update manager
            manager.added += 1;
        } else if (
            // readded into same community
            beneficiary &&
            Address.fromString(beneficiary.community).equals(_community)
        ) {
            if (beneficiary.state == 0) {
                noContractsAlphaIssue = false;
            } else {
                community.removedBeneficiaries -= 1;
                // update manager if not the same
                if (beneficiary.addedBy.notEqual(manager.address)) {
                    manager.added += 1;
                }
                // update beneficiary
                beneficiary.addedBy = _by;
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
            // update ubi
            const ubi = UBIEntity.load('0')!;
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            if (previouslyRemoved) {
                ubi.beneficiaries += 1;
                ubiDaily.beneficiaries += 1;
                community.beneficiaries += 1;
                communityDaily.beneficiaries += 1;
            }

            ubi.claimed = ubi.claimed.plus(fiveCents);
            // update daily ubi
            ubiDaily.claimed = ubiDaily.claimed.plus(fiveCents);
            // update community
            community.claimed = community.claimed.plus(fiveCents);
            community.estimatedFunds = community.estimatedFunds.minus(fiveCents);
            community.maxClaim = community.maxClaim.minus(community.decreaseStep);
            // update community daily
            communityDaily.claimed = communityDaily.claimed.plus(fiveCents);
            // save
            activity.save();
            beneficiary.save();
            ubi.save();
            ubiDaily.save();
            community.save();
            communityDaily.save();
            manager.save();
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
        const manager = ManagerEntity.load(_by.toHex())!;

        // validate current state (prevent issue)
        if (beneficiary && beneficiary.state !== 1) {
            const communityDaily = loadOrCreateCommunityDaily(_community, _blockTimestamp);
            const ubi = UBIEntity.load('0')!;
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
            const activity = new UserActivityEntity(_hash);
            
            // update ubi
            ubi.beneficiaries -= 1;
            // update daily ubi
            ubiDaily.beneficiaries -= 1;
            // add beneficiary activity
            activity.user = _beneficiary;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'REMOVED';
            // update beneficiary
            beneficiary.state = 1;
            beneficiary.removedBy = _by;
            // update community
            community.beneficiaries -= 1;
            community.removedBeneficiaries += 1;
            community.maxClaim = community.maxClaim.plus(community.decreaseStep);
            // update community daily
            communityDaily.beneficiaries -= 1;
            // update manager
            manager.removed += 1;

            // save
            ubi.save();
            ubiDaily.save();
            activity.save();
            beneficiary.save();
            community.save();
            communityDaily.save();
            manager.save();
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
            ubi.claims += 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            ubiDaily.claimed = ubiDaily.claimed.plus(normalizedAmount);
            ubiDaily.claims += 1;
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
            communityDaily.claims += 1;
            communityDaily.save();
        }
    }
}
