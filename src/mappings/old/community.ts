import {
    CommunityEntity,
    ManagerEntity,
    BeneficiaryEntity,
    ClaimEntity,
} from '../../../generated/schema';
import {
    BeneficiaryAdded as OldBeneficiaryAdded,
    BeneficiaryClaim as OldBeneficiaryClaim,
    BeneficiaryRemoved as OldBeneficiaryRemoved,
    ManagerAdded as OldManagerAdded,
    ManagerRemoved as OldManagerRemoved,
} from '../../../generated/templates/OldCommunity/OldCommunity';

export function handleOldManagerAdded(event: OldManagerAdded): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const managerId = event.params._account.toHex() + '-' + community.id;
        let manager = ManagerEntity.load(managerId);
        if (!manager) {
            manager = new ManagerEntity(managerId);
        }
        manager.address = event.params._account;
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

export function handleOldManagerRemoved(event: OldManagerRemoved): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const managerId = event.params._account.toHex() + '-' + community.id;
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

export function handleOldBeneficiaryAdded(event: OldBeneficiaryAdded): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params._account.toHex() + '-' + community.id;
        let beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (!beneficiary) {
            beneficiary = new BeneficiaryEntity(beneficiaryId);
        }
        beneficiary.address = event.params._account;
        beneficiary.community = community.id;
        beneficiary.state = 0;
        beneficiary.save();
        //
        const _beneficiaries = community.beneficiaries;
        _beneficiaries.push(beneficiary.id);
        community.beneficiaries = _beneficiaries;
        community.totalBeneficiary += 1;
        community.save();
    }
}

export function handleOldBeneficiaryRemoved(
    event: OldBeneficiaryRemoved
): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params._account.toHex() + '-' + community.id;
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

export function handleOldBeneficiaryClaim(event: OldBeneficiaryClaim): void {
    const community = CommunityEntity.load(event.address.toHex());
    if (community) {
        const beneficiaryId =
            event.params._account.toHex() + '-' + community.id;
        const beneficiary = BeneficiaryEntity.load(beneficiaryId);
        if (beneficiary) {
            let claim = ClaimEntity.load(event.transaction.hash.toHex());
            if (!claim) {
                claim = new ClaimEntity(event.transaction.hash.toHex());
            }
            claim.beneficiary = beneficiary.id;
            claim.community = community.id;
            claim.amount = event.params._amount;
            claim.timestamp = event.block.timestamp.toI32();
            claim.save();
            //
            const _claims = community.claims;
            _claims.push(claim.id);
            community.claims = _claims;
            community.totalClaimed = community.totalClaimed.plus(
                event.params._amount
            );
            community.save();
        }
    }
}
