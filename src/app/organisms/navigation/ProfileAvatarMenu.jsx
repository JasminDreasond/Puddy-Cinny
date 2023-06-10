import React, { useState, useEffect } from 'react';
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

    // Get Display
    const [profile, setProfile] = useState({
        avatarUrl: null,
        displayName: mx.getUser(mx.getUserId()).displayName,
    });

    useEffect(() => {

        // Get User and update data
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

            }
        };

        onProfileUpdate(mx.getAccountData('pony.house.profile')?.getContent() ?? {});
        const setNewProfile = (avatarUrl, displayName) => setProfile({
            avatarUrl: avatarUrl || null,
            displayName: displayName || profile.displayName,
        });

        const onAvatarChange = (event, myUser) => {
            setNewProfile(myUser.avatarUrl, myUser.displayName);
        };

        mx.getProfileInfo(mx.getUserId()).then((info) => {
            setNewProfile(info.avatar_url, info.displayname);
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
        <table className="table table-borderless align-middle m-0">
            <tbody>
                <tr>

                    <td className="sidebar-photo p-0">

                        <button className="btn btn-bg btn-link btn-sm ms-2" onClick={openSettings} type="button">
                            <Avatar
                                className='d-inline-block'
                                text={profile.displayName}
                                bgColor={colorMXID(mx.getUserId())}
                                size="normal"
                                imageSrc={profile.avatarUrl !== null ? mx.mxcUrlToHttp(profile.avatarUrl, 42, 42, 'crop') : null}
                            />
                            <span className="text-gray very-small text-uppercase ms-2" >{profile.displayName}</span>
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