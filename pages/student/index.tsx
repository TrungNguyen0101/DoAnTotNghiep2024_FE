import BaseLayout from '@/layouts/BaseLayout';
import { Container } from '@mui/material';
import { ReactElement } from 'react';

const Student = () => {
  return <Container sx={{ minHeight: '100vh' }}></Container>;
};

export default Student;

Student.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
