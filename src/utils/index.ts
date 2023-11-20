import { AverageValue } from '../../generated/schema';
import { BigDecimal } from '@graphprotocol/graph-ts';

export const normalize = (amount: string): BigDecimal =>
    BigDecimal.fromString(amount).div(BigDecimal.fromString('1000000000000000000'));

export const fiveCents = BigDecimal.fromString('0.05');

/**
 * NOTE: This is imported/adapted from microcredit subgraph
 * Generic average entity create/update.
 * @param {string} averageId Average id
 * @param {BigDecimal} amount Amount to be averaged
 * @param {boolean} isIncrease Increase or decrease average
 * @returns {void}
 */
export function updateAverage(averageId: string, amount: BigDecimal, isIncrease: boolean = true): void {
    let averageUpdated = AverageValue.load(averageId);

    // create average entity if it doesn't exist
    if (!averageUpdated) {
        averageUpdated = new AverageValue(averageId);
        averageUpdated.value = BigDecimal.zero();
        averageUpdated.count = 0;
    }
    if (isIncrease) {
        // update new average entity data
        // update the "value" with the following formula "value += (amount - value) / (count + 1)"
        averageUpdated.value = averageUpdated.value.plus(
            amount.minus(averageUpdated.value).div(BigDecimal.fromString((averageUpdated.count + 1).toString()))
        );
        averageUpdated.count += 1;
    } else {
        // to subtract from the average
        // value -= (value - amount) / count
        // count -= 1
        averageUpdated.value = averageUpdated.value.minus(
            averageUpdated.value.minus(amount).div(BigDecimal.fromString(averageUpdated.count.toString()))
        );
        averageUpdated.count -= 1;
    }

    // save newly created average entity
    averageUpdated.save();
}
