import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
    CommunityEntity,
    ManagerEntity,
    UBIEntity,
    UserActivityEntity,
} from '../../generated/schema';
import { communityAdminAddress } from './addresses';
import { loadOrCreateCommunityDaily } from './community';
import { loadOrCreateDailyUbi } from './ubi';

export function genericHandleManagerAdded(
    _community: Address,
    _manager: Address,
    _by: Address,
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
            let isNewManager = true;
            const managerId = _manager.toHex();
            let manager = ManagerEntity.load(managerId);
            if (!manager) {
                manager = new ManagerEntity(managerId);
                manager.address = _manager;
                manager.community = community.id;
                manager.state = 0;
                manager.added = 0;
                manager.removed = 0;
            } else {
                if (
                    Address.fromString(manager.community).equals(
                        community.previous
                    )
                ) {
                    manager.community = community.id;
                    isNewManager = false;
                } else if (
                    Address.fromString(manager.community).notEqual(_community)
                ) {
                    // save previous entry of manager in another community
                    const previousManager = new ManagerEntity(_hash);
                    previousManager.address = manager.address;
                    previousManager.community = manager.community;
                    previousManager.state = manager.state;
                    previousManager.added = manager.added;
                    previousManager.removed = manager.removed;
                    previousManager.save();
                    //
                    manager.address = _manager;
                    manager.community = community.id;
                    manager.state = 0;
                    manager.added = 0;
                    manager.removed = 0;
                }
            }
            // update or add manager;
            manager.save();
            if (isNewManager) {
                // update ubi
                const ubi = UBIEntity.load('0')!;
                ubi.managers += 1;
                ubi.save();
                // update daily ubi
                const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
                ubiDaily.managers += 1;
                ubiDaily.save();
                // add beneficiary activity
                const activity = new UserActivityEntity(_hash);
                activity.user = _manager;
                activity.by = _by;
                activity.community = community.id;
                activity.timestamp = _blockTimestamp.toI32();
                activity.activity = 'added';
                activity.save();
                // update community
                community.managers += 1;
                community.save();
                // update community daily
                communityDaily.managers += 1;
                communityDaily.save();
            }
        }
    }
}

export function genericHandleManagerRemoved(
    _community: Address,
    _manager: Address,
    _by: Address,
    _hash: string,
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
            // add beneficiary activity
            const activity = new UserActivityEntity(_hash);
            activity.user = _manager;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'removed';
            activity.save();
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
