import React from 'react';
import PropTypes from 'prop-types';

function Header({ children }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-nav navbar-dark p-0 w-100 d-block noselect border-bottom border-bg emoji-size-fix">
      {children}
    </nav>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Header };
