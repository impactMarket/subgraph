import { BigInt } from '@graphprotocol/graph-ts';
import {
    CommunityEdited,
    BeneficiaryAdded as OldBeneficiaryAdded,
    BeneficiaryClaim as OldBeneficiaryClaim,
    BeneficiaryRemoved as OldBeneficiaryRemoved,
    ManagerAdded as OldManagerAdded,
    ManagerRemoved as OldManagerRemoved
} from '../../../generated/templates/OldCommunity/OldCommunity';
import { CommunityEntity } from '../../../generated/schema';
import {
    genericHandleBeneficiaryAdded,
    genericHandleBeneficiaryClaim,
    genericHandleBeneficiaryRemoved
} from '../../common/beneficiary';
import { genericHandleManagerAdded, genericHandleManagerRemoved } from '../../common/manager';
import { normalize } from '../../utils';

export function handleOldManagerAdded(event: OldManagerAdded): void {
    genericHandleManagerAdded(
        CommunityEntity.load(event.address.toHex()),
        event.params._account,
        event.transaction.from,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleOldManagerRemoved(event: OldManagerRemoved): void {
    genericHandleManagerRemoved(
        event.address,
        event.params._account,
        event.transaction.from,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleOldBeneficiaryAdded(event: OldBeneficiaryAdded): void {
    genericHandleBeneficiaryAdded(
        event.address,
        event.params._account,
        event.transaction.from,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleOldBeneficiaryRemoved(event: OldBeneficiaryRemoved): void {
    genericHandleBeneficiaryRemoved(
        event.address,
        event.params._account,
        event.transaction.from,
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
}

export function handleOldBeneficiaryClaim(event: OldBeneficiaryClaim): void {
    genericHandleBeneficiaryClaim(event.address, event.params._account, event.params._amount, event.block.timestamp);
}

export function handleCommunityEdited(event: CommunityEdited): void {
    const community = CommunityEntity.load(event.address.toHex());

    if (community) {
        community.claimAmount = normalize(event.params._claimAmount.toString());
        community.originalClaimAmount = normalize(event.params._claimAmount.toString());
        community.maxClaim = normalize(event.params._maxClaim.toString());
        community.maxTotalClaim = normalize(event.params._maxClaim.toString());
        community.incrementInterval = event.params._incrementInterval.gt(BigInt.fromI32(500000))
            ? 0
            : event.params._incrementInterval.toI32();
        community.baseInterval = event.params._baseInterval.gt(BigInt.fromI32(500000))
            ? 0
            : event.params._baseInterval.toI32();
        community.save();
    }
}
