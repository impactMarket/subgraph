import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { createProposalCreatedEvent, createProposalQueuedEvent } from './utils/proposals';
import { handleProposalCreated, handleProposalQueued } from '../src/mappings/proposals';

export { handleProposalCreated };

const targets = ['0x43c25991F0f037517D174B7E0ffD8c8Ccc471c6B'];
const values = [0];
const signatures = ['addCommunity(address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256)'];

const calldatas = ['0x74d4f7e32043f3f82c76fc501956d0f4b5da8176ff66cab4d283ef17405766c2'];
const descriptions = 'description';

test('create proposal', () => {
    clearStore();

    const community = createProposalCreatedEvent(
        1,
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        targets,
        values,
        signatures,
        calldatas,
        5,
        10,
        descriptions
    );

    handleProposalCreated(community);

    assert.fieldEquals(
        'CommunityProposalEntity',
        '1',
        'calldata',
        '0x74d4f7e32043f3f82c76fc501956d0f4b5da8176ff66cab4d283ef17405766c2'
    );
    assert.fieldEquals('CommunityProposalEntity', '1', 'status', '0');
});

test('queue proposal', () => {
    clearStore();

    const community = createProposalCreatedEvent(
        2,
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        targets,
        values,
        signatures,
        calldatas,
        5,
        10,
        descriptions
    );

    handleProposalCreated(community);

    const queue = createProposalQueuedEvent(2);

    handleProposalQueued(queue);

    assert.fieldEquals(
        'CommunityProposalEntity',
        '2',
        'calldata',
        '0x74d4f7e32043f3f82c76fc501956d0f4b5da8176ff66cab4d283ef17405766c2'
    );
    assert.fieldEquals('CommunityProposalEntity', '2', 'status', '3');
});
