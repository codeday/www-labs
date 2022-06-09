import App from 'next/app'
import PropTypes from 'prop-types';
import { ThemeProvider } from '@codeday/topo/Theme';
import { QueryProvider } from '../providers/query';
import { RandomProvider } from '../providers/random';
import 'react-responsive-modal/styles.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export default function CustomApp({ Component, pageProps: { query, random, ...pageProps } }) {
  return (
    <ThemeProvider analyticsId="LTQXJNQN" brandColor="red">
      <QueryProvider value={query || {}}>
        <RandomProvider value={random || 0}>
          <Component {...pageProps} />
        </RandomProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
CustomApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
CustomApp.defaultProps = {
  pageProps: {},
};
