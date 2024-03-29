import {
    BeneficiaryAdded,
    BeneficiaryAddressChanged,
    BeneficiaryClaim,
    BeneficiaryCopied,
    BeneficiaryJoined,
    BeneficiaryLocked,
    BeneficiaryParamsUpdated,
    BeneficiaryRemoved,
    BeneficiaryUnlocked,
    ClaimAmountUpdated,
    CommunityLocked,
    CommunityParamsUpdated,
    CommunityUnlocked,
    ManagerAdded,
    ManagerRemoved,
    MaxBeneficiariesUpdated
} from '../../generated/templates/Community/Community';
import { BeneficiaryEntity, CommunityEntity, ManagerEntity } from '../../generated/schema';
import {
    genericHandleBeneficiaryAdded,
    genericHandleBeneficiaryClaim,
    genericHandleBeneficiaryJoined,
    genericHandleBeneficiaryRemoved
} from '../common/beneficiary';
import { genericHandleManagerAdded, genericHandleManagerRemoved } from '../common/manager';
import { normalize } from '../utils';
import { store } from '@graphprotocol/graph-ts';

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
        community.originalClaimAmount = normalize(event.params.newOriginalClaimAmount.toString());
        community.maxClaim = normalize(event.params.newMaxTotalClaim.toString());
        community.maxTotalClaim = normalize(event.params.newMaxTotalClaim.toString());
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
    const community = CommunityEntity.load(event.address.toHex())!;
    const manager = ManagerEntity.load(event.transaction.from.toHex());

    if (beneficiary) {
        beneficiary.state = 2;
        community.lockedBeneficiaries += 1;

        if (manager) {
            community.lastActivity = event.block.timestamp.toI32();
            manager.lastActivity = event.block.timestamp.toI32();
            manager.save();
        }
        // save
        beneficiary.save();
        community.save();
    }
}

export function handleBeneficiaryUnlocked(event: BeneficiaryUnlocked): void {
    const beneficiary = BeneficiaryEntity.load(event.params.beneficiary.toHex());
    const community = CommunityEntity.load(event.address.toHex())!;
    const manager = ManagerEntity.load(event.transaction.from.toHex());

    if (beneficiary) {
        beneficiary.state = 0;
        community.lockedBeneficiaries -= 1;

        if (manager) {
            community.lastActivity = event.block.timestamp.toI32();
            manager.lastActivity = event.block.timestamp.toI32();
            manager.save();
        }
        // save
        beneficiary.save();
        community.save();
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

export function handleClaimAmountUpdated(event: ClaimAmountUpdated): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.claimAmount = normalize(event.params.newClaimAmount.toString());
        community.save();
    }
}

export function handleMaxBeneficiariesUpdated(event: MaxBeneficiariesUpdated): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.maxBeneficiaries = event.params.newMaxBeneficiaries.toI32();
        community.save();
    }
}

export function handleBeneficiaryCopied(event: BeneficiaryCopied): void {
    const newCommunity = CommunityEntity.load(event.address.toHex())!;
    const beneficiary = BeneficiaryEntity.load(event.params.beneficiary.toHex())!;
    const oldCommunity = CommunityEntity.load(beneficiary.community)!;

    newCommunity.beneficiaries += 1;
    oldCommunity.beneficiaries -= 1;
    beneficiary.community = event.address.toHex();
    beneficiary.addedBy = event.params.manager;

    // save
    newCommunity.save();
    oldCommunity.save();
    beneficiary.save();
}

export function handleBeneficiaryAddressChanged(event: BeneficiaryAddressChanged): void {
    const beneficiary1 = BeneficiaryEntity.load(event.params.beneficiary1.toHex())!;
    const beneficiary2 = new BeneficiaryEntity(event.params.beneficiary2.toHex());

    beneficiary2.merge([beneficiary1]);
    beneficiary2.id = event.params.beneficiary2.toHex();

    beneficiary2.save();
    store.remove('BeneficiaryEntity', beneficiary1.id);
}
