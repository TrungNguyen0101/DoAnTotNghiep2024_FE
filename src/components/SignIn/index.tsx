import api from '@/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import {
  LOGIN_PATH,
  REGISTER_PATH,
  ROLE_ADMIN_ID,
  ROLE_STUDENT_ID,
  ROLE_TEACHER_ID,
  ROOT_PATH
} from '@/const';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        Ez Gia sư
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type FormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const router = useRouter();

  const schema: ZodType = z.object({
    email: z
      .string()
      .min(1, { message: 'Không được để trống email' })
      .email({ message: 'Không đúng dạng địa chỉ email' }),
    password: z
      .string()
      .min(1, { message: 'Không được để trống mật khẩu' })
      .min(4, { message: 'Mật khẩu ít nhất 4 ký tự' })
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleLogin = async (data) => {
    try {
      const response = await api.post(LOGIN_PATH, data);
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('avatar_url', response.data.data.avatar_url);
        if (
          response.data.data.role_id === ROLE_TEACHER_ID ||
          response.data.data.role_id === ROLE_STUDENT_ID
        ) {
          router.push(ROOT_PATH);
        } else if (response.data.data.role_id === ROLE_ADMIN_ID) {
          router.push('/management/category');
        }
      } else {
        enqueueSnackbar({
          message: 'Đăng nhập thất bại!',
          variant: 'error'
        });
      }
    } catch (error) {
      enqueueSnackbar({
        message: 'Đăng nhập thất bại!',
        variant: 'error'
      });
    }
  };

  return (
    <Container>
      <Box
        sx={{
          background:
            'no-repeat right / contain url(/static/images/avatars/background-Login.svg)'
        }}
        width="90%"
        pl={10}
      >
        <Stack width="30%">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Image
              alt="ETH"
              src="https://i.imgur.com/frEuf3a.png"
              height={48}
              width={48}
            />
            <Typography component="h1" variant="h5">
              ez Gia sư
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(handleLogin)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email đăng nhập"
                name="email"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors['email']}
                helperText={errors['email'] ? errors['email'].message : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors['password']}
                helperText={
                  errors['password'] ? errors['password'].message : ''
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng nhập
              </Button>
              <Grid container>
                <Grid item>
                  <Link href={REGISTER_PATH} variant="body2">
                    {'Chưa có tài khoản? Đăng ký'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Stack>
      </Box>
    </Container>
  );
}
