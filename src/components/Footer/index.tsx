import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        mt: 10,
        height: 250,
        width: '100%',
        backgroundColor: 'text.primary',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container
        sx={{
          mt: 2,
          height: '90%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column'
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Image
              alt="ETH"
              src="https://i.imgur.com/frEuf3a.png"
              height={164}
              width={164}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/')}
            />
          </Grid>

          <Grid item xs={3}>
            <Stack>
              <Typography color="white" variant="h5" marginBottom={5}>
                Liên hệ với chúng tôi
              </Typography>

              <Typography color="white" variant="subtitle1">
                Email: webtutor@gmail.com
              </Typography>

              <Typography color="white" variant="subtitle1">
                Phone: 0987456231
              </Typography>

              <Typography color="white" variant="subtitle1">
                Địa chỉ: 254 Nguyễn Văn Linh, Quận Thanh Khê - Tp. Đà Nẵng
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={2}>
            <Stack>
              <Typography color="white" variant="h5" marginBottom={5}>
                Gia sư
              </Typography>

              <Typography color="white" variant="subtitle1">
                Become tutor online
              </Typography>

              <Typography color="white" variant="subtitle1">
                Teach math online
              </Typography>

              <Typography color="white" variant="subtitle1">
                Teacher english online
              </Typography>

              <Typography color="white" variant="subtitle1">
                Teacher IT online
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={2}>
            <Stack>
              <Typography color="white" variant="h5" marginBottom={5}>
                Student
              </Typography>

              <Typography color="white" variant="subtitle1">
                Question and answer
              </Typography>

              <Typography color="white" variant="subtitle1">
                Student discount
              </Typography>

              <Typography color="white" variant="subtitle1">
                Test free
              </Typography>

              <Typography color="white" variant="subtitle1">
                Discount
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={2}>
            <Stack>
              <Typography color="white" variant="h5" marginBottom={5}>
                About us
              </Typography>

              <Typography color="white" variant="subtitle1">
                Who we are?
              </Typography>

              <Typography color="white" variant="subtitle1">
                How it works
              </Typography>

              <Typography color="white" variant="subtitle1">
                Review
              </Typography>

              <Typography color="white" variant="subtitle1">
                Status
              </Typography>

              <Typography color="white" variant="subtitle1">
                Media kit
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <Typography color="white" variant="subtitle1">
            &copy; 2023 - copyright by Webtutor
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
