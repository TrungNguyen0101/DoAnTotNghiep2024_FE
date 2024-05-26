import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { TUTOR_PATH } from '@/const';

const BannerSection = () => {
  const router = useRouter();

  return (
    <>
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
        slidesPerView={1}
      >
        <SwiperSlide>
          <Box position="relative" height={500} width="100%">
            <Image src="https://i.imgur.com/ScDZX0R.jpg" layout="fill" />
            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: 'absolute',
                top: '35%',
                left: '15%'
              }}
            >
              <Typography color="primary.main" variant="h2">
                ez
              </Typography>
              <Typography variant="h2">Gia sư</Typography>
            </Stack>
            <Stack
              spacing={2}
              sx={{
                position: 'absolute',
                top: '45%',
                left: '15%'
              }}
            >
              <Typography
                variant="h4"
                width={300}
                sx={{
                  wordWrap: 'break-word',
                  textAlign: 'left'
                }}
              >
                Nơi đảm bảo gia sư uy tín, chất lượng cải thiên học tập của
                người học rõ rệt
              </Typography>

              <Button
                sx={{ width: 150, whiteSpace: 'nowrap' }}
                variant="contained"
                onClick={() => router.push(TUTOR_PATH)}
              >
                Tìm gia sư ngay
              </Button>
            </Stack>

            <Box
              sx={{
                position: 'absolute',
                right: '15%',
                top: '10%'
              }}
            >
              <Image
                src="/static/images/avatars/slide1.svg"
                width="400px"
                height="400px"
              />
            </Box>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Stack position="relative" height={500}>
            <Image
              src="https://i.imgur.com/ScDZX0R.jpg"
              style={{ position: 'absolute', top: 0 }}
              layout="fill"
            />
            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: 'absolute',
                top: '35%',
                left: '15%'
              }}
            >
              <Typography color="primary.main" variant="h2">
                ez
              </Typography>
              <Typography variant="h2">Gia sư</Typography>
            </Stack>
            <Stack
              spacing={2}
              sx={{
                position: 'absolute',
                top: '45%',
                left: '15%'
              }}
            >
              <Typography
                variant="h4"
                width={340}
                sx={{
                  wordWrap: 'break-word',
                  textAlign: 'left'
                }}
              >
                Có nhiều gia sư tài giỏi tại các trường hàng đầu cả nước luôn
                luôn nhiệt huyết với nghề
              </Typography>

              <Button
                sx={{ width: 150, whiteSpace: 'nowrap' }}
                variant="contained"
              >
                Tìm gia sư ngay
              </Button>
            </Stack>

            <Box
              sx={{
                position: 'absolute',
                right: '15%',
                top: '14%'
              }}
            >
              <Image
                src="/static/images/avatars/slide2.svg"
                width="400px"
                height="400px"
              />
            </Box>
          </Stack>
        </SwiperSlide>
        <SwiperSlide>
          <Stack position="relative" height={500}>
            <Image
              src="https://i.imgur.com/ScDZX0R.jpg"
              style={{ position: 'absolute', top: 0 }}
              layout="fill"
            />
            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: 'absolute',
                top: '35%',
                left: '15%'
              }}
            >
              <Typography color="primary.main" variant="h2">
                ez
              </Typography>
              <Typography variant="h2">Gia sư</Typography>
            </Stack>
            <Stack
              spacing={2}
              sx={{
                position: 'absolute',
                top: '45%',
                left: '15%'
              }}
            >
              <Typography
                variant="h4"
                width={300}
                sx={{
                  wordWrap: 'break-word',
                  textAlign: 'left'
                }}
              >
                Luôn truyền đạt với sự nhiệt thành đặt mục tiêu người học lên
                hàng đầu
              </Typography>

              <Button
                sx={{ width: 150, whiteSpace: 'nowrap' }}
                variant="contained"
              >
                Tìm gia sư ngay
              </Button>
            </Stack>

            <Box
              sx={{
                position: 'absolute',
                right: '15%',
                top: '10%'
              }}
            >
              <Image
                src="/static/images/avatars/slide 3.svg"
                width="400px"
                height="400px"
              />
            </Box>
          </Stack>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default BannerSection;
