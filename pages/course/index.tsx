import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import CourseDetailCard from '@/components/card/CourseDetailCard';
import BaseLayout from '@/layouts/BaseLayout';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
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
  console.log('Course ~ courseList:', courseList);
  const [courseListRoot, setCourseListRoot] = useState([]);

  const [subjects, setListSubjects] = useState([]);

  const [value, setValue] = useState(null);

  const searchKey = watch('name');

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
  useEffect(() => {
    getTutor();
  }, []);

  useEffect(() => {
    const getSubject = async () => {
      try {
        const rs = await api.get('/category');

        if (rs.status == 200) {
          let subjectArray = [];
          rs.data.data.map((item, key) => {
            subjectArray.push({
              label: item.name,
              value: item.category_id
            });
          });
          setListSubjects(subjectArray);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getSubject();
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

  const handleChange = (event, newValue) => {
    // const getCourse = () => {
    //   api.get('/course/get-by-category-id/' + newValue?.value).then((res) => {
    //     console.log('api.get ~ res:', res);
    //     setCourseList(res.data.data);
    //     setCourseListRoot(res.data.data);
    //   });
    // };
    let lists = [...courseListRoot];

    if (newValue?.value) {
      lists = lists.filter((course) => course.category_id === newValue?.value);
      setCourseList(lists);
    } else {
      setCourseList(courseListRoot);
    }
    setValue(newValue);
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
            <Box>
              <InputLabel
                sx={{
                  '&': {
                    mb: 0.5
                  }
                }}
              >
                Chọn khóa học
              </InputLabel>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={value}
                options={subjects}
                onChange={handleChange}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth placeholder="Khóa học" />
                )}
              />
            </Box>
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
