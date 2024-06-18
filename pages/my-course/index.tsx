import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import Label from '@/components/Label';
import CourseDetailCard from '@/components/card/CourseDetailCard';
import BaseLayout from '@/layouts/BaseLayout';
import {
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
}

const defaultValues = {
  name: ''
};

const Course = () => {
  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues
  });

  const [courseList, setCourseList] = useState([]);
  const [courseListRoot, setCourseListRoot] = useState([]);
  const [userId, setUserId] = useState('');

  const options = [
    { label: 'Tất cả khóa học', value: 3 },
    { label: 'Khóa học còn hạn', value: 2 },
    { label: 'Khóa học hết hạn', value: 1 }
  ];
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const searchKey = watch('name');
  const router = useRouter();

  useEffect(() => {
    const getTutor = async () => {
      try {
        api
          .get(
            `/booked-session/my-course-user?user_id=${userId}&status=${
              selectedValue.value || selectedValue
            }`
          )
          .then((res) => {
            const result = [
              ...(res?.data?.data?.sessions || []),
              ...(res?.data?.data?.courses || [])
            ];
            const uniqueCategories = {};
            let uniqueData = result.reduce((unique, item) => {
              // Check if there is no existing item with the same course_id
              if (!unique.some((obj) => obj.course_id === item.course_id)) {
                unique.push(item);
              }
              return unique;
            }, []);

            console.log('.then ~ result:', uniqueData);
            // console.log('.then ~ reuslt:', reuslt);
            setCourseList(uniqueData);
            setCourseListRoot(result);
          });
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getTutor();
    }
  }, [userId, selectedValue]);

  useEffect(() => {
    handleFilter();
  }, [searchKey]);

  useEffect(() => {
    const token = localStorage?.getItem('access_token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      if (decoded?.user_id) {
        setUserId(decoded?.user_id);
      } else {
        router.push('/auth/login');
      }
    }
  }, []);

  const handleFilter = () => {
    let lists = [...courseListRoot];
    if (searchKey) {
      lists = lists.filter(
        (x) =>
          x?.course?.name?.includes(searchKey) || x?.name?.includes(searchKey)
      );
      setCourseList(lists);
    } else {
      setCourseList(courseListRoot);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Stack
        component="form"
        onSubmit={handleSubmit(handleFilter)}
        height="100%"
        mt={2}
        spacing={2}
      >
        <Typography variant="h1">Tất cả khóa học</Typography>
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            <ControlTextField
              control={control}
              label="Tên Khóa học"
              name="name"
              textfieldProps={{
                size: 'medium',
                placeholder: 'Tìm kiếm khóa học',
                autoComplete: 'off',
                margin: 'none'
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Lọc khóa học</Typography>
            <Select
              labelId="select-label"
              id="select"
              defaultValue={selectedValue.value}
              value={selectedValue.value || selectedValue}
              onChange={handleChange}
              style={{
                width: '230px',
                height: '55px',
                marginTop: '5px'
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        {courseList?.map((item, i) => (
          <CourseDetailCard
            key={i}
            data={item.course || item}
            tutor={item.tutor}
            isMyCourse={true}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default Course;
Course.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
