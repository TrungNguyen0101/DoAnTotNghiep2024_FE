import api from '@/api';
import { COURSE_DETAIL_PATH } from '@/const';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomizedAccordions from '../CustomizedAccordions';
import {
  HeartIcon,
  LangueTeachIcon,
  PersonIcon,
  SpeakLangueIcon
} from '../icons';
import CourseProgramFormAdd from '../management/course/CourseProgramFormAdd';

const CourseDetailCard = ({
  data,
  setDataSelected,
  setShowForm,
  setShowConfirmDelete,
  setCount,
  edit
}: CourseDetailCardProps) => {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await api.get(`/course/${data.course_id}`);
        if (res.status === 200) {
          setCourse(res?.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourse();
  }, [data]);

  return (
    <Stack
      borderRadius="4px"
      boxShadow={'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}
    >
      <Stack
        p={3}
        mb={5}
        direction="row"
        spacing={3}
        justifyContent="space-between"
      >
        <>
          <Box
            sx={{
              height: 160,
              minWidth: 160,
              position: 'relative',
              mb: 2
            }}
          >
            <Card sx={{ width: '100%' }}>
              <CardActionArea>
                <CardMedia
                  sx={{ height: 200 }}
                  image={data.image_url}
                  title="haha"
                />
              </CardActionArea>
            </Card>
          </Box>

          <Stack width="100%" spacing={2}>
            <Typography variant="h2">{data?.name}</Typography>
            <Stack spacing={1}>
              <Stack>
                <Typography
                  display="flex"
                  variant="h5"
                  color="secondary"
                  alignItems="center"
                  gap="8px"
                >
                  <LangueTeachIcon /> Tiếng việt
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
                  <PersonIcon /> 20 học sinh đang theo học
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
                  <SpeakLangueIcon /> ngoại ngữ: Tiếng Anh
                </Typography>
              </Stack>

              <Typography mt={2} variant="h4">
                Chứng chỉ TOEIC 800+{' '}
              </Typography>
              <Typography
                variant="h4"
                fontWeight={400}
                className="text-ellipsis-2-row"
              >
                {data?.description ||
                  `Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the ...`}
              </Typography>
            </Stack>
          </Stack>
        </>

        <Stack justifyContent="space-between" minWidth="25%">
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" height={52} spacing={2}>
              <Stack width="fit-content" justifyContent="center"></Stack>
              <Stack width="fit-content" justifyContent="center">
                <Typography variant="h4">{data.price} đ</Typography>
                <Typography variant="h5" color="secondary">
                  45p/1h
                </Typography>
              </Stack>
            </Stack>

            <Typography variant="h2">
              <HeartIcon />
            </Typography>
          </Stack>
          {!edit && (
            <Button
              sx={{ border: '2px solid #121117' }}
              variant="contained"
              onClick={() => {
                router.push({
                  pathname: COURSE_DETAIL_PATH,
                  query: { id: data?.course_id }
                });
              }}
            >
              Xem chi tiết
            </Button>
          )}
          {edit && (
            <Stack spacing={1}>
              <Button
                sx={{ border: '2px solid #121117' }}
                variant="contained"
                onClick={() => {
                  setDataSelected(data);
                  setShowForm(true);
                }}
              >
                Sửa khóa học
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  setDataSelected(data);
                  setShowConfirmDelete(true);
                }}
              >
                Xóa khóa học
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant="contained"
              >
                Thêm bài học
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Divider />

      {edit &&
        course?.course_programs?.map((item, i) => {
          return (
            <CustomizedAccordions
              key={i}
              keyExpand={item.course_program_id}
              title={item.tittle}
              childTitle={item.course_program_phases}
              data={item}
              setDataSelected={setDataSelected}
              setShowConfirmDelete={setShowConfirmDelete}
              add={true}
              setCount={setCount}
            />
          );
        })}

      <CourseProgramFormAdd
        data={data}
        isOpen={open}
        onClose={() => setOpen(false)}
        setCount={setCount}
      />
    </Stack>
  );
};

export default CourseDetailCard;

type CourseDetailCardProps = {
  data?: any;
  setDataSelected?: any;
  setShowForm?: any;
  setShowConfirmDelete?: any;
  setCount?: any;
  edit?: boolean;
};
