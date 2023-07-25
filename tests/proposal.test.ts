import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { createMemberAddedEvent } from './utils/members';
import {
    createProposalCanceledEvent,
    createProposalCreatedEvent,
    createProposalExecutedEvent,
    createVoteCastEvent
} from './utils/proposals';
import { handleMemberAdded } from '../src/mappings/members';
import {
    handleProposalCanceled,
    handleProposalCreated,
    handleProposalExecuted,
    handleVoteCast
} from '../src/mappings/proposals';
import { memberAddress } from './utils/constants';

export { handleProposalCreated, createProposalCanceledEvent, handleProposalExecuted, handleMemberAdded };

const signatures = ['addCommunity(address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256)'];

const calldatas = ['0x74d4f7e32043f3f82c76fc501956d0f4b5da8176ff66cab4d283ef17405766c2'];
const descriptions = 'description';

const voteAgainst = 0;
const voteFor = 1;
const voteAbstain = 2;
const communityAdminAddress = '0x0000000000000000000000000000000000000001';

test('should create proposal', () => {
    clearStore();

    const proposalId = 1;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'calldatas', `[${calldatas.join(',')}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'status', '0');
});

test('should execute proposal', () => {
    clearStore();

    const proposalId = 2;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const executed = createProposalExecutedEvent(proposalId);

    handleProposalExecuted(executed);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'calldatas', `[${calldatas.join(',')}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'status', '1');
});

test('should cancel proposal', () => {
    clearStore();

    const proposalId = 3;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const canceled = createProposalCanceledEvent(proposalId);

    handleProposalCanceled(canceled);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'calldatas', `[${calldatas.join(',')}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'status', '2');
});

test('should vote for on proposal', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);

    const proposalId = 4;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const voteCast = createVoteCastEvent(memberAddress[1], proposalId, voteFor, 1, '');

    handleVoteCast(voteCast);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedFor', `[${memberAddress[1]}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAgainst', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAbstain', '[]');

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '1');
});

test('should vote against on proposal', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);

    const proposalId = 4;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const voteCast = createVoteCastEvent(memberAddress[1], proposalId, voteAgainst, 1, '');

    handleVoteCast(voteCast);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedFor', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAgainst', `[${memberAddress[1]}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAbstain', '[]');

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '1');
});

test('should vote abstain on proposal', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);

    const proposalId = 4;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const voteCast = createVoteCastEvent(memberAddress[1], proposalId, voteAbstain, 1, '');

    handleVoteCast(voteCast);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedFor', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAgainst', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAbstain', `[${memberAddress[1]}]`);

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '1');
});

test('should vote abstain on proposal', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);

    const proposalId = 4;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const voteCast = createVoteCastEvent(memberAddress[1], proposalId, voteAbstain, 1, '');

    handleVoteCast(voteCast);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedFor', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAgainst', '[]');
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAbstain', `[${memberAddress[1]}]`);

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '1');
});

test('should receive multiple votes on proposal', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);
    const member3 = createMemberAddedEvent(memberAddress[2]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);
    handleMemberAdded(member3);

    const proposalId = 4;
    const proposal = createProposalCreatedEvent(
        proposalId,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal);

    const voteCast1 = createVoteCastEvent(memberAddress[1], proposalId, voteFor, 1, '');
    const voteCast2 = createVoteCastEvent(memberAddress[2], proposalId, voteAgainst, 2, '');

    handleVoteCast(voteCast1);
    handleVoteCast(voteCast2);

    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedFor', `[${memberAddress[1]}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAgainst', `[${memberAddress[2]}]`);
    assert.fieldEquals('ProposalEntity', proposalId.toString(), 'votedAbstain', '[]');

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '1');
    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[2], 'votes', '1');
});

test('should vote in multiple proposals', () => {
    clearStore();

    const member1 = createMemberAddedEvent(memberAddress[0]);
    const member2 = createMemberAddedEvent(memberAddress[1]);

    handleMemberAdded(member1);
    handleMemberAdded(member2);

    const proposalId1 = 4;
    const proposalId2 = 5;
    const proposal1 = createProposalCreatedEvent(
        proposalId1,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );
    const proposal2 = createProposalCreatedEvent(
        proposalId2,
        memberAddress[0],
        [communityAdminAddress],
        signatures,
        calldatas,
        10,
        descriptions
    );

    handleProposalCreated(proposal1);
    handleProposalCreated(proposal2);

    const voteCast1 = createVoteCastEvent(memberAddress[1], proposalId1, voteFor, 1, '');
    const voteCast2 = createVoteCastEvent(memberAddress[1], proposalId2, voteAgainst, 1, '');

    handleVoteCast(voteCast1);
    handleVoteCast(voteCast2);

    assert.fieldEquals('ProposalEntity', proposalId1.toString(), 'votedFor', `[${memberAddress[1]}]`);
    assert.fieldEquals('ProposalEntity', proposalId1.toString(), 'votedAgainst', '[]');
    assert.fieldEquals('ProposalEntity', proposalId1.toString(), 'votedAbstain', '[]');

    assert.fieldEquals('ProposalEntity', proposalId2.toString(), 'votedFor', '[]');
    assert.fieldEquals('ProposalEntity', proposalId2.toString(), 'votedAgainst', `[${memberAddress[1]}]`);
    assert.fieldEquals('ProposalEntity', proposalId2.toString(), 'votedAbstain', '[]');

    assert.fieldEquals('ImpactMarketCouncilMemberEntity', memberAddress[1], 'votes', '2');
});
