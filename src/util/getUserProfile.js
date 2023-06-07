/* eslint-disable no-console */

import initMatrix from "../client/initMatrix";

export function getUserProfile(content, profileRoom) {

    const mx = initMatrix.matrixClient;
    if (content && content.presenceStatusMsg && typeof content.presenceStatusMsg.roomId === 'string') {

        // Profile Room
        try {

            let room;
            if (!profileRoom) {
                room = mx.getRoom(content.presenceStatusMsg.roomId);
            } else {
                room = profileRoom;
            }

            if (room && room.roomId) {

                const roomTopic = room.currentState.getStateEvents('m.room.topic')[0]?.getContent() ?? {};
                const bannerCfg = room.currentState.getStateEvents('pony.house.settings', 'banner')?.getContent() ?? {};

                let bannerSrc = '';
                let topic = '';

                if (bannerCfg && typeof bannerCfg?.url === 'string' && bannerCfg?.url.length > 0) {
                    bannerSrc = mx.mxcUrlToHttp(bannerCfg.url);
                }

                if (roomTopic && typeof roomTopic?.topic === 'string' && roomTopic?.topic.length > 0) {
                    topic = roomTopic?.topic;
                }

                return { banner: bannerSrc, topic };

            }

        } catch (err) {
            console.error(err);
            return { banner: null, topic: null };
        }

    }

    return { banner: null, topic: null };

}