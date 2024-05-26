import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import TutorDetailCard from '@/components/card/TutorDetailCard';
import BaseLayout from '@/layouts/BaseLayout';
import {
  Autocomplete,
  Container,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pagination } from 'antd';

interface FormData {
  name: string;
}

const defaultValues = {
  name: ''
};

const Tutor = () => {
  const { handleSubmit, watch, control } = useForm<FormData>({
    defaultValues
  });

  const searchKey = watch('name');
  const [tutorList, setTutorList] = useState([]);
  const [tutorListRoot, setTutorListRoot] = useState([]);
  const [subjects, setListSubjects] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [value, setValue] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFilter = () => {
    let lists = [...tutorListRoot];
    if (searchKey) {
      lists = lists.filter(
        (x) =>
          x?.user?.first_name?.includes(searchKey) ||
          x?.user?.last_name?.includes(searchKey) ||
          x?.user?.email?.includes(searchKey)
      );
      setTutorList(lists);
    } else {
      setTutorList(tutorListRoot);
    }
  };

  const handFilterSubJect = async () => {
    if (value != null) {
      let subjectId = value.value;
      const rs = await api.post(`/category/searchByCategryId/${subjectId}`);
      console.log(rs);
      setTutorList(rs?.data.data);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [searchKey]);

  useEffect(() => {
    handFilterSubJect();
  }, [value]);

  const changeSize = (current, pageSize) => {
    console.log(current, pageSize);
  };
  useEffect(() => {
    const getTutor = async () => {
      try {
        const res = await api.get('/tutor');
        console.log(res);

        if (res.status === 200) {
          setTutorList(res.data.data);
          setTutorListRoot(res.data.data);
        }
      } catch (error) {}
    };
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
    getTutor();
    getSubject();
  }, []);

  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Stack
        component="form"
        onSubmit={handleSubmit(handleFilter)}
        height="100%"
        mt={2}
        spacing={2}
      >
        <Typography variant="h1">Tất cả gia sư</Typography>
        <Grid container gap={2}>
          <Grid item xs={4}>
            <ControlTextField
              control={control}
              label="Tên gia sư"
              name="name"
              textfieldProps={{
                size: 'medium',
                placeholder: 'Tìm kiếm gia sư',
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

        {tutorList.map((item) => (
          <TutorDetailCard key={item.tutor_profile_id} data={item} />
        ))}

        <Pagination onChange={changeSize} defaultCurrent={1} total={500} />
      </Stack>
    </Container>
  );
};

export default Tutor;
Tutor.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

const top100Films = [
  { label: 'Tiếng việt', year: 1994 },
  { label: 'Tiếng anh', year: 1972 },
  { label: 'Toán Học', year: 1974 },
  { label: 'Ngữ Văn', year: 2008 },
  { label: 'Hóa Học', year: 1957 },
  { label: 'Địa Lý', year: 1993 },
  { label: 'Sinh Học', year: 1994 }
];
