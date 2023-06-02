export function getUserStatus(user) {

    let presence = 'offline';
    if (user && user.events && user.events.presence) {

        presence = user.events.presence?.getContent();
        if (typeof presence.presence === 'string' && (presence.presence === 'online' || presence.presence === 'offline' || presence.presence === 'bnb' || presence.presence === 'afk')) {
            presence = presence.presence;
        }

    }

    if (presence === 'online') {
        presence += ' fa-solid fa-circle';
    }

    else if (presence === 'offline') {
        presence += ' bi bi-record-circle-fill';
    }

    else if (presence === 'bnb') {
        presence += ' fa-solid fa-circle-minus';
    }

    else if (presence === 'afk') {
        presence += ' fa-solid fa-moon';
    }

    return `user-presence-${presence}`;

}