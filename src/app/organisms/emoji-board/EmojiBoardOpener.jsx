import React, { useRef } from 'react';
import Picker from '@emoji-mart/react';

import { selectButton } from '../../../util/checkTheme';
import initMatrix from '../../../client/initMatrix';
import { getRelevantPacks } from './custom-emoji';

const tinyCache = {
  main: {}
};

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

const getTextarea = () => {
  try {

    const textarea = document.getElementById('message-textarea');
    if (textarea) {

      textarea.addEventListener('change', () => {
        insertAtCursor(textarea);
      });

      textarea.addEventListener('keyup', () => {
        insertAtCursor(textarea);
      });

    } else {
      setTimeout(getTextarea, 100);
    }

  } catch (err) {
    setTimeout(getTextarea, 100);
  }
};

window.addEventListener('load', getTextarea, false);

function EmojiBoardOpener() {

  // Get Ref
  const openerRef = useRef(null);

  const customEmojis = [];
  const categoryIcons = {};
  const mx = initMatrix.matrixClient;
  const emojisPack = getRelevantPacks(mx);
  if (Array.isArray(emojisPack) && emojisPack.length > 0) {
    emojisPack.map(pack => {
      if (pack) {

        const whereRead = 'emoticons';

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
              keywords: [emoji.shortcode],
              skins: [{ src: mx.mxcUrlToHttp(emoji.mxc) }],
            });

            return emoji;

          });
        }

        customEmojis.push(tinyPack);

      }
      return pack;
    });
  }

  return <Picker

    theme={selectButton()}
    set='twitter'
    custom={customEmojis}
    categoryIcons={categoryIcons}
    locale='en'

    emojiSize={24}
    maxFrequentRows={4}
    perLine={9}

    onClickOutside={() => {

    }}

    onEmojiSelect={(emoji) => {

      // Prepare Code Data
      tinyCache.emoji = {};

      if (Array.isArray(emoji.shortcodes)) {
        tinyCache.emoji.shortcodes = emoji.shortcodes;
      } else if (typeof emoji.shortcodes === 'string') {
        tinyCache.emoji.shortcodes = [emoji.shortcodes];
      }

      // Get Base
      tinyCache.main.ref = openerRef;
      const textarea = document.getElementById('message-textarea');

      // Insert Emoji
      if (typeof emoji.src === 'string') {

        tinyCache.mxc = emoji.src;
        insertAtCursor(textarea, `:${emoji.id}:`);

      } else if (typeof emoji.native === 'string') {

        tinyCache.unicode = emoji.native;
        tinyCache.hexcode = emoji.unified.toUpperCase();

        insertAtCursor(textarea, emoji.native);

      }

    }}

  />;

}

export default EmojiBoardOpener;
