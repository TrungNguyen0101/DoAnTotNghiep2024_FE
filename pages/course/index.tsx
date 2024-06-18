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
import ReactPaginate from 'react-paginate';

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

  const [subjects, setListSubjects] = useState([]);

  const [value, setValue] = useState(null);

  const searchKey = watch('name');

  // --------------------
  const [currentItems, setCurrentItems] = useState<any>([]);
  const [pageCount, setPageCount] = useState<any>(0);
  const [itemOffset, setItemOffset] = useState<any>(0);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(courseList.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(courseList.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, courseList]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % courseList.length;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };

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
    setItemOffset(0); // Reset itemOffset về 0
    setCurrentPage(0); // Reset currentPage về 0 (tương ứng với trang 1)
  };

  const handleChange = (event, newValue) => {
    let lists = [...courseListRoot];

    if (newValue?.value) {
      lists = lists.filter((course) => course.category_id === newValue?.value);
      setCourseList(lists);
    } else {
      setCourseList(courseListRoot);
    }
    setValue(newValue);
    setItemOffset(0); // Reset itemOffset về 0
    setCurrentPage(0); // Reset currentPage về 0 (tương ứng với trang 1)
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
        {currentItems.map((item, i) => (
          <CourseDetailCard key={i} data={item} />
        ))}

        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< "
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage} // Set trang hiện tại
        />
      </Stack>
    </Container>
  );
};

export default Course;
Course.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
