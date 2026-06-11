import App from 'next/app'
import PropTypes from 'prop-types';
import { ThemeProvider } from '@codeday/topo/Theme';
import { QueryProvider } from '../providers/query';
import { RandomProvider } from '../providers/random';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AgGridProvider } from 'ag-grid-react';
import 'react-responsive-modal/styles.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../custom.css';

const agGridModules = [AllEnterpriseModule];

export default function CustomApp({ Component, pageProps: { query, random, ...pageProps } }) {
  return (
    <ThemeProvider analyticsId="LTQXJNQN" brandColor="red">
      <AgGridProvider modules={agGridModules} licenseKey={process.env.NEXT_PUBLIC_AG_GRID_LICENSE}>
        <QueryProvider value={query || {}}>
          <RandomProvider value={random || 0}>
            <Component {...pageProps} />
          </RandomProvider>
        </QueryProvider>
      </AgGridProvider>
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
