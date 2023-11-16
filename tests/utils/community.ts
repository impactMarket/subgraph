/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    BeneficiaryParamsUpdated,
    CommunityLocked,
    CommunityUnlocked
} from '../../generated/templates/Community/Community';
import {
    CommunityAdded,
    CommunityCopied,
    CommunityMigrated,
    CommunityRemoved
} from '../../generated/CommunityAdmin/CommunityAdmin';
import { CommunityEdited } from '../../generated/templates/OldCommunity/OldCommunity';

export function createCommunityAddedEvent(
    communityAddress: string,
    managers: string[],
    props: Map<string, string>,
    timestamp: i32 = 0
): CommunityAdded {
    const communityAddedEvent = changetype<CommunityAdded>(newMockEvent());

    communityAddedEvent.parameters = [];
    communityAddedEvent.block.timestamp = BigInt.fromI32(86400);
    if (timestamp !== 0) {
        communityAddedEvent.block.timestamp = BigInt.fromI32(timestamp);
    }
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );
    const managersParam = new ethereum.EventParam(
        'managers',
        ethereum.Value.fromAddressArray(managers.map<Address>(m => Address.fromString(m)))
    );
    const originalClaimAmountParam = new ethereum.EventParam(
        'originalClaimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('originalClaimAmount')))
    );
    const maxTotalClaimParam = new ethereum.EventParam(
        'maxTotalClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxTotalClaim')))
    );
    const decreaseStepParam = new ethereum.EventParam(
        'decreaseStep',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('decreaseStep')))
    );
    const baseIntervalParam = new ethereum.EventParam(
        'baseInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('baseInterval')))
    );
    const incrementIntervalParam = new ethereum.EventParam(
        'incrementInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('incrementInterval')))
    );
    const minTrancheParam = new ethereum.EventParam(
        'minTranche',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('minTranche')))
    );
    const maxTrancheParam = new ethereum.EventParam(
        'maxTranche',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxTranche')))
    );

    communityAddedEvent.parameters.push(communityAddressParam);
    communityAddedEvent.parameters.push(managersParam);
    communityAddedEvent.parameters.push(originalClaimAmountParam);
    communityAddedEvent.parameters.push(maxTotalClaimParam);
    communityAddedEvent.parameters.push(decreaseStepParam);
    communityAddedEvent.parameters.push(baseIntervalParam);
    communityAddedEvent.parameters.push(incrementIntervalParam);
    communityAddedEvent.parameters.push(minTrancheParam);
    communityAddedEvent.parameters.push(maxTrancheParam);

    return communityAddedEvent;
}

export function createCommunityRemovedEvent(communityAddress: string): CommunityRemoved {
    const communityRemovedEvent = changetype<CommunityRemoved>(newMockEvent());

    communityRemovedEvent.parameters = [];
    communityRemovedEvent.block.timestamp = BigInt.fromI32(86400);
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );

    communityRemovedEvent.parameters.push(communityAddressParam);

    return communityRemovedEvent;
}

export function createCommunityMigratedEvent(
    managers: string[],
    communityAddress: string,
    previousCommunityAddress: string,
    timestamp: i32 = 0
): CommunityMigrated {
    const communityMigratedEvent = changetype<CommunityMigrated>(newMockEvent());

    communityMigratedEvent.parameters = [];
    communityMigratedEvent.block.timestamp = BigInt.fromI32(86400);
    if (timestamp !== 0) {
        communityMigratedEvent.block.timestamp = BigInt.fromI32(timestamp);
    }
    const managersParam = new ethereum.EventParam(
        'managers',
        ethereum.Value.fromAddressArray(managers.map<Address>(m => Address.fromString(m)))
    );
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );
    const previousCommunityAddressParam = new ethereum.EventParam(
        'previousCommunityAddress',
        ethereum.Value.fromAddress(Address.fromString(previousCommunityAddress))
    );

    communityMigratedEvent.parameters.push(managersParam);
    communityMigratedEvent.parameters.push(communityAddressParam);
    communityMigratedEvent.parameters.push(previousCommunityAddressParam);

    return communityMigratedEvent;
}

export function createBeneficiaryParamsUpdatedEvent(
    community: string,
    props: Map<string, string>
): BeneficiaryParamsUpdated {
    const beneficiaryParamsUpdatedEvent = changetype<BeneficiaryParamsUpdated>(newMockEvent());

    beneficiaryParamsUpdatedEvent.address = Address.fromString(community);
    beneficiaryParamsUpdatedEvent.parameters = [];
    // we don't use the old parameters, so they can be anything
    const oldOriginalClaimAmountParam = new ethereum.EventParam(
        'oldOriginalClaimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    const oldMaxTotalClaimParam = new ethereum.EventParam(
        'oldMaxTotalClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    const oldDecreaseStepParam = new ethereum.EventParam(
        'oldDecreaseStep',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    const oldBaseIntervalParam = new ethereum.EventParam(
        'oldBaseInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    const oldIncrementIntervalParam = new ethereum.EventParam(
        'oldIncrementInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    //
    const newOriginalClaimAmountParam = new ethereum.EventParam(
        'newOriginalClaimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('originalClaimAmount')))
    );
    const newMaxTotalClaimParam = new ethereum.EventParam(
        'newMaxTotalClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxTotalClaim')))
    );
    const newDecreaseStepParam = new ethereum.EventParam(
        'newDecreaseStep',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('decreaseStep')))
    );
    const newBaseIntervalParam = new ethereum.EventParam(
        'newBaseInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('baseInterval')))
    );
    const newIncrementIntervalParam = new ethereum.EventParam(
        'newIncrementInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('incrementInterval')))
    );

    beneficiaryParamsUpdatedEvent.parameters.push(oldOriginalClaimAmountParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldMaxTotalClaimParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldDecreaseStepParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldBaseIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldIncrementIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newOriginalClaimAmountParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newMaxTotalClaimParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newDecreaseStepParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newBaseIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newIncrementIntervalParam);

    return beneficiaryParamsUpdatedEvent;
}

// community edited is an old event not used currently, only to support vAlpha contracts
export function createCommunityEditedEvent(community: string, props: Map<string, string>): CommunityEdited {
    const communityEditedEvent = changetype<CommunityEdited>(newMockEvent());

    communityEditedEvent.address = Address.fromString(community);
    communityEditedEvent.parameters = [];
    const claimAmountParam = new ethereum.EventParam(
        '_claimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('originalClaimAmount')))
    );
    const maxClaimParam = new ethereum.EventParam(
        '_maxClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxTotalClaim')))
    );
    const baseIntervalParam = new ethereum.EventParam(
        '_baseInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('baseInterval')))
    );
    const incrementIntervalParam = new ethereum.EventParam(
        '_incrementInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('incrementInterval')))
    );

    communityEditedEvent.parameters.push(claimAmountParam);
    communityEditedEvent.parameters.push(maxClaimParam);
    communityEditedEvent.parameters.push(baseIntervalParam);
    communityEditedEvent.parameters.push(incrementIntervalParam);

    return communityEditedEvent;
}

export function createCommunityLockedEvent(ambassador: string, communityAddress: string): CommunityLocked {
    const communityLockedEvent = changetype<CommunityLocked>(newMockEvent());

    communityLockedEvent.parameters = [];
    communityLockedEvent.address = Address.fromString(communityAddress);
    const ambassadorParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );

    communityLockedEvent.parameters.push(ambassadorParam);

    return communityLockedEvent;
}

export function createCommunityUnlockedEvent(ambassador: string, communityAddress: string): CommunityUnlocked {
    const communityUnlockedEvent = changetype<CommunityUnlocked>(newMockEvent());

    communityUnlockedEvent.parameters = [];
    communityUnlockedEvent.address = Address.fromString(communityAddress);
    const ambassadorParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );

    communityUnlockedEvent.parameters.push(ambassadorParam);

    return communityUnlockedEvent;
}

export function createCommunityCopiedEvent(originalCommunity: string, copyCommunity: string): CommunityCopied {
    const communityCopiedEvent = changetype<CommunityCopied>(newMockEvent());

    communityCopiedEvent.parameters = [];
    const originalCommunityParam = new ethereum.EventParam(
        'originalCommunity',
        ethereum.Value.fromAddress(Address.fromString(originalCommunity))
    );
    const copyCommunityParam = new ethereum.EventParam(
        'copyCommunity',
        ethereum.Value.fromAddress(Address.fromString(copyCommunity))
    );

    communityCopiedEvent.parameters.push(originalCommunityParam);
    communityCopiedEvent.parameters.push(copyCommunityParam);

    return communityCopiedEvent;
}
