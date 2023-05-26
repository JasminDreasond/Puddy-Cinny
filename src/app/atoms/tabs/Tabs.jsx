import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../button/Button';
import { selectButtonInverse } from '../../../util/checkTheme';

function TabItem({
  selected, iconSrc, faSrc,
  onClick, children, disabled, className
}) {
  const isSelected = selected ? 'active' : '';

  return (
    <td className='p-0 border-0' style={{ minWidth: '150px' }}>
      <Button
        className={`btn-${selectButtonInverse()} py-2 rounded-0 rounded-top w-100 ${isSelected} ${className}`}
        iconSrc={iconSrc}
        faSrc={faSrc}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </td>
  );
}

TabItem.defaultProps = {
  selected: false,
  iconSrc: null,
  faSrc: null,
  onClick: null,
  disabled: false,
  className: '',
};

TabItem.propTypes = {
  selected: PropTypes.bool,
  className: PropTypes.string,
  iconSrc: PropTypes.string,
  faSrc: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

function Tabs({ items, defaultSelected, onSelect }) {
  const [selectedItem, setSelectedItem] = useState(items[defaultSelected]);

  const handleTabSelection = (item, index) => {
    if (selectedItem === item) return;
    setSelectedItem(item);
    onSelect(item, index);
  };

  return (
    <div className="table-responsive hide-scrollbar">
      <table className="table border-0 m-0">
        <tbody>
          <tr>
            {items.map((item, index) => (
              <TabItem
                key={item.text}
                selected={selectedItem.text === item.text}
                iconSrc={item.iconSrc}
                faSrc={item.faSrc}
                className={item.className}
                onClick={typeof item.onClick !== 'function' ? () => handleTabSelection(item, index) : item.onClick}
                disabled={item.disabled}
              >
                {item.text}
              </TabItem>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

Tabs.defaultProps = {
  defaultSelected: 0,
};

Tabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      iconSrc: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  defaultSelected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

export default Tabs;
