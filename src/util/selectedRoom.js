let room;
export function setSelectRoom(body) {
    room = body;
};

export function getSelectRoom() {
    return room;
};

let space;
export function setSelectSpace(body) {
    space = body;
};

export function getSelectSpace() {
    return space;
};

export function getSpaceItem(name) {
    if (space && global.localStorage) {
        return global.localStorage.getItem(`${space.roomId}_${name}`);
    }
    return null;
};

export function setSpaceItem(name) {
    if (space && global.localStorage) {
        return global.localStorage.setItem(`${space.roomId}_${name}`);
    }
    return null;
};