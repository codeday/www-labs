import React, { useEffect } from 'react';
import Script from 'react-load-script';

export default () => {
  return <Script
    url={'https://polarbear.codeday.org/tracker.js#cdn.usefathom.com'}
    attributes={{
      site: 'LTQXJNQN',
      spa: 'pushstate',
    }}
  />;
}
