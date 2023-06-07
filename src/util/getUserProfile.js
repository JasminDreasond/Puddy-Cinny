/* eslint-disable no-console */

import initMatrix from "../client/initMatrix";

const mx = initMatrix.matrixClient;
const getStateEvent = (roomId, where, path) => new Promise((resolve) => {
    mx.getStateEvent(roomId, where, path).then(resolve).catch(err => {
        console.error(err);
        resolve({});
    });
});

export async function getUserProfile(content, profileRoom) {

    if (content && content.presenceStatusMsg && typeof content.presenceStatusMsg.roomId === 'string') {

        // Profile Room
        try {

            const roomTopic = await getStateEvent(content.presenceStatusMsg.roomId, 'm.room.topic');
            const bannerCfg = await getStateEvent(content.presenceStatusMsg.roomId, 'pony.house.settings', 'banner');

            let bannerSrc = '';
            let topic = '';

            if (bannerCfg && typeof bannerCfg?.url === 'string' && bannerCfg?.url.length > 0) {
                bannerSrc = mx.mxcUrlToHttp(bannerCfg.url);
            }

            if (roomTopic && typeof roomTopic?.topic === 'string' && roomTopic?.topic.length > 0) {
                topic = roomTopic?.topic;
            }

            return { banner: bannerSrc, topic };

        } catch (err) {
            console.error(err);
            return { banner: null, topic: null };
        }

    }

    return { banner: null, topic: null };

}