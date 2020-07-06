import { getStudent } from '../../../utils/airtable';

export { default } from './index';

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      student: await getStudent(id),
    },
  };
}
