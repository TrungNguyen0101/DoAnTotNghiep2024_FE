import BaseLayout from '@/layouts/BaseLayout';
import { Button, Card, CardActions, Stack, Typography } from '@mui/material';
import { STUDENT_REGISTER_PATH, TEACHER_REGISTER_PATH } from '@/const';
import Image from 'next/image';
import { ReactElement } from 'react';
import Link from 'src/components/Link';

const Register = () => {
  return (
    <Stack
      height="calc(100vh - 90px)"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <Typography variant="h2">Đăng ký</Typography>
      <Typography variant="h5">bạn là ...</Typography>
      <Stack spacing={2} direction="row">
        <Card sx={{ width: 332, height: 392, p: '16px' }}>
          <Image
            src="/static/images/avatars/student.svg"
            width="300px"
            height="300px"
          />

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              href={STUDENT_REGISTER_PATH}
            >
              Nguời học
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 332, height: 392, p: '16px' }}>
          <Image
            src="/static/images/avatars/teacher.svg"
            width="300px"
            height="300px"
          />

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              href={TEACHER_REGISTER_PATH}
            >
              Giáo viên
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Stack>
  );
};

export default Register;

Register.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
