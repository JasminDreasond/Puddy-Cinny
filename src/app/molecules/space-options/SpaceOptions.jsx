import React from 'react';
import PropTypes from 'prop-types';

import { twemojify } from '../../../util/twemojify';

import initMatrix from '../../../client/initMatrix';
import { openSpaceSettings, openSpaceManage, openInviteUser } from '../../../client/action/navigation';
import { markAsRead } from '../../../client/action/notifications';
import { leave } from '../../../client/action/room';
import {
  createSpaceShortcut,
  deleteSpaceShortcut,
  categorizeSpace,
  unCategorizeSpace,
} from '../../../client/action/accountData';

import { MenuHeader, MenuItem } from '../../atoms/context-menu/ContextMenu';

import HashSearchIC from '../../../../public/res/ic/outlined/hash-search.svg';

import { confirmDialog } from '../confirm-dialog/ConfirmDialog';

function SpaceOptions({ roomId, afterOptionSelect }) {
  const mx = initMatrix.matrixClient;
  const { roomList } = initMatrix;
  const room = mx.getRoom(roomId);
  const canInvite = room?.canInvite(mx.getUserId());
  const isPinned = initMatrix.accountData.spaceShortcut.has(roomId);
  const isCategorized = initMatrix.accountData.categorizedSpaces.has(roomId);

  const handleMarkAsRead = () => {
    const spaceChildren = roomList.getCategorizedSpaces([roomId]);
    spaceChildren?.forEach((childIds) => {
      childIds?.forEach((childId) => {
        markAsRead(childId);
      });
    });
    afterOptionSelect();
  };
  const handleInviteClick = () => {
    openInviteUser(roomId);
    afterOptionSelect();
  };
  const handlePinClick = () => {
    if (isPinned) deleteSpaceShortcut(roomId);
    else createSpaceShortcut(roomId);
    afterOptionSelect();
  };
  const handleCategorizeClick = () => {
    if (isCategorized) unCategorizeSpace(roomId);
    else categorizeSpace(roomId);
    afterOptionSelect();
  };
  const handleSettingsClick = () => {
    openSpaceSettings(roomId);
    afterOptionSelect();
  };
  const handleManageRoom = () => {
    openSpaceManage(roomId);
    afterOptionSelect();
  };

  const handleLeaveClick = async () => {
    afterOptionSelect();
    const isConfirmed = await confirmDialog(
      'Leave space',
      `Are you sure that you want to leave "${room.name}" space?`,
      'Leave',
      'danger',
    );
    if (!isConfirmed) return;
    leave(roomId);
  };

  return (
    <div style={{ maxWidth: 'calc(var(--navigation-drawer-width) - var(--sp-normal))' }}>
      <MenuHeader>{twemojify(`Options for ${initMatrix.matrixClient.getRoom(roomId)?.name}`)}</MenuHeader>
      <MenuItem faSrc="fa-solid fa-check-double" onClick={handleMarkAsRead}>Mark as read</MenuItem>
      <MenuItem
        onClick={handleCategorizeClick}
        faSrc={isCategorized ? "fa-solid fa-border-all" : "fa-solid fa-square"}
      >
        {isCategorized ? 'Uncategorize subspaces' : 'Categorize subspaces'}
      </MenuItem>
      <MenuItem
        onClick={handlePinClick}
        faSrc={isPinned ? "bi bi-pin-angle-fill" : "bi bi-pin-angle"}
      >
        {isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
      </MenuItem>
      <MenuItem
        faSrc="fa-solid fa-user-plus"
        onClick={handleInviteClick}
        disabled={!canInvite}
      >
        Invite
      </MenuItem>
      <MenuItem onClick={handleManageRoom} iconSrc={HashSearchIC}>Manage rooms</MenuItem>
      <MenuItem onClick={handleSettingsClick} faSrc="fa-solid fa-gear">Settings</MenuItem>
      <MenuItem
        variant="danger"
        onClick={handleLeaveClick}
        faSrc="fa-solid fa-arrow-right-from-bracket"
      >
        Leave
      </MenuItem>
    </div>
  );
}

SpaceOptions.defaultProps = {
  afterOptionSelect: null,
};

SpaceOptions.propTypes = {
  roomId: PropTypes.string.isRequired,
  afterOptionSelect: PropTypes.func,
};

export default SpaceOptions;
