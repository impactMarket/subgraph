/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import { Transfer } from '../../generated/CeloDollar/CeloDollar';

export function createTransferEvent(
    from: string,
    to: string,
    amount: string
): Transfer {
    const transferEvent = changetype<Transfer>(newMockEvent());

    transferEvent.parameters = [];
    const fromParam = new ethereum.EventParam(
        'from',
        ethereum.Value.fromAddress(Address.fromString(from))
    );
    const toParam = new ethereum.EventParam(
        'to',
        ethereum.Value.fromAddress(Address.fromString(to))
    );
    const amountParam = new ethereum.EventParam(
        'amount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(amount))
    );

    transferEvent.parameters.push(fromParam);
    transferEvent.parameters.push(toParam);
    transferEvent.parameters.push(amountParam);

    return transferEvent;
}
