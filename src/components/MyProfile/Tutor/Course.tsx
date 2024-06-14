import api from '@/api';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import CourseDetailCard from '@/components/card/CourseDetailCard';
import CourseFormAdd from '@/components/management/course/CourseFormAdd';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

interface FormData {
  name: string;
}

const defaultValues = {
  name: ''
};

const CoursePanel = ({ tutor }) => {
  const [courseList, setCourseList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();
  const [count, setCount] = useState<any>(0);

  const getTutor = () => {
    api.get('/course/get-by-tutor-id/' + tutor.tutor_profile_id).then((res) => {
      setCourseList(res.data.data);
    });
  };

  useEffect(() => {
    getTutor();
  }, [count]);

  const handleSaveData = (body) => {
    body = { ...body, tutor_profile_id: tutor.tutor_profile_id };
    console.log('handleSaveData ~ body:', body);
    const formData = new FormData();

    formData.append('category_id', body.category_id);
    formData.append('description', body.description);
    formData.append('image_url', body.image_url);
    formData.append('name', body.name);
    formData.append('price', body.price.toString());
    formData.append('hour', body.hour.toString());
    formData.append('type_course', body.type_course);
    formData.append('tutor_profile_id', body.tutor_profile_id);
    const request = !body?.course_id
      ? api.post('course', formData)
      : api.put(`course/${body.course_id}`, formData);
    request
      .then((res) => {
        getTutor();
        enqueueSnackbar({
          message: 'Thêm khóa học thành công!',
          variant: 'success',
          autoHideDuration: 1500
        });
        setShowForm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = () => {
    const { course_id } = dataSelected;

    api.delete(`course/${course_id}`).then(() => {
      getTutor();
      setShowConfirmDelete(false);
    });
  };

  return (
    <>
      <Stack height="100%" mt={2}>
        <Typography variant="h3">Tất cả khóa học</Typography>
        <Grid
          display="flex"
          alignItems="center"
          container
          columnSpacing={2}
          my={2}
        >
          {/* <Grid item xs={4}>
            <TextField label="Tên Khóa học" name="search" />
          </Grid> */}
          <Button
            sx={{
              height: '50px',
              marginLeft: '20px'
            }}
            variant="contained"
            onClick={() => {
              setDataSelected({});
              setShowForm(true);
            }}
          >
            Thêm khóa học
          </Button>
        </Grid>
        {courseList.map((item, i) => (
          <CourseDetailCard
            key={i}
            data={item}
            setDataSelected={setDataSelected}
            setShowForm={setShowForm}
            setShowConfirmDelete={setShowConfirmDelete}
            setCount={setCount}
            edit={true}
          />
        ))}
      </Stack>
      {showForm && (
        <CourseFormAdd
          data={dataSelected}
          isOpen={showForm}
          onSave={handleSaveData}
          onClose={() => setShowForm(false)}
        />
      )}
      {showConfirmDelete && (
        <ConfirmDeleteModal
          open={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default CoursePanel;
