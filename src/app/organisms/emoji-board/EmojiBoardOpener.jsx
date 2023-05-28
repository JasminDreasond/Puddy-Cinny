import React, { useRef } from 'react';
import Picker from '@emoji-mart/react';

function insertAtCursor(tinyField, myValue) {

  const myField = tinyField;

  // IE support
  if (document.selection) {
    myField.focus();
    const sel = document.selection.createRange();
    sel.text = myValue;
  }
  // MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart === '0') {
    const startPos = myField.selectionStart;
    const endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
  } else {
    myField.value += myValue;
  }

  return myField;

}

function EmojiBoardOpener() {

  const openerRef = useRef(null);

  /*
  hexcode: null
  mxc: "mxc://matrix.org/sICoLfcJSZCrxtlicYZsuJYJ"
  shortcodes: ['pudding']
  unicode: ":pudding:"
  */

  return <Picker set='twitter' onEmojiSelect={(emoji) => {

    const tinyData = {
      hexcode: emoji.unified.toUpperCase(),
      mxc: null,
      unicode: emoji.native
    };

    if (Array.isArray(emoji.shortcodes)) {
      tinyData.shortcodes = emoji.shortcodes;
    } else if (typeof emoji.shortcodes === 'string') {
      tinyData.shortcodes = [emoji.shortcodes];
    }

    // Insert Emoji
    const textarea = document.getElementById('message-textarea');
    insertAtCursor(textarea, emoji.native);
    textarea.focus();

  }} />;

}

export default EmojiBoardOpener;
