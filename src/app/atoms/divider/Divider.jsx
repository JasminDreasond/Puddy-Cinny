import React from 'react';
import PropTypes from 'prop-types';
import './Divider.scss';

import Text from '../text/Text';

function Divider({ text, variant, align }) {
  const dividerClass = ` divider--${variant} divider--${align}`;
  return (
    <div className={`divider${dividerClass}`}>
      {text !== null && <Text className="divider__text" variant="b3" weight="bold">{text}</Text>}
    </div>
  );
}

Divider.defaultProps = {
  text: null,
  variant: 'link btn-bg',
  align: 'center',
};

Divider.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'link btn-bg']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

export default Divider;
