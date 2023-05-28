import React, { useRef } from 'react';
import Picker from '@emoji-mart/react';
import initMatrix from '../../../client/initMatrix';

import { emojiGroups, emojis } from './emoji';
import { getRelevantPacks } from './custom-emoji';
import { addRecentEmoji, getRecentEmojis } from './recent';

// initMatrix.matrixClient.mxcUrlToHttp(emoji.mxc)

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

  /*
  hexcode: null
  mxc: "mxc://matrix.org/sICoLfcJSZCrxtlicYZsuJYJ"
  shortcodes: ['pudding']
  unicode: ":pudding:"
  */

  return <Picker set='twitter' onEmojiSelect={(emoji) => {

    // Prepare Code Data
    tinyCache.emoji = {
      hexcode: emoji.unified.toUpperCase(),
      mxc: null,
      unicode: emoji.native
    };

    if (Array.isArray(emoji.shortcodes)) {
      tinyCache.emoji.shortcodes = emoji.shortcodes;
    } else if (typeof emoji.shortcodes === 'string') {
      tinyCache.emoji.shortcodes = [emoji.shortcodes];
    }

    // Get Base
    tinyCache.main.ref = openerRef;
    const textarea = document.getElementById('message-textarea');

    // Insert Emoji
    insertAtCursor(textarea, emoji.native);

  }} />;

}

export default EmojiBoardOpener;
