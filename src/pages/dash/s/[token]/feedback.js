export { getServerSidePropsLimited as getServerSideProps } from '../../p/[token]/index';

import Page from '../../p/[token]/index';
export default (props) => Page({ hidePartner: true, ...props });
