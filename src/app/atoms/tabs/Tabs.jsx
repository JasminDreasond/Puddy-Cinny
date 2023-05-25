import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../button/Button';

function TabItem({
  selected, iconSrc, faSrc,
  onClick, children, disabled,
}) {
  const isSelected = selected ? 'active' : '';

  return (
    <td className='p-0 border-0' style={{ minWidth: '150px' }}>
      <Button
        className={`btn-secondary py-2 rounded-0 rounded-top w-100 ${isSelected}`}
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
};

TabItem.propTypes = {
  selected: PropTypes.bool,
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
    <div class="table-responsive">
      <table className="table border-0 m-0">
        <tbody>
          <tr>
            {items.map((item, index) => (
              <TabItem
                key={item.text}
                selected={selectedItem.text === item.text}
                iconSrc={item.iconSrc}
                faSrc={item.faSrc}
                disabled={item.disabled}
                onClick={() => handleTabSelection(item, index)}
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
