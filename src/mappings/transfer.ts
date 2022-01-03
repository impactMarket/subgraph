import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { CommunityEntity, UBIEntity } from '../../generated/schema';
import { treasuryAddress } from '../common/addresses';
import { loadOrCreateCommunityDaily } from '../common/community';
import { loadOrCreateDailyUbi } from '../common/ubi';

export function handleTransferCeloDollar(event: Transfer): void {
    const community = CommunityEntity.load(event.params.to.toHex());
    if (community) {
        const communityDaily = loadOrCreateCommunityDaily(
            event.params.to,
            event.block.timestamp
        );
        if (event.params.from.notEqual(Address.fromString(treasuryAddress))) {
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.contributed = ubi.contributed.plus(event.params.amount);
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
            ubiDaily.contributed = ubiDaily.contributed.plus(
                event.params.amount
            );
            ubiDaily.save();
        }
        // update community
        community.contributed = community.contributed.plus(event.params.amount);
        community.save();
        // update community daily
        communityDaily.contributed = communityDaily.contributed.plus(
            event.params.amount
        );
        communityDaily.save();
    } else if (event.params.to.equals(Address.fromString(treasuryAddress))) {
        // update ubi
        const ubi = UBIEntity.load('0')!;
        ubi.contributed = ubi.contributed.plus(event.params.amount);
        ubi.save();
        // update daily ubi
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
        ubiDaily.contributed = ubiDaily.contributed.plus(event.params.amount);
        ubiDaily.save();
    }
    // nothing goes here!
}
