import ApplyIndexPage, { getStaticProps as superGetStaticProps } from './index';

export default ApplyIndexPage;

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(args) {
  const superProps = await superGetStaticProps(args);
  superProps.props.partnerCode = args.params.partnerCode.toUpperCase().replace(/[^A-Z\-]/g, '');
  return superProps;
}
