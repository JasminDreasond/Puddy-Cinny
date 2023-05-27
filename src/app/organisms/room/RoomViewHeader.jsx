import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


import { twemojify } from '../../../util/twemojify';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import { toggleRoomSettings, openReusableContextMenu } from '../../../client/action/navigation';
import { togglePeopleDrawer /* , startVoiceChat */ } from '../../../client/action/settings';
import colorMXID from '../../../util/colorMXID';
import { getEventCords } from '../../../util/common';

import { tabText } from './RoomSettings';
import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';
import IconButton from '../../atoms/button/IconButton';
import { Header } from '../../atoms/header/Header';
import Avatar from '../../atoms/avatar/Avatar';
import RoomOptions from '../../molecules/room-options/RoomOptions';

import { useForceUpdate } from '../../hooks/useForceUpdate';

function RoomViewHeader({ roomId }) {
  const [, forceUpdate] = useForceUpdate();
  const mx = initMatrix.matrixClient;
  const isDM = initMatrix.roomList.directs.has(roomId);
  const room = mx.getRoom(roomId);
  let avatarSrc = room.getAvatarUrl(mx.baseUrl, 36, 36, 'crop');
  avatarSrc = isDM ? room.getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl, 36, 36, 'crop') : avatarSrc;
  const roomName = room.name;

  useEffect(() => {
    const { roomList } = initMatrix;
    const handleProfileUpdate = (rId) => {
      if (roomId !== rId) return;
      forceUpdate();
    };

    roomList.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    };
  }, [roomId]);

  const openRoomOptions = (e) => {
    openReusableContextMenu(
      'bottom',
      getEventCords(e, '.ic-btn'),
      (closeMenu) => <RoomOptions roomId={roomId} afterOptionSelect={closeMenu} />,
    );
  };

  //       <IconButton className="room-header__drawer-btn" onClick={startVoiceChat} tooltip="Start VC" fa="fa-solid fa-phone" />

  return (
    <Header>

      <ul className='navbar-nav mr-auto mt-2 mt-lg-0 small'>

        <button
          className="nav-link btn btn-bg border-0"
          onClick={() => toggleRoomSettings()}
          type="button"
        >
          <Avatar className='m-0' imageSrc={avatarSrc} text={roomName} bgColor={colorMXID(roomId)} size="small" />
          {twemojify(roomName)}
          <RawIcon fa="fa-solid fa-chevron-down" />
        </button>

      </ul>

      <ul className='navbar-nav ms-auto mb-2 mb-lg-0 small'>

        {mx.isRoomEncrypted(roomId) === false && <IconButton className="nav-link btn btn-bg border-0" onClick={() => toggleRoomSettings(tabText.SEARCH)} tooltip="Search" fa="fa-solid fa-magnifying-glass" />}

        <IconButton className="nav-link border-0" onClick={togglePeopleDrawer} tooltip="People" fa="fa-solid fa-user" />
        <IconButton className="nav-link border-0" onClick={() => toggleRoomSettings(tabText.MEMBERS)} tooltip="Members" fa="fa-solid fa-users" />
        <IconButton
          className="nav-link border-0"
          onClick={openRoomOptions}
          tooltip="Options"
          fa="bi bi-three-dots-vertical"
        />

      </ul>

    </Header>
  );
}
RoomViewHeader.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default RoomViewHeader;
