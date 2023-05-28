import React, { useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import settings from '../../../client/state/settings';
import EmojiBoard from './EmojiBoard';

function insertAtCursor(tinyField, myValue) {

  const myField = tinyField;

  // IE support
  if (document.selection) {
    myField.focus();
    let sel = document.selection.createRange();
    sel.text = myValue;
  }
  // MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart == '0') {
    let startPos = myField.selectionStart;
    let endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
  } else {
    myField.value += myValue;
  }

  return myField;

}

let requestCallback = null;
let isEmojiBoardVisible = false;
function EmojiBoardOpener() {
  const openerRef = useRef(null);
  const searchRef = useRef(null);

  function openEmojiBoard(cords, requestEmojiCallback) {
    if (requestCallback !== null || isEmojiBoardVisible) {
      requestCallback = null;
      if (cords.detail === 0) openerRef.current.click();
      return;
    }

    openerRef.current.style.transform = `translate(${cords.x}px, ${cords.y}px)`;
    requestCallback = requestEmojiCallback;
    openerRef.current.click();
  }

  function afterEmojiBoardToggle(isVisible) {
    isEmojiBoardVisible = isVisible;
    if (isVisible) {
      if (!settings.isTouchScreenDevice) searchRef.current.focus();
    } else {
      setTimeout(() => {
        if (!isEmojiBoardVisible) requestCallback = null;
      }, 500);
    }
  }

  function addEmoji(emoji) {
    /*
hexcode: null
mxc: "mxc://matrix.org/sICoLfcJSZCrxtlicYZsuJYJ"
shortcodes: ['pudding']
unicode: ":pudding:"
    */
    requestCallback(emoji);
  }

  useEffect(() => {
    navigation.on(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiBoard);
    return () => {
      navigation.removeListener(cons.events.navigation.EMOJIBOARD_OPENED, openEmojiBoard);
    };
  }, []);

  return <Picker data={data} onEmojiSelect={(emoji) => {

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
    insertAtCursor(document.getElementById('message-textarea'), emoji.native);

  }} />;

}

export default EmojiBoardOpener;
