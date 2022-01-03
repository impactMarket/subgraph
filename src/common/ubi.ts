import { BigInt } from '@graphprotocol/graph-ts';

import { UBIDailyEntity } from '../../generated/schema';

export function loadOrCreateDailyUbi(_blockTimestamp: BigInt): UBIDailyEntity {
    let ubiDaily = UBIDailyEntity.load(
        (_blockTimestamp.toI32() / 86400).toString()
    );
    if (!ubiDaily) {
        ubiDaily = new UBIDailyEntity(
            (_blockTimestamp.toI32() / 86400).toString()
        );
        ubiDaily.communities = 0;
        ubiDaily.beneficiaries = 0;
        ubiDaily.managers = 0;
        ubiDaily.contributed = BigInt.fromI32(0);
        ubiDaily.claimed = BigInt.fromI32(0);
    }
    return ubiDaily;
}
