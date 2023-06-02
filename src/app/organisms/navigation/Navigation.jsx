import React from 'react';

import SideBar from './SideBar';
import Drawer from './Drawer';

function Navigation() {
  return (
    <div className="sidebar">
      <div className='sidebar-1'><SideBar /></div>
      <div id="space-header" className='sidebar-2 border-end border-bg'><Drawer /></div>
    </div>
  );
}

export default Navigation;
