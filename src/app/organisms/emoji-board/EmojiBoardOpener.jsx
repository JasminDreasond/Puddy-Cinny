import React, { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';

import { selectButton } from '../../../util/checkTheme';
import initMatrix from '../../../client/initMatrix';
import { getRelevantPacks } from './custom-emoji';
import navigation from '../../../client/state/navigation';
import cons from '../../../client/state/cons';

// Selected Room Cache
let roomEmojis = null;
const updateAvailableEmoji = (selectedRoomId) => {
  roomEmojis = selectedRoomId;
};

// Cache Items
const tinyCache = {

  main: {},

  items: {
    custom: [],
    categoryIcons: {}
  },

  categories: {
    items: [],
    default: []
  },

  config: {

    locale: 'en',
    skinTonePosition: 'preview',

    emojiButtonSize: 36,

    emojiSize: 24,
    maxFrequentRows: 4,
    perLine: 9

  }

};

// Insert Emoji Editor
function insertAtCursor(tinyField, myValue, where = 'main') {

  const finishJob = () => {
    tinyField.focus();
    tinyField.setSelectionRange(tinyCache[where].startPos + myValue.length, tinyCache[where].endPos + myValue.length)
  };

  const myField = tinyField;
  if (myField.selectionStart || myField.selectionStart === '0') {

    tinyCache[where].startPos = myField.selectionStart;
    tinyCache[where].endPos = myField.selectionEnd;

    if (typeof myValue === 'string') {

      myField.value = myField.value.substring(0, tinyCache[where].startPos)
        + myValue
        + myField.value.substring(tinyCache[where].endPos, myField.value.length);

      finishJob();

    }

  } else if (typeof myValue === 'string') {
    myField.value += myValue;
    finishJob();
  }

  // Complete
  return myField;

}

// Get Textarea
const GetTextarea = (textarea) => {
  try {

    if (textarea) {
      if (tinyCache.textarea !== textarea) {

        textarea.addEventListener('change', () => {
          insertAtCursor(textarea);
        });

        textarea.addEventListener('focus', () => {
          insertAtCursor(textarea);
        });

        textarea.addEventListener('keyup', () => {
          insertAtCursor(textarea);
        });

        tinyCache.textarea = textarea;

      }
    } else {
      setTimeout(() => GetTextarea(textarea), 100);
    }

  } catch (err) {
    setTimeout(() => GetTextarea(textarea), 100);
  }
};

window.addEventListener('load', () => {
  GetTextarea(document.getElementById('message-textarea'));
}, false);

// Emoji List Builder
function EmojiListBuilder(whereRead, whereGet, emojiSize, perLine, emojiButtonSize, previewPosition = 'bottom', defaultList = [
  'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'
]) {

  // Reset Category List
  tinyCache.categories.items = ['frequent'];

  // First Values
  const customEmojis = [];
  const categoryIcons = {};
  const mx = initMatrix.matrixClient;

  if (typeof previewPosition === 'string') tinyCache.config.previewPosition = previewPosition;
  if (typeof emojiButtonSize === 'number') tinyCache.config.emojiButtonSize = emojiButtonSize;
  if (typeof emojiSize === 'number') tinyCache.config.emojiSize = emojiSize;
  if (typeof perLine === 'number') tinyCache.config.perLine = perLine;

  if (whereRead !== 'stickers') {
    tinyCache.config.skinTonePosition = 'preview';
  } else {
    tinyCache.config.skinTonePosition = 'none';
  }

  if (Array.isArray(defaultList)) tinyCache.categories.default = defaultList;

  const room = mx.getRoom(roomEmojis);
  const parentIds = initMatrix.roomList.getAllParentSpaces(room.roomId);
  const parentRooms = [...parentIds].map((id) => mx.getRoom(id));
  if (room) {

    const emojisPack = getRelevantPacks(room.client, [room, ...parentRooms]).filter(
      (pack) => pack[whereGet]().length !== 0
    );

    // Set an index for each pack so that we know where to jump when the user uses the nav
    for (let i = 0; i < emojisPack.length; i += 1) {
      emojisPack[i].packIndex = i;
    }

    // Get Data
    if (Array.isArray(emojisPack) && emojisPack.length > 0) {
      emojisPack.map(pack => {
        if (pack) {

          categoryIcons[pack.id] = {
            src: mx.mxcUrlToHttp(pack.avatarUrl),
          };

          const tinyPack = {
            id: pack.id,
            name: pack.displayName,
            emojis: [],
          };

          if (Array.isArray(pack[whereRead]) && pack[whereRead].length > 0) {
            pack[whereRead].map(emoji => {

              tinyPack.emojis.push({
                id: emoji.shortcode,
                name: emoji.body,
                keywords: [emoji.shortcode, emoji.mxc],
                skins: [{ src: mx.mxcUrlToHttp(emoji.mxc) }],
              });

              return emoji;

            });
          }

          tinyCache.categories.items.push(pack.id);
          customEmojis.push(tinyPack);

        }
        return pack;
      });
    } else {
      tinyCache.items.custom = [];
      tinyCache.items.categoryIcons = {};
    }

  } else {
    tinyCache.items.custom = [];
    tinyCache.items.categoryIcons = {};
  }

  for (const item in tinyCache.categories.default) {
    tinyCache.categories.items.push(tinyCache.categories.default[item]);
  }

  // Send Result
  return {
    custom: customEmojis,
    categoryIcons
  };

}

// Request Action
let requestEmoji = null;
const closeDetector = { normal: false, delay: false };

// Open Emoji List
function EmojiBoardOpener() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {

    // Update Emoji list on open
    const openEmojiList = (cords, requestEmojiCallback, dom) => {
      if (!closeDetector.normal && !closeDetector.delay) {

        // Get Items
        let tinyItems;
        if (dom === 'emoji') {
          tinyItems = EmojiListBuilder('emoticons', 'getEmojis', 24, 9, 36);
        } else if (dom === 'sticker') {
          tinyItems = EmojiListBuilder('stickers', 'getStickers', 64, 4, 76, 'none', []);
        }

        tinyCache.items.custom = tinyItems.custom;
        tinyCache.items.categoryIcons = tinyItems.categoryIcons;

        // Set is Open
        setIsOpen(true);
        closeDetector.normal = true;
        closeDetector.delay = true;
        requestEmoji = requestEmojiCallback;

        // Anti Issues
        setTimeout(() => { closeDetector.delay = false; }, 1000);

        // Update Position
        setTimeout(() => {
          const tinyDom = document.getElementsByTagName('em-emoji-picker');
          if (tinyDom && tinyDom[0]) {

            const emojiPicker = tinyDom[0];

            emojiPicker.classList.remove('emoji');
            emojiPicker.classList.remove('stickers');
            if (typeof dom === 'string') emojiPicker.classList.add(dom);

            emojiPicker.classList.add('show-emoji-list');

            emojiPicker.style.top = `${cords.y}px`;
            emojiPicker.style.left = `${cords.x}px`;

          }
        }, 100);

      }
    };

    // Sockets Update
    navigation.on(cons.events.navigation.ROOM_SELECTED, updateAvailableEmoji);
    navigation.on(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiList);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SELECTED, updateAvailableEmoji);
      navigation.removeListener(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiList);
    };

  }, []);

  // Close Board
  const closeEmojiBoard = () => {
    if (closeDetector.normal && !closeDetector.delay) { closeDetector.normal = false; requestEmoji = null; setIsOpen(false); }
  };

  // Insert Data
  const insertEmoji = (emoji) => {

    // Prepare Code Data
    tinyCache.emoji = {};

    if (Array.isArray(emoji.shortcodes)) {
      tinyCache.emoji.shortcodes = emoji.shortcodes;
    } else if (typeof emoji.shortcodes === 'string') {
      tinyCache.emoji.shortcodes = [emoji.shortcodes];
    }

    // Get Base
    // const textarea = document.getElementById('message-textarea');

    // Insert Emoji
    if (typeof emoji.src === 'string') {

      tinyCache.emoji.mxc = emoji.keywords['1'];
      tinyCache.emoji.unicode = `:${emoji.id}:`;
      tinyCache.emoji.hexcode = null;

      if (typeof requestEmoji === 'function') { requestEmoji(tinyCache.emoji); }
      // insertAtCursor(textarea, `:${emoji.id}:`);
      closeEmojiBoard();

    } else if (typeof emoji.native === 'string') {

      tinyCache.emoji.mxc = null;
      tinyCache.emoji.unicode = emoji.native;
      tinyCache.emoji.hexcode = emoji.unified.toUpperCase();

      if (typeof requestEmoji === 'function') { requestEmoji(tinyCache.emoji); }
      // insertAtCursor(textarea, emoji.native);
      closeEmojiBoard();

    }

  };

  // HTML
  return (isOpen && (
    <Picker

      theme={selectButton()}
      set='twitter'

      custom={tinyCache.items.custom}
      categoryIcons={tinyCache.items.categoryIcons}
      categories={tinyCache.categories.items}
      locale={tinyCache.config.locale}

      skinTonePosition={tinyCache.config.skinTonePosition}
      previewPosition={tinyCache.config.previewPosition}
      emojiButtonSize={tinyCache.config.emojiButtonSize}
      emojiSize={tinyCache.config.emojiSize}
      maxFrequentRows={tinyCache.config.maxFrequentRows}
      perLine={tinyCache.config.perLine}

      onClickOutside={closeEmojiBoard}
      onEmojiSelect={insertEmoji}

    />
  ));

}

// Export
export default EmojiBoardOpener;
