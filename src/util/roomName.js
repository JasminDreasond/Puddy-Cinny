
export function updateName(room) {

    // Separe Channel Name
    const name = room.name.split(' - ');
    if (name.length > 0) {

        // Index Channel
        const index = Number(name[0]);
        if (typeof index === 'number' && !Number.isNaN(index)) {

            name.shift();

            room.nameCinny = { original: room.name, index };
            room.name = name.join(' - ');

        }

    }

    return room;

}

export function sortName(a, b) {
    if (a.nameCinny && b.nameCinny) {
        return a.nameCinny.index - b.nameCinny.index;
    } else {

        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }
} 