import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
    CommunityEntity,
    ManagerEntity,
    UBIEntity,
    UserActivityEntity
} from '../../generated/schema';
import { communityAdminAddress } from './addresses';
import { loadOrCreateCommunityDaily } from './community';
import { loadOrCreateDailyUbi } from './ubi';

export function genericHandleManagerAdded(
    _community: CommunityEntity | null,
    _manager: Address,
    _by: Address,
    _hash: string,
    _blockTimestamp: BigInt
): void {
    if (_community) {
        if (_manager.notEqual(Address.fromString(communityAdminAddress))) {
            const communityAddress = Address.fromString(_community.id);

            const communityDaily = loadOrCreateCommunityDaily(
                communityAddress,
                _blockTimestamp
            );

            let isManagerMigrated = false;
            const managerId = _manager.toHex();
            let manager = ManagerEntity.load(managerId);

            if (!manager) {
                manager = new ManagerEntity(managerId);
                manager.address = _manager;
                manager.community = _community.id;
                manager.state = 0;
                manager.added = 0;
                manager.removed = 0;
                manager.since = _blockTimestamp.toI32();
            } else if (
                _community.previous !== null &&
                Address.fromString(manager.community).equals(
                    // wasm still thinks it's null, so need to force
                    _community.previous!
                )
            ) {
                manager.community = _community.id;
                isManagerMigrated = true;
            } else if (
                Address.fromString(manager.community).notEqual(communityAddress)
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
                manager.community = _community.id;
                manager.state = 0;
                manager.added = 0;
                manager.removed = 0;
                manager.since = _blockTimestamp.toI32();
            } else if (
                Address.fromString(manager.community).equals(communityAddress)
            ) {
                // manager rejoining same community from where has left
                manager.state = 0;
                _community.removedManagers -= 1;
            }
            if (!isManagerMigrated) {
                // update manager list
                const managerList = _community.managerList;

                managerList.push(managerId);
                _community.managerList = managerList;
                // update ubi
                const ubi = UBIEntity.load('0')!;

                ubi.managers += 1;
                ubi.save();
                // update daily ubi
                const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

                ubiDaily.managers += 1;
                ubiDaily.save();
                // update community
                _community.managers += 1;
                _community.save();
                // update community daily
                communityDaily.managers += 1;
                communityDaily.save();
                // add manager activity
                const activity = new UserActivityEntity(_hash);

                activity.user = _manager;
                activity.by = _by;
                activity.community = _community.id;
                activity.timestamp = _blockTimestamp.toI32();
                activity.activity = 'ADDED';
                activity.save();
            }
            manager.save();
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
            const managerList = community.managerList;

            managerList.splice(managerList.indexOf(managerId), 1);
            community.managerList = managerList;
            // update ubi
            const ubi = UBIEntity.load('0')!;

            ubi.managers -= 1;
            ubi.save();
            // update daily ubi
            const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);

            ubiDaily.managers -= 1;
            ubiDaily.save();
            // add beneficiary activity
            const activity = new UserActivityEntity(_hash);

            activity.user = _manager;
            activity.by = _by;
            activity.community = community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'REMOVED';
            activity.save();
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
