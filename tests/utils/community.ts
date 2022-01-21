/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    CommunityAdded,
    CommunityRemoved
} from '../../generated/CommunityAdmin/CommunityAdmin';

export function createCommunityAddedEvent(
    communityAddress: string,
    managers: string[],
    props: Map<string, string>
): CommunityAdded {
    const communityAddedEvent = changetype<CommunityAdded>(newMockEvent());

    communityAddedEvent.parameters = [];
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );
    const managersParam = new ethereum.EventParam(
        'managers',
        ethereum.Value.fromAddressArray([Address.fromString(managers[0])])
    );
    const claimAmountParam = new ethereum.EventParam(
        'claimAmount',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('claimAmount'))
        )
    );
    const maxClaimParam = new ethereum.EventParam(
        'maxClaim',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('maxClaim'))
        )
    );
    const decreaseStepParam = new ethereum.EventParam(
        'decreaseStep',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('decreaseStep'))
        )
    );
    const baseIntervalParam = new ethereum.EventParam(
        'baseInterval',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('baseInterval'))
        )
    );
    const incrementIntervalParam = new ethereum.EventParam(
        'incrementInterval',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('incrementInterval'))
        )
    );
    const minTrancheParam = new ethereum.EventParam(
        'minTranche',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('minTranche'))
        )
    );
    const maxTrancheParam = new ethereum.EventParam(
        'maxTranche',
        ethereum.Value.fromUnsignedBigInt(
            BigInt.fromString(props.get('maxTranche'))
        )
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

export function createCommunityRemovedEvent(
    communityAddress: string
): CommunityRemoved {
    const communityRemovedEvent = changetype<CommunityRemoved>(newMockEvent());

    communityRemovedEvent.parameters = [];
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );

    communityRemovedEvent.parameters.push(communityAddressParam);

    return communityRemovedEvent;
}
