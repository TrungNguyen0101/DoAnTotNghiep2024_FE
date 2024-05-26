import SignUp from '@/components/SignUp';
import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement } from 'react';

const RegisterRules = () => {
  return <SignUp />;
};

export default RegisterRules;
RegisterRules.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
