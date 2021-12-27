import { Address, BigInt } from '@graphprotocol/graph-ts';

import { CommunityEntity, ManagerEntity } from '../../generated/schema';
import { loadOrCreateCommunityDaily } from './community';

export function genericHandleManagerAdded(
    _community: Address,
    _manager: Address,
    _hash: string,
    _blockTimestamp: BigInt
): void {
    if (
        _manager.notEqual(
            Address.fromString('0x88b101c163bbfe1dc4764225248a6dad282d7a39') // community admin address
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
            // add manager
            manager.address = _manager;
            manager.community = community.id;
            manager.state = 0;
            manager.save();
            // update community
            community.totalManagers += 1;
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
            // update manager
            manager.state = 1;
            manager.save();
            // update community
            community.totalManagers -= 1;
            community.save();
            // update community daily
            communityDaily.managers -= 1;
            communityDaily.save();
        }
    }
}
