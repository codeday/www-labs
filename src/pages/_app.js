import App from 'next/app'
import PropTypes from 'prop-types';
import { ThemeProvider } from '@codeday/topo/Theme';
import { QueryProvider } from '../providers/query';
import { RandomProvider } from '../providers/random';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';
import { AgGridProvider } from 'ag-grid-react';
import 'react-responsive-modal/styles.css';
import '../custom.css';

const agGridModules = [AllEnterpriseModule];

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_AG_GRID_LICENSE) {
  LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE);
}

export default function CustomApp({ Component, pageProps: { query, random, ...pageProps } }) {
  return (
    <ThemeProvider analyticsId="LTQXJNQN" brandColor="red">
      <AgGridProvider modules={agGridModules}>
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
