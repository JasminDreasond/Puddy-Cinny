import React from 'react';
import PropTypes from 'prop-types';

function Header({ children, title }) {
  return (
    <nav className="navbar navbar-expand navbar-nav p-0 w-100 d-block noselect border-bottom border-bg emoji-size-fix">
      <div className='container-fluid'>
        {(typeof title === 'string' && <span className="navbar-brand">{title}</span>)}
        <div className="navbar-collapse py-1 px-2" >
          {children}
        </div>
      </div>
    </nav>
  );
}

Header.defaultProps = {
  title: null,
};

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { Header };
