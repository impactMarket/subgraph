import { Address } from '@graphprotocol/graph-ts';
import {
    CommunityEntity,
    ManagerEntity,
    BeneficiaryEntity,
    ClaimEntity,
} from '../../generated/schema';
import {
    BeneficiaryAdded,
    BeneficiaryClaim,
    BeneficiaryRemoved,
    ManagerAdded,
    ManagerRemoved,
} from '../../generated/templates/Community/Community';

export function handleManagerAdded(event: ManagerAdded): void {
    if (
        event.params.account.notEqual(
            Address.fromString('0x88b101c163bbfe1dc4764225248a6dad282d7a39') // community admin address
        )
    ) {
        const community = CommunityEntity.load(event.address.toHex());
        if (community) {
            const managerId = event.params.account.toHex() + '-' + community.id;
            let manager = ManagerEntity.load(managerId);
            if (!manager) {
                manager = new ManagerEntity(managerId);
            }
            manager.address = event.params.account;
            manager.community = community.id;
            manager.state = 0;
            manager.save();
            //
            const _managers = community.managers;
            _managers.push(manager.id);
            community.managers = _managers;
            community.totalManagers += 1;
            community.save();
        }
    }
}

export function handleManagerRemoved(event: ManagerRemoved): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const managerId = event.params.account.toHex() + '-' + community.id;
        const manager = ManagerEntity.load(managerId);
        if (manager) {
            manager.state = 1;
            manager.save();
            //
            community.totalManagers -= 1;
            community.save();
        }
    }
}

export function handleBeneficiaryAdded(event: BeneficiaryAdded): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params.beneficiary.toHex() + '-' + community.id;
        let beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (!beneficiary) {
            beneficiary = new BeneficiaryEntity(beneficiaryId);
        }
        beneficiary.address = event.params.beneficiary;
        beneficiary.community = community.id;
        beneficiary.state = 0;
        beneficiary.lastClaimAt = 0;
        beneficiary.preLastClaimAt = 0;
        beneficiary.save();
        //
        const _beneficiaries = community.beneficiaries;
        _beneficiaries.push(beneficiary.id);
        community.beneficiaries = _beneficiaries;
        community.totalBeneficiary += 1;
        community.save();
    }
}

export function handleBeneficiaryRemoved(event: BeneficiaryRemoved): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params.beneficiary.toHex() + '-' + community.id;
        const beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (beneficiary) {
            beneficiary.state = 1;
            beneficiary.save();
            //
            community.totalBeneficiary -= 1;
            community.save();
        }
    }
}

export function handleBeneficiaryClaim(event: BeneficiaryClaim): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params.beneficiary.toHex() + '-' + community.id;
        const beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (beneficiary) {
            let claim = ClaimEntity.load(event.transaction.hash.toHex());
            if (!claim) {
                claim = new ClaimEntity(event.transaction.hash.toHex());
            }
            claim.beneficiary = beneficiary.id;
            claim.community = community.id;
            claim.amount = event.params.amount;
            claim.timestamp = event.block.timestamp.toI32();
            claim.save();
            //
            beneficiary.preLastClaimAt = beneficiary.lastClaimAt;
            beneficiary.lastClaimAt = event.block.timestamp.toI32();
            //
            const _claims = community.claims;
            _claims.push(claim.id);
            community.claims = _claims;
            community.totalClaimed = community.totalClaimed.plus(
                event.params.amount
            );
            community.save();
        }
    }
}
