import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { UBIDailyEntity } from '../../generated/schema';

export function loadOrCreateDailyUbi(_blockTimestamp: BigInt): UBIDailyEntity {
    const dayIdInt = _blockTimestamp.toI32() / 86400;
    const ubiDailyId = dayIdInt.toString();
    let ubiDaily = UBIDailyEntity.load(ubiDailyId);

    if (!ubiDaily) {
        ubiDaily = new UBIDailyEntity(ubiDailyId);
        ubiDaily.communities = 0;
        ubiDaily.beneficiaries = 0;
        ubiDaily.managers = 0;
        ubiDaily.claimed = BigDecimal.zero();
        ubiDaily.contributed = BigDecimal.zero();
        ubiDaily.contributors = 0;
        ubiDaily.volume = BigDecimal.zero();
        ubiDaily.transactions = 0;
        ubiDaily.fundingRate = BigDecimal.zero();

        let previousDayIdInt = dayIdInt - 1;
        const yesterdayUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());

        if (yesterdayUbiDaily && yesterdayUbiDaily.fundingRate.equals(BigDecimal.zero())) {
            let mongthlyContributed = BigDecimal.zero();
            let monthlyClaimed = BigDecimal.zero();
            let previousUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());

            do {
                if (previousUbiDaily) {
                    mongthlyContributed = previousUbiDaily.contributed.plus(mongthlyContributed);
                    monthlyClaimed = previousUbiDaily.claimed.plus(monthlyClaimed);
                }

                previousDayIdInt--;
                previousUbiDaily = UBIDailyEntity.load(previousDayIdInt.toString());
            } while (dayIdInt - previousDayIdInt <= 30 && previousUbiDaily !== null);

            let fundingRate = BigDecimal.zero();

            if (mongthlyContributed.gt(BigDecimal.zero())) {
                fundingRate = mongthlyContributed
                    .minus(monthlyClaimed)
                    .div(mongthlyContributed)
                    .times(BigDecimal.fromString('100'));
            }

            yesterdayUbiDaily.fundingRate = fundingRate;
            yesterdayUbiDaily.save();
        }
    }

    return ubiDaily;
}
