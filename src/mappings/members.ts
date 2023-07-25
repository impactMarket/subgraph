import { ImpactMarketCouncilMemberEntity } from '../../generated/schema';
import { MemberAdded, MemberRemoved } from '../../generated/ImpactMarketCouncil/ImpactMarketCouncil';

export function handleMemberAdded(event: MemberAdded): void {
    const id = `${event.params.member.toHex()}`;
    let member = ImpactMarketCouncilMemberEntity.load(id);

    if (!member) {
        member = new ImpactMarketCouncilMemberEntity(id);
    }
    member.since = event.block.timestamp.toI32();
    member.until = 0;
    member.status = 0;
    member.votes = 0;
    member.save();
}
export function handleMemberRemoved(event: MemberRemoved): void {
    const id = `${event.params.member.toHex()}`;
    const member = ImpactMarketCouncilMemberEntity.load(id);

    if (member) {
        member.until = event.block.timestamp.toI32();
        member.status = 1;
        member.save();
    }
}
