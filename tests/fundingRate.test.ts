import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    beneficiaryAddress,
    communityAddress,
    communityProps,
    fiveCents,
    managerAddress,
    toToken,
    userAddress
} from './utils/constants';
import { cUSDAddress, treasuryAddress } from './../src/common/addresses';
import { createBeneficiaryAddedEvent, createBeneficiaryClaimEvent } from './utils/beneficiary';
import { createCommunityAddedEvent } from './utils/community';
import { createTransferEvent } from './utils/transfer';
import { handleBeneficiaryAdded, handleBeneficiaryClaim } from '../src/mappings/community';
import { handleCommunityAdded } from './../src/mappings/communityAdmin';
import { handleTransferAsset } from './../src/mappings/transfer';
import { normalize } from './../src/utils/index';

export { handleTransferAsset };

const fiveDollars = toToken('5');
const multiplier = BigInt.fromString('100').toBigDecimal();

test('contribute cusd to treasury and community over some days', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const day1Time = 1640716193;
    const day2Time = 1640816193;
    const day3Time = 1640866193;

    const dayId1 = day1Time / 86400;
    const dayId2 = day2Time / 86400;

    // day 1

    // to treasury
    const transferEvent1 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // to treasury
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // to community
    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // from treasury to community
    const transferEvent4 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);
    handleTransferAsset(transferEvent3);
    handleTransferAsset(transferEvent4);

    // add beneficiary
    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);

    // add claim
    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('originalClaimAmount')!,
        communityAddress[0],
        day1Time
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent1);

    // because the new entities are only created on the following day
    // we can only start tests on day 2

    // day 2
    // add claim
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('originalClaimAmount')!,
        communityAddress[0],
        day2Time
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    const pastContributed1 = normalize(fiveDollars.times(BigInt.fromI32(3)).toString());
    const pastClaimed1 = normalize(
        BigInt.fromString(communityProps[0].get('originalClaimAmount')!).plus(fiveCents).toString()
    );

    assert.fieldEquals(
        'UBIDailyEntity',
        `${dayId1}`,
        'fundingRate',
        pastContributed1.minus(pastClaimed1).div(pastContributed1).times(multiplier).toString()
    );

    // day 3

    // to treasury
    const transferEvent5 = createTransferEvent(
        userAddress[2],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    // to community
    const transferEvent6 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    handleTransferAsset(transferEvent5);
    handleTransferAsset(transferEvent6);

    const pastContributed2 = normalize(fiveDollars.times(BigInt.fromI32(3)).toString());
    const pastClaimed2 = normalize(
        BigInt.fromString(communityProps[0].get('originalClaimAmount')!)
            .times(BigInt.fromI32(2))
            .plus(fiveCents)
            .toString()
    );

    assert.fieldEquals(
        'UBIDailyEntity',
        `${dayId2}`,
        'fundingRate',
        pastContributed2.minus(pastClaimed2).div(pastContributed2).times(multiplier).toString()
    );
});
