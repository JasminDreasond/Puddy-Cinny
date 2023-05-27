import React, { useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import settings from '../../../client/state/settings';

import ContextMenu from '../../atoms/context-menu/ContextMenu';

import EmojiBoard from './EmojiBoard';

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
    console.log(emoji);
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

    // Native Emoji
    addEmoji(tinyData);

  }} />;

}

/*
    <ContextMenu
      content={(
        // 
        <EmojiBoard onSelect={addEmoji} searchRef={searchRef} />
      )}
      afterToggle={afterEmojiBoardToggle}
      render={(toggleMenu) => (
        <input
          ref={openerRef}
          onClick={toggleMenu}
          type="button"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 0,
            border: 'none',
            visibility: 'hidden',
          }}
        />
      )}
    />
*/

export default EmojiBoardOpener;
