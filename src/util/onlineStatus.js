/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const statusList = {
    online: 'fa-solid fa-circle',
    offline: 'bi bi-record-circle-fill',
    bnb: 'fa-solid fa-circle-minus',
    afk: 'fa-solid fa-moon',
};

export function getUserStatus(user) {

    let presence = 'offline';
    if (user && user.events && user.events.presence) {

        presence = user.events.presence?.getContent();
        if (typeof presence.presence === 'string' && (presence.presence === 'online' || presence.presence === 'offline' || presence.presence === 'bnb' || presence.presence === 'afk')) {
            presence = presence.presence;
        }

    }

    if (statusList[presence]) {
        presence += ` ${statusList[presence]}`;
    }

    return `user-presence-${presence}`;

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