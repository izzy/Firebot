import NodeCache from "node-cache";
import { DateTime } from "luxon";
import { settings } from "../../common/settings-access";
import eventManager from "../../events/EventManager";
import logger from "../../logwrapper";

const communitySubCache = new NodeCache({ stdTTL: 10, checkperiod: 2 });

interface CommunityGiftSubRecipient {
    gifteeUsername: string,
    giftSubMonths: number
};

interface CommunityGiftSubCache {
    subCount: number,
    giftReceivers: CommunityGiftSubRecipient[]
};

export function triggerCommunitySubGift(
    gifterDisplayName: string,
    subPlan: string,
    subCount: number
): void {
    logger.debug(`Received ${subCount} community gift subs from ${gifterDisplayName} at ${DateTime.now().toFormat("HH:mm:ss:SSS")}`);
    communitySubCache.set<CommunityGiftSubCache>(`${gifterDisplayName}:${subPlan}`, {subCount, giftReceivers: []});
};

export function triggerSubGift(
    gifterDisplayName: string,
    isAnonymous: boolean,
    gifteeDisplayName: string,
    subPlan: string,
    giftDuration: number,
    giftSubMonths: number,
    streak: number
): void {
    if (settings.ignoreSubsequentSubEventsAfterCommunitySub()) {
        logger.debug(`Attempting to process community gift sub from ${gifterDisplayName} at ${DateTime.now().toFormat("HH:mm:ss:SSS")}`);
        const cacheKey = `${gifterDisplayName}:${subPlan}`;

        const cache = communitySubCache.get<CommunityGiftSubCache>(cacheKey);
        if (cache != null) {
            const communityCount = cache.subCount;
            const giftReceivers = cache.giftReceivers;

            if (communityCount != null) {
                if (communityCount > 0) {
                    const newCount = communityCount - 1;
                    giftReceivers.push({ gifteeUsername: gifteeDisplayName, giftSubMonths: streak});

                    if (newCount > 0) {
                        communitySubCache.set<CommunityGiftSubCache>(cacheKey, {subCount: newCount, giftReceivers: giftReceivers});
                    } else {
                        eventManager.triggerEvent("twitch", "community-subs-gifted", {
                            username: gifterDisplayName,
                            subCount: giftReceivers.length,
                            subPlan,
                            isAnonymous,
                            gifterUsername: gifterDisplayName,
                            giftReceivers: giftReceivers
                        });

                        logger.debug(`Community gift sub event triggered, deleting cache`);
                        communitySubCache.del(cacheKey);
                    }

                    return;
                }
            } else {
                logger.debug(`No community gift sub count found in cache`, cache);
            }
        } else {
            logger.debug(`No community gift sub data found in cache`);
        }
    }

    eventManager.triggerEvent("twitch", "subs-gifted", {
        username: gifterDisplayName,
        giftSubMonths,
        gifteeUsername: gifteeDisplayName,
        gifterUsername: gifterDisplayName,
        subPlan,
        isAnonymous,
        giftDuration
    });
    logger.debug(`Gift Sub event triggered`);
};

export function triggerSubGiftUpgrade(
    gifteeDisplayName: string,
    gifterDisplayName: string,
    subPlan: string
): void {
    eventManager.triggerEvent("twitch", "gift-sub-upgraded", {
        username: gifteeDisplayName,
        gifterUsername: gifterDisplayName,
        gifteeUsername: gifteeDisplayName,
        subPlan
    });
};