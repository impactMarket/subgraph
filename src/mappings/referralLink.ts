import { Bytes } from '@graphprotocol/graph-ts';

import { CampaignAdded, RewardClaimed } from '../../generated/ReferralLink/ReferralLink';
import { ReferralCampaign, UserReferral } from '../../generated/schema';
import { normalize } from '../utils';

export function handleCampaignAdded(event: CampaignAdded): void {
    const campaignId = event.params.campaignId.toHex();
    const campaign = new ReferralCampaign(campaignId);

    campaign.startTime = event.params.startTime.toI32();
    campaign.endTime = event.params.endTime.toI32();
    campaign.rewardAmount = normalize(event.params.rewardAmount.toString());
    campaign.maxReferralLinks = event.params.maxReferralLinks.toI32();

    campaign.save();
}

export function handleRewardClaimed(event: RewardClaimed): void {
    const campaignId = event.params.campaignId.toHex();

    const userReferralId = `${campaignId}-${event.params.sender.toHex()}`;
    let userReferral = UserReferral.load(userReferralId);

    if (!userReferral) {
        userReferral = new UserReferral(userReferralId);
        userReferral.user = event.params.sender;
        userReferral.campaign = campaignId;
        userReferral.usedBy = new Array<Bytes>();
        userReferral.usages = 0;
    }

    const usedBy = userReferral.usedBy;

    usedBy.push(event.params.receiverAddress);
    userReferral.usedBy = usedBy;
    userReferral.usages += 1;

    userReferral.save();
}