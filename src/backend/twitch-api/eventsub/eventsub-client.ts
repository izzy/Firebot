import logger from "../../logwrapper";
import accountAccess from "../../common/account-access";
import twitchEventsHandler from '../../events/twitch-events';
import twitchApi from "../api";
import frontendCommunicator from "../../common/frontend-communicator";

import { EventSubSubscription } from "@twurple/eventsub-base";
import { EventSubWsListener } from "@twurple/eventsub-ws";

let eventSubListener: EventSubWsListener;
let subscriptions: Array<EventSubSubscription> = [];

export async function createClient() {
    const streamer = accountAccess.getAccounts().streamer;

    await disconnectEventSub();

    logger.info("Connecting to Twitch EventSub...");

    try {
        eventSubListener = new EventSubWsListener({
            apiClient: twitchApi.getClient()
        });

        eventSubListener.start();

        // Stream online
        const onlineSubscription = eventSubListener.onStreamOnline(streamer.userId, (event) => {
            twitchEventsHandler.stream.triggerStreamOnline(
                event.broadcasterId,
                event.broadcasterName,
                event.broadcasterDisplayName
            );
        });
        subscriptions.push(onlineSubscription);

        // Stream offline
        const offlineSubscription = eventSubListener.onStreamOffline(streamer.userId, (event) => {
            twitchEventsHandler.stream.triggerStreamOffline(
                event.broadcasterId,
                event.broadcasterName,
                event.broadcasterDisplayName
            );
        });
        subscriptions.push(offlineSubscription);

        // Follows
        const followSubscription = eventSubListener.onChannelFollow(streamer.userId, (event) => {
            twitchEventsHandler.follow.triggerFollow(
                event.userId,
                event.userName,
                event.userDisplayName
            );
        });
        subscriptions.push(followSubscription);

        // First time subs
        // const subsSubscription = await eventSubListener.subscribeToChannelSubscriptionEvents(streamer.userId, (event) => {
            // if (event.isGift !== true) {
                // const subInfo = {
                    // subPlan: event.tier,
                    // userName: event.userName,
                    // userDisplayName: event.userDisplayName,
                    // isResub: false
                // };

                // twitchEventsHandler.sub.triggerSub(subInfo);
            // }
        // });
        // subscriptions.push(subsSubscription);

        // Gift subs
        // const giftSubsSubscription = await eventSubListener.subscribeToChannelSubscriptionGiftEvents(streamer.userId, (event) => {
            
        // });
        // subscriptions.push(giftSubsSubscription);

        // Subscriptions
        // const subsSubscription = await eventSubListener.subscribeToChannelSubscriptionMessageEvents(streamer.userId, (event) => {
        //     twitchEventsHandler.sub.triggerSub(
        //         event.userName,
        //         event.userDisplayName,
        //         event.tier,
        //         event.cumulativeMonths,
        //         event.messageText,
        //         event.streakMonths,
        //         false, // EventSub has no determination for Prime vs regular
        //         (event.cumulativeMonths ?? 1) > 1
        //     );
        // });
        // subscriptions.push(subsSubscription);

        // Cheers
        const bitsSubscription = eventSubListener.onChannelCheer(streamer.userId, async (event) => {
            const totalBits = (await twitchApi.bits.getChannelBitsLeaderboard(1, "all", new Date(), event.userId))[0]?.amount ?? 0;

            twitchEventsHandler.cheer.triggerCheer(
                event.userDisplayName ?? "An Anonymous Cheerer",
                event.isAnonymous,
                event.bits,
                totalBits,
                event.message ?? ""
            );
        });
        subscriptions.push(bitsSubscription);

        // Channel custom reward
        const customRewardRedemptionSubscription = eventSubListener.onChannelRedemptionAdd(streamer.userId, async (event) => {
            const reward = await twitchApi.channelRewards.getCustomChannelReward(event.rewardId);
            let imageUrl = "";

            if (reward && reward.defaultImage) {
                const images = reward.defaultImage;
                if (images.url4x) {
                    imageUrl = images.url4x;
                } else if (images.url2x) {
                    imageUrl = images.url2x;
                } else if (images.url1x) {
                    imageUrl = images.url1x;
                }
            }

            twitchEventsHandler.rewardRedemption.handleRewardRedemption(
                event.id,
                event.status,
                !reward.shouldRedemptionsSkipRequestQueue,
                event.input,
                event.userId,
                event.userName,
                event.userDisplayName,
                event.rewardId,
                event.rewardTitle,
                event.rewardPrompt,
                event.rewardCost,
                imageUrl
            );
        });
        subscriptions.push(customRewardRedemptionSubscription);

        // Raid
        const raidSubscription = eventSubListener.onChannelRaidTo(streamer.userId, (event) => {
            twitchEventsHandler.raid.triggerRaid(
                event.raidingBroadcasterDisplayName,
                event.viewers
            );
        });
        subscriptions.push(raidSubscription);

        // Hype Train start
        const hypeTrainBeginSubscription = eventSubListener.onChannelHypeTrainBegin(streamer.userId, (event) => {
            twitchEventsHandler.hypeTrain.triggerHypeTrainStart(
                event.total,
                event.progress,
                event.goal,
                event.level,
                event.startDate,
                event.expiryDate,
                event.lastContribution,
                event.topContributors
            );
        });
        subscriptions.push(hypeTrainBeginSubscription);

        // Hype Train progress
        const hypeTrainProgressSubscription = eventSubListener.onChannelHypeTrainProgress(streamer.userId, (event) => {
            twitchEventsHandler.hypeTrain.triggerHypeTrainProgress(
                event.total,
                event.progress,
                event.goal,
                event.level,
                event.startDate,
                event.expiryDate,
                event.lastContribution,
                event.topContributors
            );
        });
        subscriptions.push(hypeTrainProgressSubscription);

        // Hype Train end
        const hypeTrainEndSubscription = eventSubListener.onChannelHypeTrainEnd(streamer.userId, (event) => {
            twitchEventsHandler.hypeTrain.triggerHypeTrainEnd(
                event.total,
                event.level,
                event.startDate,
                event.endDate,
                event.cooldownEndDate,
                event.topContributors
            );
        });
        subscriptions.push(hypeTrainEndSubscription);

        // Channel goal begin
        const channelGoalBeginSubscription = eventSubListener.onChannelGoalBegin(streamer.userId, (event) => {
            twitchEventsHandler.goal.triggerChannelGoalBegin(
                event.description,
                event.type,
                event.startDate,
                event.currentAmount,
                event.targetAmount
            );
        });
        subscriptions.push(channelGoalBeginSubscription);

        // Channel goal progress
        const channelGoalProgressSubscription = eventSubListener.onChannelGoalProgress(streamer.userId, (event) => {
            twitchEventsHandler.goal.triggerChannelGoalProgress(
                event.description,
                event.type,
                event.startDate,
                event.currentAmount,
                event.targetAmount
            );
        });
        subscriptions.push(channelGoalProgressSubscription);

        // Channel goal end
        const channelGoalEndSubscription = eventSubListener.onChannelGoalEnd(streamer.userId, (event) => {
            twitchEventsHandler.goal.triggerChannelGoalEnd(
                event.description,
                event.type,
                event.startDate,
                event.endDate,
                event.currentAmount,
                event.targetAmount,
                event.isAchieved
            );
        });
        subscriptions.push(channelGoalEndSubscription);

        // Channel poll begin
        const pollBeginSubscription = eventSubListener.onChannelPollBegin(streamer.userId, (event) => {
            twitchEventsHandler.poll.triggerChannelPollBegin(
                event.title,
                event.choices,
                event.startDate,
                event.endDate,
                event.isChannelPointsVotingEnabled,
                event.channelPointsPerVote
            );
        });
        subscriptions.push(pollBeginSubscription);

        // Channel poll progress
        const pollProgressSubscription = eventSubListener.onChannelPollProgress(streamer.userId, (event) => {
            twitchEventsHandler.poll.triggerChannelPollProgress(
                event.title,
                event.choices,
                event.startDate,
                event.endDate,
                event.isChannelPointsVotingEnabled,
                event.channelPointsPerVote
            );
        });
        subscriptions.push(pollProgressSubscription);

        // Channel poll end
        const pollEndSubscription = eventSubListener.onChannelPollEnd(streamer.userId, (event) => {
            twitchEventsHandler.poll.triggerChannelPollEnd(
                event.title,
                event.choices,
                event.startDate,
                event.endDate,
                event.isChannelPointsVotingEnabled,
                event.channelPointsPerVote,
                event.status
            );
        });
        subscriptions.push(pollEndSubscription);

        // Channel prediction begin
        const predictionBeginSubscription = eventSubListener.onChannelPredictionBegin(streamer.userId, (event) => {
            twitchEventsHandler.prediction.triggerChannelPredictionBegin(
                event.title,
                event.outcomes,
                event.startDate,
                event.lockDate
            );
        });
        subscriptions.push(predictionBeginSubscription);

        // Channel prediction progress
        const predictionProgressSubscription = eventSubListener.onChannelPredictionProgress(streamer.userId, (event) => {
            twitchEventsHandler.prediction.triggerChannelPredictionProgress(
                event.title,
                event.outcomes,
                event.startDate,
                event.lockDate
            );
        });
        subscriptions.push(predictionProgressSubscription);

        // Channel prediction lock
        const predictionLockSubscription = eventSubListener.onChannelPredictionLock(streamer.userId, (event) => {
            twitchEventsHandler.prediction.triggerChannelPredictionLock(
                event.title,
                event.outcomes,
                event.startDate,
                event.lockDate
            );
        });
        subscriptions.push(predictionLockSubscription);

        // Channel prediction end
        const predictionEndSubscription = eventSubListener.onChannelPredictionEnd(streamer.userId, (event) => {
            twitchEventsHandler.prediction.triggerChannelPredictionEnd(
                event.title,
                event.outcomes,
                event.winningOutcome,
                event.startDate,
                event.endDate,
                event.status
            );
        });
        subscriptions.push(predictionEndSubscription);

        // Ban
        const banSubscription = eventSubListener.onChannelBan(streamer.userId, (event) => {
            if (event.endDate) {
                const timeoutDuration = (event.endDate.getTime() - event.startDate.getTime()) / 1000;
                twitchEventsHandler.viewerTimeout.triggerTimeout(
                    event.userDisplayName,
                    timeoutDuration,
                    event.moderatorName,
                    event.reason
                );
            } else {
                twitchEventsHandler.viewerBanned.triggerBanned(
                    event.userDisplayName,
                    event.moderatorName,
                    event.reason
                );
            }

            frontendCommunicator.send("twitch:chat:user:delete-messages", event.userName);
        });
        subscriptions.push(banSubscription);

        // Unban
        const unbanSubscription = eventSubListener.onChannelUnban(streamer.userId, (event) => {
            twitchEventsHandler.viewerBanned.triggerUnbanned(
                event.userName,
                event.moderatorName
            )
        });
        subscriptions.push(unbanSubscription);

        // Charity Campaign Start
        const charityCampaignStartSubscription = eventSubListener.onChannelCharityCampaignStart(streamer.userId, (event) => {
            twitchEventsHandler.charity.triggerCharityCampaignStart(
                event.charityName,
                event.charityDescription,
                event.charityLogo,
                event.charityWebsite,
                event.currentAmount.localizedValue,
                event.currentAmount.currency,
                event.targetAmount.localizedValue,
                event.targetAmount.currency
            );
        });
        subscriptions.push(charityCampaignStartSubscription);

        // Charity Donation
        const charityDonationSubscription = eventSubListener.onChannelCharityDonation(streamer.userId, (event) => {
            twitchEventsHandler.charity.triggerCharityDonation(
                event.donorDisplayName,
                event.charityName,
                event.charityDescription,
                event.charityLogo,
                event.charityWebsite,
                event.amount.localizedValue,
                event.amount.currency
            );
        });
        subscriptions.push(charityDonationSubscription);

        // Charity Campaign Progress
        const charityCampaignProgressSubscription = eventSubListener.onChannelCharityCampaignProgress(streamer.userId, (event) => {
            twitchEventsHandler.charity.triggerCharityCampaignProgress(
                event.charityName,
                event.charityDescription,
                event.charityLogo,
                event.charityWebsite,
                event.currentAmount.localizedValue,
                event.currentAmount.currency,
                event.targetAmount.localizedValue,
                event.targetAmount.currency
            );
        });
        subscriptions.push(charityCampaignProgressSubscription);

        // Charity Campaign End
        const charityCampaignEndSubscription = eventSubListener.onChannelCharityCampaignStop(streamer.userId, (event) => {
            twitchEventsHandler.charity.triggerCharityCampaignEnd(
                event.charityName,
                event.charityDescription,
                event.charityLogo,
                event.charityWebsite,
                event.currentAmount.localizedValue,
                event.currentAmount.currency,
                event.targetAmount.localizedValue,
                event.targetAmount.currency
            );
        });
        subscriptions.push(charityCampaignEndSubscription);
    } catch (error) {
        logger.error("Failed to connect to Twitch EventSub", error);
        return;
    }

    logger.info("Connected to the Twitch EventSub!");
};

export async function removeSubscriptions() {
    for (const subscription of subscriptions) {
        try {
            subscription.stop();   
        } catch (error) {
            logger.debug("Failed to remove EventSub subscription", error);
        }
    }
    subscriptions = [];
};

export async function disconnectEventSub() {
    await removeSubscriptions();
    try {
        if (eventSubListener) {
            eventSubListener.stop();
            logger.info("Disconnected from EventSub.");
        } 
    } catch (error) {
        logger.debug("Error disconnecting EventSub", error);
    }
};