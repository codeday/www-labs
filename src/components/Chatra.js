import React, { useEffect } from 'react';
import { useTheme } from '@codeday/topo/utils';
import Script from 'react-load-script';

export default () => {
  const { colors } = useTheme();

  useEffect(() => {
    if (typeof(window) === 'undefined') return;
    window.ChatraID = '5wsfeENwi3WqHrn3n';
    window.ChatraSetup = {
      colors: {
          buttonText: colors.white,
          buttonBg: colors.green[500],
      },
    };
  }, [typeof window, colors]);

  return <Script url={'https://www.srnd.org/chatra.js'} />;
}
