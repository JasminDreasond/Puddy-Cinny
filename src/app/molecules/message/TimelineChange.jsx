import React from 'react';
import PropTypes from 'prop-types';

import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';
import Time from '../../atoms/time/Time';

function TimelineChange({
  variant, content, timestamp, onClick,
}) {
  let faSrc;

  switch (variant) {
    case 'join':
      faSrc = "fa-solid fa-arrow-right-to-bracket";
      break;
    case 'leave':
      faSrc = "fa-solid fa-arrow-right-from-bracket";
      break;
    case 'invite':
      faSrc = "fa-solid fa-user-plus";
      break;
    case 'invite-cancel':
      faSrc = "fa-solid fa-user-minus";
      break;
    case 'avatar':
      faSrc = "fa-solid fa-id-badge";
      break;
    default:
      faSrc = "fa-solid fa-arrow-right-to-bracket";
      break;
  }

  return (
    <button style={{ cursor: onClick === null ? 'default' : 'pointer' }} onClick={onClick} type="button" className="timeline-change emoji-size-fix">
      <div className="timeline-change__avatar-container">
        <RawIcon fa={faSrc} size="extra-small" />
      </div>
      <div className="timeline-change__content">
        <Text variant="b2">
          {content}
        </Text>
      </div>
      <div className="timeline-change__time">
        <div className="very-small text-gray">
          <Time timestamp={timestamp} />
        </div>
      </div>
    </button>
  );
}

TimelineChange.defaultProps = {
  variant: 'other',
  onClick: null,
};

TimelineChange.propTypes = {
  variant: PropTypes.oneOf([
    'join', 'leave', 'invite',
    'invite-cancel', 'avatar', 'other',
  ]),
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  timestamp: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

export default TimelineChange;
