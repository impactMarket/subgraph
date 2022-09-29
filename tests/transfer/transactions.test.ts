import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { BeneficiaryEntity, CommunityEntity, ManagerEntity, UBIEntity } from '../../generated/schema';
import {
    ambassadorAddress,
    beneficiaryAddress,
    communityAddress,
    managerAddress,
    toToken,
    userAddress
} from '../utils/constants';
import { attestationProxyAddress, celoDollarAddress } from '../../src/common/addresses';
import { createTransferEvent } from '../utils/transfer';
import { handleTransferAsset } from '../../src/mappings/transfer';
import { normalize } from '../../src/utils/index';

export { handleTransferAsset };

const fiveDollars = toToken('5');

function createDummyEntities(): void {
    const community = new CommunityEntity(communityAddress[0]);

    community.state = 0;
    community.startDayId = 1;
    community.claimAmount = normalize(fiveDollars.toString());
    community.maxClaim = normalize(fiveDollars.toString());
    community.decreaseStep = normalize(fiveDollars.toString());
    community.baseInterval = 17280;
    community.incrementInterval = 12;
    community.beneficiaries = 2;
    community.removedBeneficiaries = 0;
    community.lockedBeneficiaries = 0;
    community.managers = 1;
    community.removedManagers = 0;
    community.claims = 0;
    community.contributions = new Array<string>();
    community.managerList = new Array<string>();
    community.estimatedFunds = BigDecimal.zero();
    community.minTranche = BigDecimal.zero();
    community.maxTranche = BigDecimal.zero();
    community.claimed = BigDecimal.zero();
    community.contributed = BigDecimal.zero();
    community.contributors = 0;
    community.save();

    const manager1 = new ManagerEntity(managerAddress[0]);

    manager1.address = Address.fromString(managerAddress[0]);
    manager1.community = communityAddress[0];
    manager1.state = 0;
    manager1.added = 2;
    manager1.removed = 0;
    manager1.since = 1;
    manager1.until = 0;
    manager1.addedBy = Address.fromString(ambassadorAddress[0]);
    manager1.save();

    const beneficiary1 = new BeneficiaryEntity(beneficiaryAddress[0]);

    beneficiary1.address = Address.fromString(beneficiaryAddress[0]);
    beneficiary1.community = communityAddress[0];
    beneficiary1.state = 0;
    beneficiary1.lastClaimAt = 0;
    beneficiary1.preLastClaimAt = 0;
    beneficiary1.claims = 0;
    beneficiary1.claimed = BigDecimal.zero();
    beneficiary1.since = 1;
    beneficiary1.addedBy = Address.fromString(managerAddress[0]);
    beneficiary1.save();

    const beneficiary2 = new BeneficiaryEntity(beneficiaryAddress[1]);

    beneficiary2.address = Address.fromString(beneficiaryAddress[1]);
    beneficiary2.community = communityAddress[0];
    beneficiary2.state = 0;
    beneficiary2.lastClaimAt = 0;
    beneficiary2.preLastClaimAt = 0;
    beneficiary2.claims = 0;
    beneficiary2.claimed = BigDecimal.zero();
    beneficiary2.since = 1;
    beneficiary2.addedBy = Address.fromString(managerAddress[0]);
    beneficiary2.save();

    const community1 = new CommunityEntity(communityAddress[1]);

    community1.state = 0;
    community1.startDayId = 1;
    community1.claimAmount = normalize(fiveDollars.toString());
    community1.maxClaim = normalize(fiveDollars.toString());
    community1.decreaseStep = normalize(fiveDollars.toString());
    community1.baseInterval = 17280;
    community1.incrementInterval = 12;
    community1.beneficiaries = 2;
    community1.removedBeneficiaries = 0;
    community1.lockedBeneficiaries = 0;
    community1.managers = 1;
    community1.removedManagers = 0;
    community1.claims = 0;
    community1.contributions = new Array<string>();
    community1.managerList = new Array<string>();
    community1.estimatedFunds = BigDecimal.zero();
    community1.minTranche = BigDecimal.zero();
    community1.maxTranche = BigDecimal.zero();
    community1.claimed = BigDecimal.zero();
    community1.contributed = BigDecimal.zero();
    community1.contributors = 0;
    community1.save();

    const manager2 = new ManagerEntity(managerAddress[0]);

    manager2.address = Address.fromString(managerAddress[1]);
    manager2.community = communityAddress[1];
    manager2.state = 0;
    manager2.added = 2;
    manager2.removed = 0;
    manager2.since = 1;
    manager2.until = 0;
    manager2.addedBy = Address.fromString(ambassadorAddress[0]);
    manager2.save();

    const beneficiary3 = new BeneficiaryEntity(beneficiaryAddress[2]);

    beneficiary3.address = Address.fromString(beneficiaryAddress[2]);
    beneficiary3.community = communityAddress[1];
    beneficiary3.state = 0;
    beneficiary3.lastClaimAt = 0;
    beneficiary3.preLastClaimAt = 0;
    beneficiary3.claims = 0;
    beneficiary3.claimed = BigDecimal.zero();
    beneficiary3.since = 1;
    beneficiary3.addedBy = Address.fromString(managerAddress[1]);
    beneficiary3.save();

    const beneficiary4 = new BeneficiaryEntity(beneficiaryAddress[3]);

    beneficiary4.address = Address.fromString(beneficiaryAddress[3]);
    beneficiary4.community = communityAddress[1];
    beneficiary4.state = 0;
    beneficiary4.lastClaimAt = 0;
    beneficiary4.preLastClaimAt = 0;
    beneficiary4.claims = 0;
    beneficiary4.claimed = BigDecimal.zero();
    beneficiary4.since = 1;
    beneficiary4.addedBy = Address.fromString(managerAddress[1]);
    beneficiary4.save();

    const ubi = new UBIEntity('0');

    ubi.communities = 2;
    ubi.beneficiaries = 4;
    ubi.managers = 2;
    ubi.claimed = BigDecimal.zero();
    ubi.contributed = BigDecimal.zero();
    ubi.contributors = 0;
    ubi.volume = BigDecimal.zero();
    ubi.transactions = 0;
    ubi.reach = 0;
    ubi.claims = 0;
    ubi.save();
}

test('should count first time user transactions', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.toString()).toString()
    );
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '1');
    assert.fieldEquals('UBIEntity', '0', 'transactions', '1');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '1');
});

test('should count multiple user transactions, same day', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');
    assert.fieldEquals('UBIEntity', '0', 'transactions', '2');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '1');
});

test('should count multiple users multiple transactions, same day', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[2],
        fiveDollars.toString(),
        celoDollarAddress,
    );
    const transferEvent3 = createTransferEvent(
        beneficiaryAddress[1],
        beneficiaryAddress[3],
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);
    handleTransferAsset(transferEvent3);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[1], 'transactions', '2');
    assert.fieldEquals('UBIEntity', '0', 'transactions', '3');
    assert.fieldEquals('UBIEntity', '0', 'reach', '3');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '3');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '3');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '3');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '3');
});

test('should count multiple users multiple transactions, different days', () => {
    clearStore();

    createDummyEntities();

    // day 1

    const day1Time = 1640716193;

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
        day1Time
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[2],
        fiveDollars.toString(),
        celoDollarAddress,
        day1Time + 1
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    // day 2

    const day2Time = 1640802593;

    const transferEvent3 = createTransferEvent(
        beneficiaryAddress[1],
        beneficiaryAddress[2],
        fiveDollars.toString(),
        celoDollarAddress,
        day2Time
    );

    const transferEvent4 = createTransferEvent(
        beneficiaryAddress[2],
        beneficiaryAddress[3],
        fiveDollars.toString(),
        celoDollarAddress,
        day2Time + 1
    );

    handleTransferAsset(transferEvent3);
    handleTransferAsset(transferEvent4);

    const dayId1 = day1Time / 86400;
    const dayId2 = day2Time / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[1], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[2], 'transactions', '3');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[3], 'transactions', '1');
    assert.fieldEquals('UBIEntity', '0', 'transactions', '4');
    assert.fieldEquals('UBIEntity', '0', 'reach', '3');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'reach', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'reach', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'reach', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId2.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId2.toString()}`, 'reach', '1');
});

test('should count multiple user transactions, different days', () => {
    clearStore();

    createDummyEntities();

    // day 1

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
        1640716193
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
        1640716194
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    // day 2

    const transferEvent3 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
        1640802593
    );

    const transferEvent4 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
        1640802594
    );

    handleTransferAsset(transferEvent3);
    handleTransferAsset(transferEvent4);

    const dayId1 = transferEvent1.block.timestamp.toI32() / 86400;
    const dayId2 = transferEvent3.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(4)).toString()).toString()
    );
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '4');
    assert.fieldEquals('UBIEntity', '0', 'transactions', '4');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'reach', '1');
});

test('should not count user transactions if none parties are a beneficiary', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        userAddress[1],
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);
    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});

test('should not count user transactions if from forbiden address', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        attestationProxyAddress,
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);
    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});

test('should not count user transactions if from community', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(
        communityAddress[0],
        beneficiaryAddress[0],
        fiveDollars.toString(),
        celoDollarAddress,
    );

    handleTransferAsset(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);
    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});
