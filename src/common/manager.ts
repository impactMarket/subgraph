import { Address, BigInt } from '@graphprotocol/graph-ts';

import { CommunityEntity, ManagerEntity, UBIEntity, UserActivityEntity } from '../../generated/schema';
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

            const communityDaily = loadOrCreateCommunityDaily(communityAddress, _blockTimestamp);

            let isManagerMigrated = false;
            let previouslyRemoved = true;
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
                manager.until = 0;
                manager.addedBy = _by;
            } else if (
                _community.previous !== null &&
                Address.fromString(manager.community).equals(
                    // wasm still thinks it's null, so need to force
                    _community.previous!
                )
            ) {
                // this is just migrating
                manager.community = _community.id;
                isManagerMigrated = true;
            } else if (Address.fromString(manager.community).notEqual(communityAddress)) {
                // save previous entry of manager in another community
                const previousManager = new ManagerEntity(_hash);

                previousManager.address = manager.address;
                previousManager.community = manager.community;
                // if an active manager is added somewhere else,
                // set it as removed on the previous community
                if (manager.state === 0) {
                    previousManager.state = 1;
                    previousManager.until = _blockTimestamp.toI32();
                    previouslyRemoved = false;
                    // update previous community manager list
                    const previousCommunity = CommunityEntity.load(manager.community)!;
                    const previousManagerList = previousCommunity.managerList;

                    previousManagerList.splice(previousManagerList.indexOf(managerId), 1);
                    previousCommunity.managerList = previousManagerList;
                    previousCommunity.managers -= 1;
                    previousCommunity.removedManagers += 1;
                    previousCommunity.save();
                    // update new community manager list
                    const newManagerList = _community.managerList;

                    newManagerList.push(managerId);
                    _community.managerList = newManagerList;
                    _community.managers += 1;
                    _community.save();
                } else {
                    previousManager.state = manager.state;
                    previousManager.until = manager.until;
                }
                previousManager.added = manager.added;
                previousManager.removed = manager.removed;
                previousManager.since = manager.since;
                previousManager.addedBy = manager.addedBy;
                previousManager.removedBy = manager.removedBy;
                previousManager.save();
                // use existing object and register with new manager data
                manager.address = _manager;
                manager.community = _community.id;
                manager.state = 0;
                manager.added = 0;
                manager.removed = 0;
                manager.since = _blockTimestamp.toI32();
                manager.until = 0;
                manager.addedBy = _by;
                manager.removedBy = null;
            } else if (Address.fromString(manager.community).equals(communityAddress)) {
                // reset if removed in the past and readded
                if (manager.state === 1) {
                    manager.until = 0;
                    manager.addedBy = _by;
                    manager.removedBy = null;
                    _community.removedManagers -= 1;
                }
                // manager rejoining same community from where has left
                manager.state = 0;
            }
            if (!isManagerMigrated && previouslyRemoved) {
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
            }
            // add manager activity
            const activity = new UserActivityEntity(_hash);

            activity.user = _manager;
            activity.by = _by;
            activity.community = _community.id;
            activity.timestamp = _blockTimestamp.toI32();
            activity.activity = 'ADDED';
            activity.save();
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
        const communityDaily = loadOrCreateCommunityDaily(_community, _blockTimestamp);
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
            manager.until = _blockTimestamp.toI32();
            manager.removedBy = _by;
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
