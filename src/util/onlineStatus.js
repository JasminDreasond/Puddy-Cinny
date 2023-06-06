/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const statusList = {
    online: 'fa-solid fa-circle',
    offline: 'bi bi-record-circle-fill',
    bnb: 'fa-solid fa-circle-minus',
    afk: 'fa-solid fa-moon',
};

export function getPresence(user, canStatus = true, canPresence = true) {

    if (user) {

        const content = {};
        if (canPresence) content.presenceStatusMsg = null;

        if (canStatus) {
            content.presence = 'offline';
            content.lastActiveAgo = null;
            content.currentlyActive = false;
        }

        if (user.events && user.events.presence) {

            const data = user.events.presence?.getContent();

            if (canStatus && typeof data.presence === 'string' && (data.presence === 'online' || data.presence === 'offline' || data.presence === 'bnb' || data.presence === 'afk')) {
                content.presence = data.presence;
            }

            if (canPresence && typeof data.status_msg === 'string') {
                content.presenceStatusMsg = data.status_msg;
            }

            if (canStatus && typeof data.currently_active === 'boolean') {
                content.currentlyActive = data.currently_active;
            }

            if (canStatus && typeof data.last_active_ago === 'number') {
                content.lastActiveAgo = data.last_active_ago;
            }

        } else {

            if (canStatus && typeof user.presence === 'string') {
                content.presence = user.presence;
            }

            if (canPresence && typeof user.presenceStatusMsg === 'string') {
                content.presenceStatusMsg = user.presenceStatusMsg;
            }

            if (canStatus && typeof user.lastActiveAgo === 'number') {
                content.lastActiveAgo = user.lastActiveAgo;
                content.currentlyActive = true;
            }

        }

        if (canPresence && typeof content.presenceStatusMsg === 'string') {
            try {
                content.presenceStatusMsg = JSON.parse(content.presenceStatusMsg);
            } catch (err) {
                content.presenceStatusMsg = String(content.presenceStatusMsg);
            }
        }

        return content;

    }

    return null;

}

export function getUserStatus(user) {

    const data = getPresence(user);

    if (data) {

        let presence = data.presence;
        if (statusList[presence]) {
            presence += ` ${statusList[presence]}`;
        }

        return `user-presence-${presence}`;

    }

    return '';

}

export function updateUserStatusIcon(status, user) {

    for (const item in statusList) {
        status.classList.remove(`user-presence-${item}`);
        status.classList.remove(statusList[item]);
    }

    const newClasses = getUserStatus(user).split(' ');

    for (const item in newClasses) {
        status.classList.add(newClasses[item]);
    }

}