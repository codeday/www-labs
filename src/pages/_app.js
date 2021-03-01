import App from 'next/app'
import PropTypes from 'prop-types';
import Theme from '@codeday/topo/Theme';
import { QueryProvider } from '../providers/query';
import { RandomProvider } from '../providers/random';
import 'react-responsive-modal/styles.css';

export default function CustomApp({ Component, pageProps: { query, random, ...pageProps } }) {
  return (
    <Theme analyticsId="LTQXJNQN" brandColor="red">
      <QueryProvider value={query || {}}>
        <RandomProvider value={random || 0}>
          <Component {...pageProps} />
        </RandomProvider>
      </QueryProvider>
    </Theme>
  );
}
CustomApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
  pageProps: {},
};
