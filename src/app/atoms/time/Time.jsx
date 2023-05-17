import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import { isInSameDay } from '../../../util/common';

function Time({ timestamp, fullTime }) {
  const date = new Date(timestamp);

  const formattedFullTime = moment(date).format('DD MMMM YYYY, hh:MM A');
  let formattedDate = formattedFullTime;

  if (!fullTime) {
    const compareDate = new Date();
    const isToday = isInSameDay(date, compareDate);
    compareDate.setDate(compareDate.getDate() - 1);
    const isYesterday = isInSameDay(date, compareDate);

    formattedDate = moment(date).format(isToday || isYesterday ? 'hh:MM A' : 'DD/MM/YYYY');
    if (isYesterday) {
      formattedDate = `Yesterday, ${formattedDate}`;
    }
  }

  return (
    <time
      dateTime={date.toISOString()}
      title={formattedFullTime}
    >
      {formattedDate}
    </time>
  );
}

Time.defaultProps = {
  fullTime: false,
};

Time.propTypes = {
  timestamp: PropTypes.number.isRequired,
  fullTime: PropTypes.bool,
};

export default Time;
