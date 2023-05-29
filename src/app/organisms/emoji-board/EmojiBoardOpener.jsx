import React, { useRef, useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';

import { selectButton } from '../../../util/checkTheme';
import initMatrix from '../../../client/initMatrix';
import { getRelevantPacks } from './custom-emoji';
import navigation from '../../../client/state/navigation';
import cons from '../../../client/state/cons';

// Cache
const tinyCache = {
  main: {},
  items: {
    custom: [],
    categoryIcons: {}
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

function EmojiListBuilder(whereRead = 'emoticons') {

  const customEmojis = [];
  const categoryIcons = {};
  const mx = initMatrix.matrixClient;
  const emojisPack = getRelevantPacks(mx);
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

  return {
    custom: customEmojis,
    categoryIcons
  };

}

const closeDetector = { normal: false, delay: false };
function EmojiBoardOpener() {
  const [isOpen, setIsOpen] = useState(false);
  closeDetector.delay = false;

  // Get Ref
  const openerRef = useRef(null);

  useEffect(() => {

    const openEmojiList = (cords, requestEmojiCallback) => {
      if (!closeDetector.normal && !closeDetector.delay) {

        const tinyItems = EmojiListBuilder();
        tinyCache.items.custom = tinyItems.custom;
        tinyCache.items.categoryIcons = tinyItems.categoryIcons;

        setIsOpen(true);
        closeDetector.normal = true;
        closeDetector.delay = true;
        setTimeout(() => { closeDetector.delay = false; }, 500);

      }
    };

    navigation.on(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiList);
    return () => {
      navigation.removeListener(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiList);
    };

  }, []);

  return (isOpen && (
    <Picker

      theme={selectButton()}
      set='twitter'
      custom={tinyCache.items.custom}
      categoryIcons={tinyCache.items.categoryIcons}
      locale='en'

      emojiSize={24}
      maxFrequentRows={4}
      perLine={9}

      onClickOutside={() => {
        if (closeDetector.normal && !closeDetector.delay) { closeDetector.normal = false; setIsOpen(false); }
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

    />
  ));

}

export default EmojiBoardOpener;
