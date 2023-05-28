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

  const myField = tinyField;

  // IE support
  if (document.selection) {
    tinyCache[where].type = 'ie';
    myField.focus();
    tinyCache[where].sel = document.selection.createRange();
    if (typeof myValue === 'string') tinyCache[where].sel.text = myValue;
  }

  // MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart === '0') {

    tinyCache[where].startPos = myField.selectionStart;
    tinyCache[where].endPos = myField.selectionEnd;

    if (typeof myValue === 'string') {
      myField.value = myField.value.substring(0, tinyCache[where].startPos)
        + myValue
        + myField.value.substring(tinyCache[where].endPos, myField.value.length);
    }

  } else if (typeof myValue === 'string') {
    myField.value += myValue;
  }

  // Complete
  return myField;

}

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
    textarea.focus();

    console.log(tinyCache);

  }} />;

}

export default EmojiBoardOpener;
