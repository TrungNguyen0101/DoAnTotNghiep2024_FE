import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import CourseDetailCard from '@/components/card/CourseDetailCard';
import BaseLayout from '@/layouts/BaseLayout';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
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
  console.log(courseList);

  const searchKey = watch('name');

  useEffect(() => {
    const getTutor = async () => {
      try {
        api.get('/course').then((res) => {
          setCourseList(res.data.data);
          setCourseListRoot(res.data.data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getTutor();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchKey]);

  const handleFilter = () => {
    let lists = [...courseListRoot];
    if (searchKey) {
      lists = lists.filter((x) => x?.name?.includes(searchKey));
      setCourseList(lists);
    } else {
      setCourseList(courseListRoot);
    }
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
        </Grid>
        {courseList.map((item, i) => (
          <CourseDetailCard key={i} data={item} />
        ))}
      </Stack>
    </Container>
  );
};

export default Course;
Course.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
