import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { CommunityEntity, UBIEntity } from '../../generated/schema';
import { treasuryAddress } from '../common/addresses';
import { loadOrCreateCommunityDaily } from '../common/community';
import { loadOrCreateDailyUbi } from '../common/ubi';
import { normalize } from '../utils';

export function handleTransferCeloDollar(event: Transfer): void {
    const community = CommunityEntity.load(event.params.to.toHex());
    if (community) {
        const normalizedAmount = normalize(event.params.amount.toString());
        const communityDaily = loadOrCreateCommunityDaily(
            event.params.to,
            event.block.timestamp
        );
        if (event.params.from.notEqual(Address.fromString(treasuryAddress))) {
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.contributed = ubi.contributed.plus(normalizedAmount);
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
            ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);
            ubiDaily.save();
        }
        // update community
        community.contributed = community.contributed.plus(normalizedAmount);
        community.save();
        // update community daily
        communityDaily.contributed =
            communityDaily.contributed.plus(normalizedAmount);
        communityDaily.save();
    } else if (event.params.to.equals(Address.fromString(treasuryAddress))) {
        const normalizedAmount = normalize(event.params.amount.toString());
        // update ubi
        const ubi = UBIEntity.load('0')!;
        ubi.contributed = ubi.contributed.plus(normalizedAmount);
        ubi.save();
        // update daily ubi
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
        ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);
        ubiDaily.save();
    }
    // nothing goes here!
}
