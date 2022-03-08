import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { UBIDailyEntity } from '../../generated/schema';

export function loadOrCreateDailyUbi(_blockTimestamp: BigInt): UBIDailyEntity {
    const ubiDailyId = (_blockTimestamp.toI32() / 86400).toString();
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
    }

    return ubiDaily;
}
