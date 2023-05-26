import React from 'react';
import PropTypes from 'prop-types';

function Header({ children }) {
  return (
    <div className="noselect">
      {children}
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

function TitleWrapper({ children }) {
  return children;
}

TitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Header as default, TitleWrapper };
