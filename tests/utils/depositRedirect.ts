/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    DepositAdded,
    DonateInterest,
    TokenAdded,
    TokenRemoved,
    Withdraw
} from '../../generated/DepositRedirect/DepositRedirect';


export function createTokenAddedEvent(
    tokenAddress: string
): TokenAdded {
    const tokenAddedEvent = changetype<TokenAdded>(newMockEvent());

    const tokenAddressParam = new ethereum.EventParam('tokenAddress', ethereum.Value.fromAddress(Address.fromString(tokenAddress)));

    tokenAddedEvent.parameters.push(tokenAddressParam);

    return tokenAddedEvent;
}

export function createTokenRemovedEvent(
    tokenAddress: string
): TokenRemoved {
    const tokenRemovedEvent = changetype<TokenRemoved>(newMockEvent());

    const tokenAddressParam = new ethereum.EventParam('tokenAddress', ethereum.Value.fromAddress(Address.fromString(tokenAddress)));

    tokenRemovedEvent.parameters.push(tokenAddressParam);

    return tokenRemovedEvent;
}

export function createDepositAddedEvent(
    depositorAddress: string,
    token: string,
    amount: BigInt,
    timestamp: i32 = 1640716193
): DepositAdded {
    const depositAddedEvent = changetype<DepositAdded>(newMockEvent());

    depositAddedEvent.block.timestamp = BigInt.fromI32(timestamp);

    const depositorAddressParam = new ethereum.EventParam('depositorAddress', ethereum.Value.fromAddress(Address.fromString(depositorAddress)));
    const tokenParam = new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.fromString(token)));
    const amountParam = new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount));

    depositAddedEvent.parameters.push(depositorAddressParam);
    depositAddedEvent.parameters.push(tokenParam);
    depositAddedEvent.parameters.push(amountParam);

    return depositAddedEvent;
}

export function createDonateInterestEvent(
    depositorAddress: string,
    token: string,
    amount: BigInt,
    interest: BigInt,
    timestamp: i32 = 1640716193
): DonateInterest {
    const donateInterestEvent = changetype<DonateInterest>(newMockEvent());
    
    donateInterestEvent.block.timestamp = BigInt.fromI32(timestamp);

    const depositorAddressParam = new ethereum.EventParam('depositorAddress', ethereum.Value.fromAddress(Address.fromString(depositorAddress)));
    const tokenParam = new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.fromString(token)));
    const amountParam = new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount));
    const interestParam = new ethereum.EventParam('interest', ethereum.Value.fromUnsignedBigInt(interest));

    donateInterestEvent.parameters.push(depositorAddressParam);
    donateInterestEvent.parameters.push(tokenParam);
    donateInterestEvent.parameters.push(amountParam);
    donateInterestEvent.parameters.push(interestParam);

    return donateInterestEvent;
}

export function createWithdrawEvent(
    depositorAddress: string,
    token: string,
    amount: BigInt,
    interest: BigInt,
    timestamp: i32 = 1640716193
): Withdraw {
    const withdrawEvent = changetype<Withdraw>(newMockEvent());
    
    withdrawEvent.block.timestamp = BigInt.fromI32(timestamp);

    const depositorAddressParam = new ethereum.EventParam('depositorAddress', ethereum.Value.fromAddress(Address.fromString(depositorAddress)));
    const tokenParam = new ethereum.EventParam('token', ethereum.Value.fromAddress(Address.fromString(token)));
    const amountParam = new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount));
    const interestParam = new ethereum.EventParam('interest', ethereum.Value.fromUnsignedBigInt(interest));

    withdrawEvent.parameters.push(depositorAddressParam);
    withdrawEvent.parameters.push(tokenParam);
    withdrawEvent.parameters.push(amountParam);
    withdrawEvent.parameters.push(interestParam);

    return withdrawEvent;
}

