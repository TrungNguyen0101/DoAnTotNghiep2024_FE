import SignIn from '@/components/SignIn';
import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement } from 'react';

const Login = () => {
  return <SignIn />;
};

export default Login;

Login.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
