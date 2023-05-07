import React from 'react';
import './Welcome.scss';

import Text from '../../atoms/text/Text';


function Welcome() {
  return (
    <div className="app-welcome flex--center">
      <div>
        <img className="app-welcome__logo noselect" src="./public/favicon.ico" alt="Cinny logo" />
        <Text className="app-welcome__heading" variant="h1" weight="medium" primary>
          Welcome to Puddy Cinny
        </Text>
        <Text className="app-welcome__subheading" variant="s1">
          The tiny Puddy Club matrix client
        </Text>
      </div>
    </div>
  );
}

export default Welcome;
