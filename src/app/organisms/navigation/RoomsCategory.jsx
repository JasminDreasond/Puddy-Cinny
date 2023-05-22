/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './RoomsCategory.scss';

import { updateName, sortName } from '../../../util/roomName';
import initMatrix from '../../../client/initMatrix';
import { selectSpace, selectRoom, openReusableContextMenu } from '../../../client/action/navigation';
import { getEventCords } from '../../../util/common';
import { getSpaceItem, setSpaceItem, removeSpaceItem } from '../../../util/selectedRoom';

import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';
import IconButton from '../../atoms/button/IconButton';
import Selector from './Selector';
import SpaceOptions from '../../molecules/space-options/SpaceOptions';
import { HomeSpaceOptions } from './DrawerHeader';

function setCategoryOpen({ roomName }) {

  let tinyIsOpen = getSpaceItem(`category_${roomName}`);
  tinyIsOpen = (tinyIsOpen === 'on');

  // Disable
  if (tinyIsOpen) {
    removeSpaceItem(`category_${roomName}`);
  }

  // Enable
  else {
    setSpaceItem(`category_${roomName}`, 'on');
  }

}

setCategoryOpen.defaultProps = {
  roomName: '',
};
setCategoryOpen.propTypes = {
  roomName: PropTypes.string,
};

function RoomsCategory({
  spaceId, name, hideHeader, roomIds, drawerPostie,
}) {

  // Prepare Code Base
  const mx = initMatrix.matrixClient;
  const { spaces, directs } = initMatrix.roomList;
  const [isOpen, setIsOpen] = useState(true);

  // Create Space Options
  const openSpaceOptions = (e) => {
    e.preventDefault();
    openReusableContextMenu(
      'bottom',
      getEventCords(e, '.header'),
      (closeMenu) => <SpaceOptions roomId={spaceId} afterOptionSelect={closeMenu} />,
    );
  };

  const openHomeSpaceOptions = (e) => {
    e.preventDefault();
    openReusableContextMenu(
      'right',
      getEventCords(e, '.ic-btn'),
      (closeMenu) => <HomeSpaceOptions spaceId={spaceId} afterOptionSelect={closeMenu} />,
    );
  };

  // Render Selector Funciton
  const renderSelector = (room) => {

    const roomId = room.roomId;
    const isSpace = spaces.has(roomId);
    const isDM = directs.has(roomId);

    const roomReady = true;

    return (
      <Selector
        roomReady={roomReady}
        key={roomId}
        roomId={roomId}
        roomObject={room}
        isDM={isDM}
        drawerPostie={drawerPostie}
        onClick={() => (isSpace ? selectSpace(roomId) : selectRoom(roomId))}
      />
    );

  };

  const renderData = (roomId) => {
    const room = mx.getRoom(roomId);
    updateName(room);
    return room;
  };

  // Prepare Rooms
  const roomData = roomIds.map(renderData);
  roomData.sort(sortName);
  const roomHTML = roomData.map(renderSelector);

  // Insert Rooms
  const roomCategory = [];
  const rooms = [];

  // Get Rooms
  for (const item in roomHTML) {

    // With Category
    if (roomData[item] && roomData[item].nameCinny && typeof roomData[item].nameCinny.category === 'string') {

      // Exist Category
      let tinyCategory = roomCategory.find(tinyCategory2 => tinyCategory2.name === roomData[item].nameCinny.category);
      if (!tinyCategory) {

        tinyCategory = {
          name: roomData[item].nameCinny.category,
          data: []
        };

        roomCategory.push(tinyCategory);

      }

      tinyCategory.data.push(roomHTML[item]);

    }

    // Nope
    else {
      rooms.push(roomHTML[item]);
    }

  }

  // Insert Categories
  for (const item in roomCategory) {

    const tinyRooms = [];

    for (const item2 in roomCategory[item].data) {
      tinyRooms.push(roomCategory[item].data[item2]);
    }

    const roomDivId = roomCategory[item].name.replace(/ /g, '');
    const roomIdB2 = `br_${roomDivId}`;

    let tinyIsOpen = getSpaceItem(`category_${roomDivId}`);
    if (typeof tinyIsOpen === 'string') {
      tinyIsOpen = (tinyIsOpen === 'on');
    } else {
      setSpaceItem(`category_${roomDivId}`, 'on');
      tinyIsOpen = true;
    }

    rooms.push((
      <div className="room-category__header" style={{ marginLeft: '15px' }}>
        <button className="room-category__toggle anti-click-below" onClick={() => { setCategoryOpen({ roomName: roomDivId }) }} type="button">
          <RawIcon fa={tinyIsOpen ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right"} size="extra-small" />
          <Text className="cat-header" variant="b3" weight="medium">{roomCategory[item].name}</Text>
        </button>
      </div>
    ));

    rooms.push(
      (tinyIsOpen) && (
        <div className="room-category__content" style={{ marginLeft: '15px' }} id={roomIdB2}>
          {tinyRooms}
        </div>
      )
    );

    rooms.push(
      (!tinyIsOpen) && (
        <div className="room-category__content" style={{ marginLeft: '15px', display: 'none' }} id={roomDivId}>
          {tinyRooms}
        </div>
      )
    );

  }

  // Complete
  return (
    <div className="room-category">
      {!hideHeader && (
        <div className="room-category__header">
          <button className="room-category__toggle" onClick={() => setIsOpen(!isOpen)} type="button">
            <RawIcon fa={isOpen ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right"} size="extra-small" />
            <Text className="cat-header" variant="b3" weight="medium">{name}</Text>
          </button>
          {spaceId && <IconButton onClick={openSpaceOptions} tooltip="Space options" fa="bi bi-three-dots" size="extra-small" />}
          {spaceId && <IconButton onClick={openHomeSpaceOptions} tooltip="Add rooms/spaces" fa="fa-solid fa-plus" size="extra-small" />}
        </div>
      )}
      {(isOpen || hideHeader) && (
        <div className="room-category__content">
          {rooms}
        </div>
      )}
    </div>
  );
}
RoomsCategory.defaultProps = {
  spaceId: null,
  hideHeader: false,
};
RoomsCategory.propTypes = {
  spaceId: PropTypes.string,
  name: PropTypes.string.isRequired,
  hideHeader: PropTypes.bool,
  roomIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  drawerPostie: PropTypes.shape({}).isRequired,
};

export default RoomsCategory;
