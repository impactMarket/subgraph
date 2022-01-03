import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
    CommunityEntity,
    ManagerEntity,
    UBIEntity,
} from '../../generated/schema';
import { communityAdminAddress } from './addresses';
import { loadOrCreateCommunityDaily } from './community';
import { loadOrCreateDailyUbi } from './ubi';

export function genericHandleManagerAdded(
    _community: Address,
    _manager: Address,
    _hash: string,
    _blockTimestamp: BigInt
): void {
    if (
        _manager.notEqual(
            Address.fromString(communityAdminAddress) // community admin address
        )
    ) {
        const community = CommunityEntity.load(_community.toHex());
        if (community) {
            const communityDaily = loadOrCreateCommunityDaily(
                _community,
                _blockTimestamp
            );
            const managerId = _manager.toHex();
            let manager = ManagerEntity.load(managerId);
            if (!manager) {
                manager = new ManagerEntity(managerId);
            } else if (
                manager &&
                Address.fromString(manager.community).notEqual(_community)
            ) {
                // save previous entry of manager in another community
                const previousManager = new ManagerEntity(_hash);
                previousManager.address = manager.address;
                previousManager.community = manager.community;
                previousManager.state = manager.state;
                previousManager.save();
            }
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.managers += 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
            ubiDaily.managers += 1;
            ubiDaily.save();
            // add manager
            manager.address = _manager;
            manager.community = community.id;
            manager.state = 0;
            manager.save();
            // update community
            community.managers += 1;
            community.save();
            // update community daily
            communityDaily.managers += 1;
            communityDaily.save();
        }
    }
}

export function genericHandleManagerRemoved(
    _community: Address,
    _manager: Address,
    _blockTimestamp: BigInt
): void {
    const community = CommunityEntity.load(_community.toHex());
    if (community) {
        const communityDaily = loadOrCreateCommunityDaily(
            _community,
            _blockTimestamp
        );
        const managerId = _manager.toHex();
        const manager = ManagerEntity.load(managerId);
        if (manager) {
            // update ubi
            const ubi = UBIEntity.load('0')!;
            ubi.managers -= 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
            ubiDaily.managers -= 1;
            ubiDaily.save();
            // update manager
            manager.state = 1;
            manager.save();
            // update community
            community.managers -= 1;
            community.removedManagers += 1;
            community.save();
            // update community daily
            communityDaily.managers -= 1;
            communityDaily.save();
        }
    }
}
