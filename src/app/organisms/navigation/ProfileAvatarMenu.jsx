import React, { useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';

import { twemojify } from '../../../util/twemojify';
import navigation from '../../../client/state/navigation';
import Avatar from '../../atoms/avatar/Avatar';
import cons from '../../../client/state/cons';

import { colorMXID } from '../../../util/colorMXID';

import initMatrix from '../../../client/initMatrix';

import {
    openSettings,
} from '../../../client/action/navigation';

function ProfileAvatarMenu() {
    const mx = initMatrix.matrixClient;
    const user = mx.getUser(mx.getUserId());
    const customStatusRef = useRef(null);

    // Get Display
    const [profile, setProfile] = useState({
        userId: user.userId,
        avatarUrl: null,
        displayName: user.displayName,
    });

    useEffect(() => {

        // Get User and update data
        // eslint-disable-next-line no-shadow
        const user = mx.getUser(mx.getUserId());

        // Set New User Status
        const onProfileUpdate = (event = {}) => {
            if (event) {

                const tinyEvent = event;
                const eventJSON = JSON.stringify(tinyEvent);

                if (eventJSON.length > 0 && (typeof user.presenceStatusMsg !== 'string' || user.presenceStatusMsg !== eventJSON)) {

                    let presenceStatus = 'online';
                    if (typeof tinyEvent.status === 'string') {
                        tinyEvent.status = tinyEvent.status.trim();
                        if (tinyEvent.status === '🔘') presenceStatus = 'offline';
                    }

                    mx.setPresence({
                        presence: presenceStatus,
                        status_msg: eventJSON,
                    });

                }

                if (customStatusRef && customStatusRef.current && typeof event.msg === 'string' && event.msg.length > 0) {
                    customStatusRef.current.innerHTML = ReactDOMServer.renderToStaticMarkup(twemojify(event.msg.substring(0, 100)))
                }

            }
        };

        onProfileUpdate(mx.getAccountData('pony.house.profile')?.getContent() ?? {});
        const setNewProfile = (avatarUrl, displayName, userId) => setProfile({
            avatarUrl: avatarUrl || null,
            displayName: displayName || profile.displayName,
            userId: userId || profile.userId
        });

        const onAvatarChange = (event, myUser) => {
            setNewProfile(myUser.avatarUrl, myUser.displayName, myUser.userId);
        };

        mx.getProfileInfo(mx.getUserId()).then((info) => {
            setNewProfile(info.avatar_url, info.displayname, info.userId);
        });

        // Socket
        user.on('User.avatarUrl', onAvatarChange);
        navigation.on(cons.events.navigation.PROFILE_UPDATED, onProfileUpdate);
        return () => {
            user.removeListener('User.avatarUrl', onAvatarChange);
            navigation.removeListener(
                cons.events.navigation.PROFILE_UPDATED,
                onProfileUpdate,
            );
        };

    }, []);

    // Complete
    return (
        <table className="table table-borderless align-middle m-0" id='user-menu'>
            <tbody>
                <tr>

                    <td className="sidebar-photo p-0">

                        <button className="btn btn-bg btn-link btn-sm ms-2 text-truncate text-start " onClick={openSettings} type="button">
                            <Avatar
                                className='d-inline-block float-start'
                                text={profile.displayName}
                                bgColor={colorMXID(mx.getUserId())}
                                size="normal"
                                imageSrc={profile.avatarUrl !== null ? mx.mxcUrlToHttp(profile.avatarUrl, 42, 42, 'crop') : null}
                            />
                            <div className="very-small ps-2 text-truncate emoji-size-fix-2" id='display-name' >{profile.displayName}</div>
                            <div ref={customStatusRef} className="very-small ps-2 text-truncate emoji-size-fix-2" id='user-presence' >{profile.userId}</div>
                            <div className="very-small ps-2 text-truncate emoji-size-fix-2" id='user-id' >{profile.userId}</div>
                        </button>


                    </td>

                    <td className="p-0 pe-3 py-1">

                    </td>
                </tr>



            </tbody>
        </table>
    );

}

export default ProfileAvatarMenu;