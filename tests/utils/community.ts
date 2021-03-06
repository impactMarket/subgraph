/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    BeneficiaryParamsUpdated,
    CommunityLocked,
    CommunityUnlocked
} from '../../generated/templates/Community/Community';
import { CommunityAdded, CommunityMigrated, CommunityRemoved } from '../../generated/CommunityAdmin/CommunityAdmin';
import { CommunityEdited } from '../../generated/templates/OldCommunity/OldCommunity';

export function createCommunityAddedEvent(
    communityAddress: string,
    managers: string[],
    props: Map<string, string>,
    timestamp: i32 = 0
): CommunityAdded {
    const communityAddedEvent = changetype<CommunityAdded>(newMockEvent());

    communityAddedEvent.parameters = [];
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
    const claimAmountParam = new ethereum.EventParam(
        'claimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('claimAmount')))
    );
    const maxClaimParam = new ethereum.EventParam(
        'maxClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxClaim')))
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
    communityAddedEvent.parameters.push(claimAmountParam);
    communityAddedEvent.parameters.push(maxClaimParam);
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
    const oldClaimAmountParam = new ethereum.EventParam(
        'oldClaimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );
    const oldMaxClaimParam = new ethereum.EventParam(
        'oldMaxClaim',
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
    const newClaimAmountParam = new ethereum.EventParam(
        'newClaimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('claimAmount')))
    );
    const newMaxClaimParam = new ethereum.EventParam(
        'newMaxClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxClaim')))
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

    beneficiaryParamsUpdatedEvent.parameters.push(oldClaimAmountParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldMaxClaimParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldDecreaseStepParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldBaseIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(oldIncrementIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newClaimAmountParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newMaxClaimParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newDecreaseStepParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newBaseIntervalParam);
    beneficiaryParamsUpdatedEvent.parameters.push(newIncrementIntervalParam);

    return beneficiaryParamsUpdatedEvent;
}

export function createCommunityEditedEvent(community: string, props: Map<string, string>): CommunityEdited {
    const communityEditedEvent = changetype<CommunityEdited>(newMockEvent());

    communityEditedEvent.address = Address.fromString(community);
    communityEditedEvent.parameters = [];
    const claimAmountParam = new ethereum.EventParam(
        '_claimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('claimAmount')))
    );
    const maxClaimParam = new ethereum.EventParam(
        '_maxClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(props.get('maxClaim')))
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

export function createCommunityLockedEvent(ambassadorEntity: string, communityAddress: string): CommunityLocked {
    const communityLockedEvent = changetype<CommunityLocked>(newMockEvent());

    communityLockedEvent.parameters = [];
    communityLockedEvent.address = Address.fromString(communityAddress);
    const ambassadorEntityParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(ambassadorEntity))
    );

    communityLockedEvent.parameters.push(ambassadorEntityParam);

    return communityLockedEvent;
}

export function createCommunityUnlockedEvent(ambassadorEntity: string, communityAddress: string): CommunityUnlocked {
    const communityUnlockedEvent = changetype<CommunityUnlocked>(newMockEvent());

    communityUnlockedEvent.parameters = [];
    communityUnlockedEvent.address = Address.fromString(communityAddress);
    const ambassadorEntityParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(ambassadorEntity))
    );

    communityUnlockedEvent.parameters.push(ambassadorEntityParam);

    return communityUnlockedEvent;
}
