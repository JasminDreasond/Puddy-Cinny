import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './RoomsCategory.scss';

import { updateName } from '../../../util/roomName';
import initMatrix from '../../../client/initMatrix';
import { selectSpace, selectRoom, openReusableContextMenu } from '../../../client/action/navigation';
import { getEventCords } from '../../../util/common';

import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';
import IconButton from '../../atoms/button/IconButton';
import Selector from './Selector';
import SpaceOptions from '../../molecules/space-options/SpaceOptions';
import { HomeSpaceOptions } from './DrawerHeader';

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
  const renderSelector = (roomId) => {

    const isSpace = spaces.has(roomId);
    const isDM = directs.has(roomId);

    const roomReady = true;
    const room = mx.getRoom(roomId);
    updateName(room);

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

  // Prepare Rooms
  const rooms = roomIds.map(renderSelector);

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
