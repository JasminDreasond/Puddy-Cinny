import React from 'react';
import PropTypes from 'prop-types';

import { MenuHeader, MenuItem } from '../../atoms/context-menu/ContextMenu';

function NotificationSelector({
  value, onSelect,
}) {
  return (
    <div>
      <MenuHeader>Notification</MenuHeader>
      <MenuItem faSrc={value === 'off' ? "fa-solid fa-check" : null} variant={value === 'off' ? 'positive' : 'surface'} onClick={() => onSelect('off')}>Off</MenuItem>
      <MenuItem faSrc={value === 'on' ? "fa-solid fa-check" : null} variant={value === 'on' ? 'positive' : 'surface'} onClick={() => onSelect('on')}>On</MenuItem>
      <MenuItem faSrc={value === 'noisy' ? "fa-solid fa-check" : null} variant={value === 'noisy' ? 'positive' : 'surface'} onClick={() => onSelect('noisy')}>Noisy</MenuItem>
    </div>
  );
}

NotificationSelector.propTypes = {
  value: PropTypes.oneOf(['off', 'on', 'noisy']).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default NotificationSelector;
