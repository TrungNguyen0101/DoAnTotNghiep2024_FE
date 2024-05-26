import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import TutorCard from '../card/TutorCard';
import { ArrowIcon } from '../icons';
import { useEffect, useState } from 'react';
import api from '@/api';
import { TUTOR_PATH } from '@/const';
import { useRouter } from 'next/router';

const TutorSection = () => {
  const router = useRouter();
  const [tutorList, setTutorList] = useState([]);

  useEffect(() => {
    const getTutor = async () => {
      try {
        const res = await api.get(TUTOR_PATH);
        if (res.status === 200) {
          setTutorList(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getTutor();
  }, []);

  return (
    <Stack mt={3} mb={10} height="80vh" width="100%">
      <Container sx={{ height: '100%' }}>
        <Stack direction="column" spacing={2} alignItems="center" height="100%">
          <Typography variant="h1">Gặp gỡ gia sư của chúng tôi</Typography>
          <Typography variant="h4">
            Chúng tôi có các gia sư hàng đầu để dạy cho bạn
          </Typography>
          <Box>
            <Grid container spacing={3}>
              {tutorList.slice(0, 6).map((item) => (
                <Grid key={item.tutor_profile_id} item xs={4}>
                  <TutorCard data={item} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            sx={{
              minWidth: 300,
              border: '2px solid #14398a',
              borderRadius: '20px',
              height: 48,
              marginBottom: 3,

              '&:hover': {
                color: 'white',
                backgroundColor: 'primary.main',
                transition: 'all .2s linear'
              }
            }}
            endIcon={<ArrowIcon />}
            variant="outlined"
            onClick={() => router.push(TUTOR_PATH)}
          >
            Xem tất cả gia sư
          </Button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default TutorSection;
