import { Address } from '@graphprotocol/graph-ts';

import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { CommunityEntity, UBIEntity } from '../../generated/schema';
import { treasuryAddress } from '../common/addresses';
import { loadOrCreateCommunityDaily } from '../common/community';
import { loadOrCreateDailyUbi } from '../common/ubi';

export function handleTransferCeloDollar(event: Transfer): void {
    const community = CommunityEntity.load(event.params.to.toHex());
    // nothing goes here!
}
