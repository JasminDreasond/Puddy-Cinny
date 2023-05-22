import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RoomProfile.scss';

import { twemojify } from '../../../util/twemojify';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import colorMXID from '../../../util/colorMXID';

import RawIcon from '../../atoms/system-icons/RawIcon';
import Text from '../../atoms/text/Text';
import Avatar from '../../atoms/avatar/Avatar';
import Button from '../../atoms/button/Button';
import Input from '../../atoms/input/Input';
import IconButton from '../../atoms/button/IconButton';
import ImageUpload from '../image-upload/ImageUpload';

import { useStore } from '../../hooks/useStore';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { confirmDialog } from '../confirm-dialog/ConfirmDialog';

function RoomProfile({ roomId }) {

  // First Data
  const isMountStore = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [, forceUpdate] = useForceUpdate();
  const [status, setStatus] = useState({
    msg: null,
    type: cons.status.PRE_FLIGHT,
  });

  // First Values
  const mx = initMatrix.matrixClient;
  const isDM = initMatrix.roomList.directs.has(roomId);
  let avatarSrc = mx.getRoom(roomId).getAvatarUrl(mx.baseUrl, 36, 36, 'crop');
  avatarSrc = isDM ? mx.getRoom(roomId).getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl, 36, 36, 'crop') : avatarSrc;
  const room = mx.getRoom(roomId);
  const { currentState } = room;

  // Strings
  const roomName = room.name;
  const roomTopic = currentState.getStateEvents('m.room.topic')[0]?.getContent().topic;

  const nameCinny = {};
  if (room.nameCinny) {

    if (typeof room.nameCinny.original === 'string') {
      nameCinny.original = room.nameCinny.original;
    } else {
      nameCinny.original = '';
    }

    if (typeof room.nameCinny.category === 'string') {
      nameCinny.category = room.nameCinny.category;
    } else {
      nameCinny.category = '';
    }

    if (typeof room.nameCinny.index === 'number') {
      nameCinny.index = String(room.nameCinny.index);
    } else {
      nameCinny.index = '';
    }

  } else {
    nameCinny.original = '';
    nameCinny.category = '';
    nameCinny.index = '';
  }

  // User Id
  const userId = mx.getUserId();

  // Can?
  const canChangeAvatar = currentState.maySendStateEvent('m.room.avatar', userId);
  const canChangeName = currentState.maySendStateEvent('m.room.name', userId);
  const canChangeTopic = currentState.maySendStateEvent('m.room.topic', userId);

  // Use Effect
  useEffect(() => {
    isMountStore.setItem(true);
    const { roomList } = initMatrix;
    const handleProfileUpdate = (rId) => {
      if (roomId !== rId) return;
      forceUpdate();
    };

    roomList.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
      isMountStore.setItem(false);
      setStatus({
        msg: null,
        type: cons.status.PRE_FLIGHT,
      });
      setIsEditing(false);
    };
  }, [roomId]);

  // Submit
  const handleOnSubmit = async (e) => {

    // Prepare Values
    e.preventDefault();
    const { target } = e;
    const roomNameInput = target.elements['room-name'];
    const roomTopicInput = target.elements['room-topic'];
    const roomIndex = target.elements['room-index'];
    const roomCategory = target.elements['room-category'];

    // Try
    try {

      // Change Name
      if (canChangeName) {

        // New Name
        let newName = roomNameInput.value;

        // Save Name
        if (newName !== roomName && roomName.trim() !== '') {
          setStatus({
            msg: 'Saving room name...',
            type: cons.status.IN_FLIGHT,
          });
          await mx.setRoomName(roomId, newName);
        }

      }

      // Change Topic
      if (canChangeTopic) {

        // New Topic Name
        const newTopic = roomTopicInput.value;

        // Save
        if (newTopic !== roomTopic) {
          if (isMountStore.getItem()) {
            setStatus({
              msg: 'Saving room topic...',
              type: cons.status.IN_FLIGHT,
            });
          }
          await mx.setRoomTopic(roomId, newTopic);
        }

      }

      // Save Complete
      if (!isMountStore.getItem()) return;
      setStatus({
        msg: 'Saved successfully',
        type: cons.status.SUCCESS,
      });

    }

    // Error
    catch (err) {

      if (!isMountStore.getItem()) return;

      setStatus({
        msg: err.message || 'Unable to save.',
        type: cons.status.ERROR,
      });

    }
  };

  // Cancel Edit
  const handleCancelEditing = () => {
    setStatus({
      msg: null,
      type: cons.status.PRE_FLIGHT,
    });
    setIsEditing(false);
  };

  // Avatar Upload
  const handleAvatarUpload = async (url) => {
    if (url === null) {
      const isConfirmed = await confirmDialog(
        'Remove avatar',
        'Are you sure that you want to remove room avatar?',
        'Remove',
        'caution',
      );
      if (isConfirmed) {
        await mx.sendStateEvent(roomId, 'm.room.avatar', { url }, '');
      }
    } else await mx.sendStateEvent(roomId, 'm.room.avatar', { url }, '');
  };

  // Render Edit Data
  const renderEditNameAndTopic = () => (
    <form className="room-profile__edit-form" onSubmit={handleOnSubmit}>
      {canChangeName && <Input value={roomName} name="room-name" disabled={status.type === cons.status.IN_FLIGHT} label="Name" />}
      {canChangeName && <Input value={nameCinny.index} type="number" name="room-index" disabled={status.type === cons.status.IN_FLIGHT} label="Index" />}
      {canChangeName && <Input value={nameCinny.category} name="room-category" disabled={status.type === cons.status.IN_FLIGHT} label="Category" />}
      {canChangeTopic && <Input value={roomTopic} name="room-topic" disabled={status.type === cons.status.IN_FLIGHT} minHeight={100} resizable label="Topic" />}
      {(!canChangeName || !canChangeTopic) && <Text variant="b3">{`You have permission to change ${room.isSpaceRoom() ? 'space' : 'room'} ${canChangeName ? 'name' : 'topic'} only.`}</Text>}
      {status.type === cons.status.IN_FLIGHT && <Text variant="b2">{status.msg}</Text>}
      {status.type === cons.status.SUCCESS && <Text style={{ color: 'var(--tc-positive-high)' }} variant="b2">{status.msg}</Text>}
      {status.type === cons.status.ERROR && <Text style={{ color: 'var(--tc-danger-high)' }} variant="b2">{status.msg}</Text>}
      {status.type !== cons.status.IN_FLIGHT && (
        <div>
          <Button type="submit" variant="primary">Save</Button>
          <Button onClick={handleCancelEditing}>Cancel</Button>
        </div>
      )}
    </form>
  );

  // Render Panel
  const renderNameAndTopic = () => (
    <div className="room-profile__display" style={{ marginBottom: avatarSrc && canChangeAvatar ? '24px' : '0' }}>
      <div>
        <Text variant="h2" weight="medium" primary>{twemojify(roomName)}</Text>
        {(nameCinny.category.length > 0) && (
          <Text variant="h3" weight="small" primary>
            <span style={{ marginRight: '8px', marginLeft: '8px' }}><RawIcon fa="fa-solid fa-grip-lines-vertical" /></span>
            <span>{twemojify(nameCinny.category)}</span>
          </Text>
        )}
        {(canChangeName || canChangeTopic) && (
          <IconButton
            fa="fa-solid fa-pencil"
            size="extra-small"
            tooltip="Edit"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
      <Text variant="b3">{room.getCanonicalAlias() || room.roomId}</Text>
      {roomTopic && <Text variant="b2">{twemojify(roomTopic, undefined, true)}</Text>}
    </div>
  );

  // Complete
  return (
    <div className="room-profile">
      <div className="room-profile__content">
        {!canChangeAvatar && <Avatar imageSrc={avatarSrc} text={roomName} bgColor={colorMXID(roomId)} size="large" />}
        {canChangeAvatar && (
          <ImageUpload
            text={roomName}
            bgColor={colorMXID(roomId)}
            imageSrc={avatarSrc}
            onUpload={handleAvatarUpload}
            onRequestRemove={() => handleAvatarUpload(null)}
          />
        )}
        {!isEditing && renderNameAndTopic()}
        {isEditing && renderEditNameAndTopic()}
      </div>
    </div>
  );

}

RoomProfile.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default RoomProfile;
