import React from 'react';

import SideBar from './SideBar';
import Drawer from './Drawer';

function Navigation() {
  return (
    <div className="sidebar">
      <div className='sidebar-1'><SideBar /></div>
      <div className='sidebar-2'><Drawer /></div>
    </div>
  );
}

export default Navigation;
