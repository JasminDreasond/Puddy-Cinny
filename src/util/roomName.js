
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