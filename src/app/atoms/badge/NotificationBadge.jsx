import React from 'react';
import PropTypes from 'prop-types';
import './NotificationBadge.scss';

function NotificationBadge({ alert, content, className }) {
  const notificationClass = alert ? ' notification-badge--alert' : '';
  const classes = ['badge', 'bg-light', 'notification-badge'];
  if (className) classes.push(className);
  return (
    <div className={`${classes.join(' ')}${notificationClass}`}>
      {content !== null && content}
    </div>
  );
}

NotificationBadge.defaultProps = {
  alert: false,
  content: null,
  className: null,
};

NotificationBadge.propTypes = {
  alert: PropTypes.bool,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default NotificationBadge;
