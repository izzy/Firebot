import eventManager from "../EventManager";

export function triggerBanned(
    userName: string,
    moderator: string,
    modReason: string
): void {
    eventManager.triggerEvent("twitch", "banned", {
        username: userName,
        moderator,
        modReason
    });
};

export function triggerUnbanned(
    userName: string,
    moderator: string
) {
    eventManager.triggerEvent("twitch", "unbanned", {
        username: userName,
        moderator: moderator
    });
};