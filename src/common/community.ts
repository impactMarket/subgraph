import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import { CommunityDailyEntity, CommunityEntity, UBIEntity } from '../../generated/schema';
import { fiveCents, normalize } from '../utils';
import { genericHandleManagerAdded } from './manager';
import { loadOrCreateDailyUbi } from './ubi';

export function loadOrCreateCommunityDaily(_community: Address, _blockTimestamp: BigInt): CommunityDailyEntity {
    // load or create community daily
    const dayIdInt = _blockTimestamp.toI32() / 86400;
    const communityDailyId = `${_community.toHex()}-${dayIdInt}`;
    let communityDaily = CommunityDailyEntity.load(communityDailyId);

    if (!communityDaily) {
        communityDaily = new CommunityDailyEntity(communityDailyId);
        communityDaily.community = _community.toHex();
        communityDaily.dayId = dayIdInt;
        communityDaily.beneficiaries = 0;
        communityDaily.managers = 0;
        communityDaily.claimed = BigDecimal.zero();
        communityDaily.claims = 0;
        communityDaily.contributed = BigDecimal.zero();
        communityDaily.contributors = 0;
        communityDaily.volume = BigDecimal.zero();
        communityDaily.transactions = 0;
        communityDaily.reach = 0;
        communityDaily.fundingRate = BigDecimal.zero();

        let previousDayIdInt = dayIdInt - 1;
        const yesterdayCommunityDaily = CommunityDailyEntity.load(previousDayIdInt.toString());

        if (yesterdayCommunityDaily && yesterdayCommunityDaily.fundingRate.equals(BigDecimal.zero())) {
            let mongthlyContributed = BigDecimal.zero();
            let monthlyClaimed = BigDecimal.zero();
            let previousUbiDaily = CommunityDailyEntity.load(previousDayIdInt.toString());

            do {
                if (previousUbiDaily) {
                    mongthlyContributed = previousUbiDaily.contributed.plus(mongthlyContributed);
                    monthlyClaimed = previousUbiDaily.claimed.plus(monthlyClaimed);
                }

                previousDayIdInt--;
                previousUbiDaily = CommunityDailyEntity.load(previousDayIdInt.toString());
            } while (dayIdInt - previousDayIdInt <= 30 && previousUbiDaily !== null);

            let fundingRate = BigDecimal.zero();

            if (mongthlyContributed.gt(BigDecimal.zero())) {
                fundingRate = mongthlyContributed
                    .minus(monthlyClaimed)
                    .div(mongthlyContributed)
                    .times(BigDecimal.fromString('100'));
            }

            yesterdayCommunityDaily.fundingRate = fundingRate;
            yesterdayCommunityDaily.save();
        }
    }

    return communityDaily;
}

export function generiHandleCommunityAdded(
    _communityAddress: Address,
    _managers: Array<Address>,
    _claimAmount: BigInt,
    _maxClaim: BigInt,
    _decreaseStep: BigInt,
    _baseInterval: i32,
    _incrementInterval: i32,
    _minTranche: BigInt,
    _maxTranche: BigInt,
    _hash: string,
    _blockTimestamp: BigInt,
    _firstManagerFunded: boolean = false
): void {
    const communityId = _communityAddress.toHex();
    let community = CommunityEntity.load(communityId);

    if (!community) {
        community = new CommunityEntity(communityId);
    }
    community.state = 0;
    community.startDayId = _blockTimestamp.toI32() / 86400;
    community.claimAmount = normalize(_claimAmount.toString());
    community.maxClaim = normalize(_maxClaim.toString());
    community.decreaseStep = normalize(_decreaseStep.toString());
    community.baseInterval = _baseInterval;
    community.incrementInterval = _incrementInterval;
    community.beneficiaries = 0;
    community.removedBeneficiaries = 0;
    community.managers = 0;
    community.removedManagers = 0;
    community.claims = 0;
    community.claimed = _firstManagerFunded ? fiveCents : BigDecimal.zero();
    community.contributed = BigDecimal.zero();
    community.contributors = 0;
    community.managerList = new Array<string>();
    community.minTranche = _minTranche.isZero() ? BigDecimal.zero() : normalize(_minTranche.toString());
    community.maxTranche = _maxTranche.isZero() ? BigDecimal.zero() : normalize(_maxTranche.toString());
    community.save();
    // create ubi if it doesn't exist
    let ubi = UBIEntity.load('0');

    if (!ubi) {
        ubi = new UBIEntity('0');
        // one already!
        ubi.communities = 1;
        ubi.beneficiaries = 0;
        ubi.managers = 0;
        if (_firstManagerFunded) {
            ubi.claimed = fiveCents;
            community.estimatedFunds = community.estimatedFunds.minus(fiveCents);
        } else {
            ubi.claimed = BigDecimal.zero();
        }
        ubi.claims = 0;
        ubi.contributed = BigDecimal.zero();
        ubi.contributors = 0;
        ubi.volume = BigDecimal.zero();
        ubi.transactions = 0;
        ubi.reach = 0;
        ubi.save();
    } else {
        // one already!
        ubi.communities += 1;
        if (_firstManagerFunded) {
            ubi.claimed = ubi.claimed.plus(fiveCents);
            community.estimatedFunds = community.estimatedFunds.minus(fiveCents);
        }
        ubi.save();
    }
    // update daily ubi
    const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

    ubiDaily.communities += 1;
    if (_firstManagerFunded) {
        ubiDaily.claimed = ubiDaily.claimed.plus(fiveCents);
    }
    ubiDaily.save();

    for (let index = 0; index < _managers.length; index++) {
        const manager = _managers[index];

        genericHandleManagerAdded(community, manager, _communityAddress, _hash, _blockTimestamp);
    }
}

export function generiHandleCommunityRemoved(_communityAddress: Address, _blockTimestamp: BigInt): void {
    const communityId = _communityAddress.toHex();
    let community = CommunityEntity.load(communityId);

    if (!community) {
        community = new CommunityEntity(communityId);
    }
    community.state = 1;
    community.save();
    // update ubi
    const ubi = UBIEntity.load('0')!;

    ubi.communities -= 1;
    ubi.beneficiaries -= community.beneficiaries;
    ubi.managers -= community.managers;
    ubi.save();
    // update daily ubi
    const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

    ubiDaily.communities -= 1;
    ubiDaily.beneficiaries -= community.beneficiaries;
    ubiDaily.managers -= community.managers;
    ubiDaily.save();
}
