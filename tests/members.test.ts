import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { createMemberAddedEvent, createMemberRemovedEvent } from './utils/members';
import { handleMemberAdded, handleMemberRemoved } from '../src/mappings/members';
import { memberAddress } from './utils/constants';

export { handleMemberAdded, handleMemberRemoved };

test('should add member', () => {
    clearStore();

    const memberAdded = createMemberAddedEvent(memberAddress[0]);

    handleMemberAdded(memberAdded);

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[0], 'status', '0');
});

test('should remove member', () => {
    clearStore();

    const memberAdded = createMemberAddedEvent(memberAddress[0]);

    handleMemberAdded(memberAdded);

    const memberRemoved = createMemberRemovedEvent(memberAddress[0]);

    handleMemberRemoved(memberRemoved);

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[0], 'status', '1');
});
