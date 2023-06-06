import React from 'react';
import PropTypes from 'prop-types';
import './PeopleSelector.scss';

import { twemojify } from '../../../util/twemojify';

import { blurOnBubbling } from '../../atoms/button/script';

import Text from '../../atoms/text/Text';
import Avatar from '../../atoms/avatar/Avatar';
import { getUserStatus, updateUserStatusIcon } from '../../../util/onlineStatus';

function PeopleSelector({
  avatarSrc, name, color, peopleRole, onClick, user
}) {

  const statusRef = React.useRef(null);
  React.useEffect(() => {
    if (user) {

      // Update Status Profile
      const updateProfileStatus = (mEvent, tinyUser) => {
        if (statusRef && statusRef.current) {

          // Get Status
          const status = statusRef.current;

          // Update Status Icon
          updateUserStatusIcon(status, tinyUser);

        }
      };

      // Read Events
      user.on('User.currentlyActive', updateProfileStatus);
      user.on('User.lastPresenceTs', updateProfileStatus);
      user.on('User.presence', updateProfileStatus);
      return () => {
        user.removeListener('User.currentlyActive', updateProfileStatus);
        user.removeListener('User.lastPresenceTs', updateProfileStatus);
        user.removeListener('User.presence', updateProfileStatus);
      };

    }
  }, [user]);

  return (
    <button
      className="people-selector"
      onMouseUp={(e) => blurOnBubbling(e, '.people-selector')}
      onClick={onClick}
      type="button"
    >
      <Avatar imageSrc={avatarSrc} text={name} bgColor={color} size="extra-small" />
      <i ref={statusRef} className={user ? getUserStatus(user) : 'ms-1'} />
      <Text className="people-selector__name emoji-size-fix" variant="b1">
        {twemojify(name)}
      </Text>
      {peopleRole !== null && <Text className="people-selector__role" variant="b3">{peopleRole}</Text>}
    </button>
  );

}

PeopleSelector.defaultProps = {
  avatarSrc: null,
  peopleRole: null,
  user: null
};

PeopleSelector.propTypes = {
  user: PropTypes.node,
  avatarSrc: PropTypes.string,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  peopleRole: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default PeopleSelector;
