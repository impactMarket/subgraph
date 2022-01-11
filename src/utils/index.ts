import { BigDecimal } from '@graphprotocol/graph-ts';

export const normalize = (amount: string): BigDecimal =>
    BigDecimal.fromString(amount).div(
        BigDecimal.fromString('1000000000000000000')
    );

export const fiveCents = BigDecimal.fromString('0.05');
