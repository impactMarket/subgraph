import {
    BeneficiaryAdded,
    BeneficiaryClaim,
    BeneficiaryJoined,
    BeneficiaryLocked,
    BeneficiaryParamsUpdated,
    BeneficiaryRemoved,
    BeneficiaryUnlocked,
    CommunityLocked,
    CommunityParamsUpdated,
    CommunityUnlocked,
    ManagerAdded,
    ManagerRemoved
} from '../../generated/templates/Community/Community';
import { BeneficiaryEntity, CommunityEntity } from '../../generated/schema';
import {
    genericHandleBeneficiaryAdded,
    genericHandleBeneficiaryClaim,
    genericHandleBeneficiaryJoined,
    genericHandleBeneficiaryRemoved
} from '../common/beneficiary';
import { genericHandleManagerAdded, genericHandleManagerRemoved } from '../common/manager';
import { normalize } from '../utils';

export function handleManagerAdded(event: ManagerAdded): void {
    genericHandleManagerAdded(
        CommunityEntity.load(event.address.toHex()),
        event.params.account,
        event.params.manager,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleManagerRemoved(event: ManagerRemoved): void {
    genericHandleManagerRemoved(
        event.address,
        event.params.account,
        event.params.manager,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleBeneficiaryJoined(event: BeneficiaryJoined): void {
    genericHandleBeneficiaryJoined(event.address, event.params.beneficiary);
}

export function handleBeneficiaryAdded(event: BeneficiaryAdded): void {
    genericHandleBeneficiaryAdded(
        event.address,
        event.params.beneficiary,
        event.params.manager,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleBeneficiaryRemoved(event: BeneficiaryRemoved): void {
    genericHandleBeneficiaryRemoved(
        event.address,
        event.params.beneficiary,
        event.params.manager,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleBeneficiaryClaim(event: BeneficiaryClaim): void {
    genericHandleBeneficiaryClaim(event.address, event.params.beneficiary, event.params.amount, event.block.timestamp);
}

export function handleBeneficiaryParamsUpdated(event: BeneficiaryParamsUpdated): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.claimAmount = normalize(event.params.newClaimAmount.toString());
        community.maxClaim = normalize(event.params.newMaxClaim.toString());
        community.incrementInterval = event.params.newIncrementInterval.toI32();
        community.baseInterval = event.params.newBaseInterval.toI32();
        community.decreaseStep = normalize(event.params.newDecreaseStep.toString());
        community.save();
    }
}

export function handleCommunityParamsUpdated(event: CommunityParamsUpdated): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.minTranche = normalize(event.params.newMinTranche.toString());
        community.maxTranche = normalize(event.params.newMaxTranche.toString());
        community.save();
    }
}

export function handleBeneficiaryLocked(event: BeneficiaryLocked): void {
    const beneficiary = BeneficiaryEntity.load(event.params.beneficiary.toHex());

    if (beneficiary) {
        beneficiary.state = 2;
        beneficiary.save();
    }
}

export function handleBeneficiaryUnlocked(event: BeneficiaryUnlocked): void {
    const beneficiary = BeneficiaryEntity.load(event.params.beneficiary.toHex());

    if (beneficiary) {
        beneficiary.state = 0;
        beneficiary.save();
    }
}

export function handleCommunityLocked(event: CommunityLocked): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.state = 2;
        community.save();
    }
}

export function handleCommunityUnlocked(event: CommunityUnlocked): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.state = 0;
        community.save();
    }
}
