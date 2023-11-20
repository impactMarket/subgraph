import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { AverageValue, UBIDailyEntity } from '../../generated/schema';
import { DAILY_GIVING_RATE, DAILY_UBI_RATE, EMPTY_AVERAGE } from '../utils/constants';
import { newEmptyAverage } from '../utils';

export function loadOrCreateDailyUbi(_blockTimestamp: BigInt): UBIDailyEntity {
    const dayIdInt = _blockTimestamp.toI32() / 86400;
    const ubiDailyId = dayIdInt.toString();
    let ubiDaily = UBIDailyEntity.load(ubiDailyId);

    if (!ubiDaily) {
        const emptyAvg = AverageValue.load(EMPTY_AVERAGE)!;
        const dailyUbiRate = newEmptyAverage(DAILY_UBI_RATE + dayIdInt.toString());
        const dailyGivingRate = newEmptyAverage(DAILY_GIVING_RATE + dayIdInt.toString());

        ubiDaily = new UBIDailyEntity(ubiDailyId);
        ubiDaily.communities = 0;
        ubiDaily.beneficiaries = 0;
        ubiDaily.managers = 0;
        ubiDaily.claimed = BigDecimal.zero();
        ubiDaily.claims = 0;
        ubiDaily.contributed = BigDecimal.zero();
        ubiDaily.contributors = 0;
        ubiDaily.contributions = new Array<string>();
        ubiDaily.volume = BigDecimal.zero();
        ubiDaily.transactions = 0;
        ubiDaily.reach = 0;
        ubiDaily.fundingRate = BigDecimal.zero();
        ubiDaily.dailyUbiRate = dailyUbiRate.id;
        ubiDaily.dailyGivingRate = dailyGivingRate.id;
        ubiDaily.globalCommunityUBIAvg = emptyAvg.id;

        let previousDayIdInt = dayIdInt - 1;
        const yesterdayUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());

        if (yesterdayUbiDaily && yesterdayUbiDaily.fundingRate.equals(BigDecimal.zero())) {
            let monthlyContributed = BigDecimal.zero();
            let monthlyClaimed = BigDecimal.zero();
            let previousUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());

            do {
                if (previousUbiDaily) {
                    monthlyContributed = previousUbiDaily.contributed.plus(monthlyContributed);
                    monthlyClaimed = previousUbiDaily.claimed.plus(monthlyClaimed);
                }

                previousDayIdInt--;
                previousUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());
            } while (dayIdInt - previousDayIdInt <= 30 && previousUbiDaily !== null);

            let fundingRate = BigDecimal.zero();

            if (monthlyContributed.gt(BigDecimal.zero())) {
                // this does not consider division precendence over subtraction
                fundingRate = monthlyContributed
                    .minus(monthlyClaimed)
                    .div(monthlyContributed)
                    .times(BigDecimal.fromString('100'));
            }

            yesterdayUbiDaily.fundingRate = fundingRate;
            yesterdayUbiDaily.save();
        }

        dailyGivingRate.save();
        dailyUbiRate.save();
    }

    return ubiDaily;
}
