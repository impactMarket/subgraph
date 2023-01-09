import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    cEURAddress,
    cREALAddress,
    cUSDAddress,
    fiveCents,
    normalize,
    userAddress,
} from './utils/constants';
import {
    createDepositAddedEvent,
    createDonateInterestEvent,
    createTokenAddedEvent,
    createTokenRemovedEvent,
    createWithdrawEvent
} from './utils/depositRedirect';
import {
    handleDepositAdded,
    handleDonateInterest,
    handleTokenAdded,
    handleTokenRemoved,
    handleWithdraw
} from '../src/mappings/depositRedirect';

export {
    handleDepositAdded,
    handleDonateInterest,
    handleTokenAdded,
    handleTokenRemoved,
    handleWithdraw
};

const day1Time = 1640716193;
const day2Time = 1640816193;
const day3Time = 1640866193;

test('should add token', () => {
    clearStore();

    const tokenAdd = createTokenAddedEvent(cUSDAddress);

    handleTokenAdded(tokenAdd);

    assert.fieldEquals('DepositRedirectToken', cUSDAddress, 'active', 'true');
});

test('should remove token', () => {
    clearStore();

    const tokenAdd = createTokenAddedEvent(cUSDAddress);

    handleTokenAdded(tokenAdd);

    const tokenRemove = createTokenRemovedEvent(cUSDAddress);

    handleTokenRemoved(tokenRemove);

    assert.fieldEquals('DepositRedirectToken', cUSDAddress, 'active', 'false');
});

test('should deposits multiple days', () => {
    clearStore();

    const tokenAddcUSD = createTokenAddedEvent(cUSDAddress);
    const tokenAddcEUR = createTokenAddedEvent(cEURAddress);
    const tokenAddcREAL = createTokenAddedEvent(cREALAddress);

    handleTokenAdded(tokenAddcUSD);
    handleTokenAdded(tokenAddcEUR);
    handleTokenAdded(tokenAddcREAL);

    // day 1
    const depositAddedEvent1 = createDepositAddedEvent(
        userAddress[0],
        cUSDAddress,
        fiveCents,
        day1Time
    );

    handleDepositAdded(depositAddedEvent1);

    const dayId1 = day1Time / 86400;

    assert.fieldEquals('Depositor', userAddress[0], 'assets', `[depositor-${cUSDAddress}-${userAddress[0]}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cUSDAddress}-${userAddress[0]}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals('DepositRedirectDaily', `${dayId1}`, 'assets', `[depositRedirectDaily-${cUSDAddress}-${dayId1}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositRedirectDaily-${cUSDAddress}-${dayId1}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals('DepositRedirectToken', cUSDAddress, 'deposited', normalize(fiveCents.toString()).toString());

    // day 2
    const depositAddedEvent2 = createDepositAddedEvent(
        userAddress[0],
        cUSDAddress,
        fiveCents,
        day2Time
    );

    const depositAddedEvent3 = createDepositAddedEvent(
        userAddress[1],
        cUSDAddress,
        fiveCents,
        day2Time
    );

    handleDepositAdded(depositAddedEvent2);
    handleDepositAdded(depositAddedEvent3);

    const dayId2 = day2Time / 86400;

    assert.fieldEquals('Depositor', userAddress[0], 'assets', `[depositor-${cUSDAddress}-${userAddress[0]}]`);
    assert.fieldEquals('Depositor', userAddress[1], 'assets', `[depositor-${cUSDAddress}-${userAddress[1]}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cUSDAddress}-${userAddress[0]}`,
        'deposited',
        normalize(fiveCents.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cUSDAddress}-${userAddress[1]}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals('DepositRedirectDaily', `${dayId2}`, 'assets', `[depositRedirectDaily-${cUSDAddress}-${dayId2}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositRedirectDaily-${cUSDAddress}-${dayId2}`,
        'deposited',
        normalize(fiveCents.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('DepositRedirectToken', cUSDAddress, 'deposited', normalize(fiveCents.times(BigInt.fromI32(3)).toString()).toString());

    // day 3
    const depositAddedEvent4 = createDepositAddedEvent(
        userAddress[0],
        cEURAddress,
        fiveCents,
        day3Time
    );

    const depositAddedEvent5 = createDepositAddedEvent(
        userAddress[1],
        cUSDAddress,
        fiveCents,
        day3Time
    );

    const depositAddedEvent6 = createDepositAddedEvent(
        userAddress[1],
        cREALAddress,
        fiveCents,
        day3Time
    );

    handleDepositAdded(depositAddedEvent4);
    handleDepositAdded(depositAddedEvent5);
    handleDepositAdded(depositAddedEvent6);

    const dayId3 = day3Time / 86400;

    assert.fieldEquals('Depositor', userAddress[0], 'assets', `[depositor-${cUSDAddress}-${userAddress[0]}, depositor-${cEURAddress}-${userAddress[0]}]`);
    assert.fieldEquals('Depositor', userAddress[1], 'assets', `[depositor-${cUSDAddress}-${userAddress[1]}, depositor-${cREALAddress}-${userAddress[1]}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cUSDAddress}-${userAddress[0]}`,
        'deposited',
        normalize(fiveCents.times(BigInt.fromI32(2)).toString()).toString()
    );assert.fieldEquals(
        'DepositAsset',
        `depositor-${cEURAddress}-${userAddress[0]}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cUSDAddress}-${userAddress[1]}`,
        'deposited',
        normalize(fiveCents.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'DepositAsset',
        `depositor-${cREALAddress}-${userAddress[1]}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals('DepositRedirectDaily', `${dayId3}`, 'assets', `[depositRedirectDaily-${cEURAddress}-${dayId3}, depositRedirectDaily-${cUSDAddress}-${dayId3}, depositRedirectDaily-${cREALAddress}-${dayId3}]`);
    assert.fieldEquals(
        'DepositAsset',
        `depositRedirectDaily-${cUSDAddress}-${dayId3}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals(
        'DepositAsset',
        `depositRedirectDaily-${cEURAddress}-${dayId3}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals(
        'DepositAsset',
        `depositRedirectDaily-${cREALAddress}-${dayId3}`,
        'deposited',
        normalize(fiveCents.toString()).toString()
    );
    assert.fieldEquals('DepositRedirectToken', cUSDAddress, 'deposited', normalize(fiveCents.times(BigInt.fromI32(4)).toString()).toString());
    assert.fieldEquals('DepositRedirectToken', cEURAddress, 'deposited', normalize(fiveCents.toString()).toString());
    assert.fieldEquals('DepositRedirectToken', cREALAddress, 'deposited', normalize(fiveCents.toString()).toString());
});

test('should donate interest multiple days', () => {
    //
});

test('should withdraw multiple days', () => {
    //
});
