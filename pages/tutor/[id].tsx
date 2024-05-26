import api from '@/api';
import DateCalendarValue from '@/components/Calendar';
import UserCommentSection from '@/components/UserCommentSection';
import CourseCard from '@/components/card/CourseCard';
import { LangueTeachIcon, PersonIcon, VerifyIcon } from '@/components/icons';
import { Flex, Rate } from 'antd';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

import TryTutorIcon from '@/components/icons/TryTutorIcon';
import BaseLayout from '@/layouts/BaseLayout';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Snackbar from '@mui/material/Snackbar';
import AppRating from '@/components/AppRating';
const DetailTutor = () => {
  const ref = useRef<AbortController | null>(null);
  const router = useRouter();
  const id = router.query.id;

  const [value, setValue] = useState(3);
  const [tutor, setTutor] = useState(null);
  const [course, setCourse] = useState([]);
  const [availableDay, setAvailableDay] = useState(null);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [timeAvaiLableDay, setTimeAvailableDay] = useState([]);
  const [tutor_experience, setTutor_experience] = useState({});
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (id) {
      const getDetailTutor = async () => {
        try {
          const tutorProfile = await api.get(`/tutor/${id}`);
          if (tutorProfile.status === 200) {
            setTutor(tutorProfile.data.data);

            const course = await api.get(`/course/get-by-tutor-id/${id}`);
            setCourse(course.data.data);

            // const availableTime = await api.get(
            //   `/tutor-available-date/find-by-userid/${tutorProfile.data.data.user_id}`
            // );

            // setAvailableDay(availableTime.data.data);
            // setHighlightedDays(findDayHightLight(availableTime.data.data));
            // setTimeAvailableDay(
            //   chooseAllTimeAvailable(
            //     dayjs().format('DD'),
            //     availableTime.data.data
            //   )
            // );
          }
        } catch (error) {
          console.log(error);
        }
      };

      getDetailTutor();
    }
  }, [id]);

  const handleMonthChange = (date: Dayjs) => {
    if (ref.current) {
      ref.current.abort();
    }
    // setHighlightedDays([]);
    // fetchHighlightedDays(date);
  };

  const handleChangeDay = (value) => {
    const day = value.format('DD/MM/YYYY');
    console.log(day);
    setTimeAvailableDay(chooseAllTimeAvailable(day, availableDay));
  };

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClickChip = () => {
    // console.log('haha');
  };

  const handleRate = async (value) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      handleClick();
    } else {
      const decoded = jwtDecode<any>(token);

      if (id) {
        const resUser = await api.get(`/tutor/${id}`);
        if (resUser.status == 200) {
          const res = await api.post('/rate/create', {
            rate: value,
            view_id: resUser.data.data.user.user_id,
            author_id: decoded?.user_id
          });
          setRate(value);
        } else {
          console.log('error');
        }
      }
    }
  };

  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} mt={4} justifyContent="space-between">
        <Box
          sx={{
            height: 160,
            minWidth: 160,
            width: 160,
            position: 'relative'
          }}
        >
          <Image
            src={tutor?.user?.avatar_url || '/static/images/avatars/3.jpg'}
            layout="fill"
            style={{ borderRadius: '4px' }}
          />
        </Box>

        <Box width="100%">
          <Stack justifyContent="space-between" spacing={1}>
            <Typography
              display="flex"
              variant="h1"
              alignItems="center"
              gap="8px"
            >
              {(tutor?.user?.first_name || '') +
                ' ' +
                (tutor?.user?.last_name || '')}
              <VerifyIcon sx={{ fontSize: 18, color: '#4caf50' }} />
            </Typography>
            <Typography variant="h5" color="secondary">
              Có kinh nghiệm {} năm trong nghề gia sư
            </Typography>

            <Stack spacing={1}>
              <Stack>
                <Typography
                  display="flex"
                  variant="h5"
                  color="secondary"
                  alignItems="center"
                  gap="8px"
                >
                  <LangueTeachIcon /> {tutor?.tutor_educations?.subjects}
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  display="flex"
                  variant="h5"
                  color="secondary"
                  alignItems="center"
                  gap="8px"
                >
                  <PersonIcon /> {} học sinh đang theo học
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Stack minWidth={250} spacing={1}>
          <Button
            sx={{ border: '2px solid #121117' }}
            startIcon={<TryTutorIcon />}
            variant="contained"
          >
            Đặt lịch học thử
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />
      <Stack mt={2} width="70%" gap="8px">
        <Typography variant="h3">Thời gian rảnh trong tuần</Typography>
        <Stack direction="row" spacing={6}>
          <DateCalendarValue
            highlightedDays={highlightedDays}
            handleMonthChange={handleMonthChange}
            onChangeDay={handleChangeDay}
          />
          <Stack pt={2} spacing={2}>
            <Typography variant="h4">
              Thời gian có thể dạy trong ngày
            </Typography>
            <Stack direction="row" spacing={1}>
              {timeAvaiLableDay?.length ? (
                timeAvaiLableDay
                  .sort(function (a, b) {
                    return a.start_time.localeCompare(b.start_time);
                  })
                  ?.map((item, i) => (
                    <Chip
                      key={i}
                      label={`${item.start_time} : ${item.end_time}`}
                      onClick={handleClickChip}
                    />
                  ))
              ) : (
                <Typography>Không có thời gian rảnh trong ngày này!</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <Stack mt={2} width="70%" gap="8px">
        <Typography variant="h3">Mô tả gia sư</Typography>
        <Typography variant="h6" fontWeight={400}>
          {tutor?.description}
        </Typography>
      </Stack>

      <Divider sx={{ mt: 2 }} />
      <Typography mt={2} variant="h3">
        Khóa học
      </Typography>
      <Grid mt={2} container spacing={2}>
        {course.map((item) => (
          <Grid key={item.course_id} item xs={4}>
            <CourseCard
              src={item.image_url}
              title={item.name}
              course_id={item.course_id}
            />
          </Grid>
        ))}
      </Grid>

      <Stack>
        <h3>Thông tin kinh nghiệm</h3>
        <Stack>
          {tutor?.tutor_experiences?.map((x) => (
            <Box key={x.tutor_experience_id}>
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Typography variant="h6">
                  {x?.start_time} - {x?.end_time || 'Hiện tại'}
                </Typography>
                <Box marginLeft={3}>
                  <Typography variant="h4">{x?.organization}</Typography>
                  <Typography variant="subtitle1">{x?.position}</Typography>
                  <Typography variant="subtitle2">{x?.description}</Typography>
                </Box>
              </Box>

              <Divider sx={{ margin: 4 }} />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack>
        <h3>Thông tin học vấn</h3>
        <Stack>
          {tutor?.tutor_educations?.map((x) => (
            <Box key={x.tutor_educations_id}>
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Typography variant="h6">
                  {x?.from_year} - {x?.to_year || 'Hiện tại'}
                </Typography>
                <Box marginLeft={3}>
                  <Typography variant="h4">
                    {x?.school_name || 'THPT Duy Tân'}
                  </Typography>

                  <Typography variant="subtitle2">{x?.score_url}</Typography>

                  <Typography variant="subtitle2">
                    {x?.favorite_subject}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ margin: 4 }} />
            </Box>
          ))}
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2 }} />

      <Stack>
        <h3>Thông tin chứng chỉ</h3>
        <Stack>
          {tutor?.tutor_certifications?.map((x) => (
            <Box key={x.tutor_certification_id}>
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Box>
                  <Typography variant="h4">{x?.name}</Typography>

                  <Typography variant="subtitle2">{x?.organization}</Typography>

                  <Typography variant="subtitle2">{x?.award_url}</Typography>
                </Box>
              </Box>

              <Divider sx={{ margin: 4 }} />
            </Box>
          ))}
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />
      <Stack mt={2} gap="8px">
        <Typography variant="h3">Tổng đánh giá gia sư</Typography>

        <Stack flexDirection="row" alignItems="center" gap="8px">
          <AppRating
            sx={{
              fontSize: '28px'
            }}
            onChange={(e) => {
              handleRate(e.target['value']);
            }}
            value={rate}
          />
        </Stack>
      </Stack>
      {/* <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} /> */}
      <UserCommentSection id={id} />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Bạn cần đăng nhập để đánh giá và bình luận"
      />
    </Container>
  );
};

export default DetailTutor;

DetailTutor.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export function findDayHightLight(arr) {
  const dates = arr.map((item) => {
    const day = item.date.split('/')[0];
    return parseInt(day);
  });
  return dates;
}

export const chooseAllTimeAvailable = (day, arr) => {
  const dateNow = arr?.filter((item) => item.date === day);
  return dateNow?.map((item) => ({
    id: item.tutor_available_date_id,
    start_time: item.start_time,
    end_time: item.end_time
  }));
};
