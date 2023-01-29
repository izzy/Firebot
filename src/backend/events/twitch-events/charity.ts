import eventManager from "../../events/EventManager";

export function triggerCharityCampaignStart(
    charityName: string,
    charityDescription: string,
    charityLogo: string,
    charityWebsite: string,
    currentTotalAmount: number,
    currentTotalCurrency: string,
    targetTotalAmount: number,
    targetTotalCurrency: string
) {
    eventManager.triggerEvent("twitch", "charity-campaign-start", {
        charityName: charityName,
        charityDescription: charityDescription,
        charityLogo: charityLogo,
        charityWebsite: charityWebsite,
        currentTotalAmount: currentTotalAmount,
        currentTotalCurrency: currentTotalCurrency,
        targetTotalAmount: targetTotalAmount,
        targetTotalCurrency: targetTotalCurrency
    });
};

export function triggerCharityDonation(
    username: string,
    charityName: string,
    charityDescription: string,
    charityLogo: string,
    charityWebsite: string,
    donationAmount: number,
    donationCurrency: string 
) {
    eventManager.triggerEvent("twitch", "charity-donation", {
        from: username,
        charityName: charityName,
        charityDescription: charityDescription,
        charityLogo: charityLogo,
        charityWebsite: charityWebsite,
        donationAmount: donationAmount,
        donationCurrency: donationCurrency
    });
};

export function triggerCharityCampaignProgress(
    charityName: string,
    charityDescription: string,
    charityLogo: string,
    charityWebsite: string,
    currentTotalAmount: number,
    currentTotalCurrency: string,
    targetTotalAmount: number,
    targetTotalCurrency: string
) {
    eventManager.triggerEvent("twitch", "charity-campaign-progress", {
        charityName: charityName,
        charityDescription: charityDescription,
        charityLogo: charityLogo,
        charityWebsite: charityWebsite,
        currentTotalAmount: currentTotalAmount,
        currentTotalCurrency: currentTotalCurrency,
        targetTotalAmount: targetTotalAmount,
        targetTotalCurrency: targetTotalCurrency
    });
};

export function triggerCharityCampaignEnd(
    charityName: string,
    charityDescription: string,
    charityLogo: string,
    charityWebsite: string,
    currentTotalAmount: number,
    currentTotalCurrency: string,
    targetTotalAmount: number,
    targetTotalCurrency: string
) {
    eventManager.triggerEvent("twitch", "charity-campaign-end", {
        charityName: charityName,
        charityDescription: charityDescription,
        charityLogo: charityLogo,
        charityWebsite: charityWebsite,
        currentTotalAmount: currentTotalAmount,
        currentTotalCurrency: currentTotalCurrency,
        targetTotalAmount: targetTotalAmount,
        targetTotalCurrency: targetTotalCurrency,
        goalReached: currentTotalAmount > targetTotalAmount
    });
};