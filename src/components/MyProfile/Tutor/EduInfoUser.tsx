import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import ControlTextField from '@/components/ControlTextField';
import api from '@/api';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import ControlSelect from '@/components/ControlSelect';

type FormDataEdu = {
  school: any;
  score_url: string;
  from_year: string;
  to_year: string;
  favorite_subject: string;

  school_id_edit: any;
  score_url_edit: string;
  from_year_edit: string;
  to_year_edit: string;
  favorite_subject_edit: string;
};

const defaultValues = {
  school: '',
  score_url: '',
  from_year: '',
  to_year: '',
  favorite_subject: '',

  school_id_edit: '',
  score_url_edit: '',
  from_year_edit: '',
  to_year_edit: '',
  favorite_subject_edit: ''
};

// const EduInfo = ({ data, school }) => {
const EduInfoUser = ({ data }) => {
  const { handleSubmit, control, resetField, setValue } = useForm<FormDataEdu>({
    defaultValues
  });
  const [tutorEdu, setTutorEdu] = useState<any>([]);
  const [open, setOpen] = useState(0);

  const editModal = async (value) => {
    console.log('editModal ~ value:', value);
    if (
      value.school_id_edit &&
      value.from_year_edit >= 1000 &&
      value.to_year_edit >= 1000 &&
      value.to_year_edit >= value.from_year_edit
    ) {
      setTutorEdu((prev) => {
        const newArr = [...prev];
        newArr[open - 1] = {
          school: value.school_id_edit,
          // score_url: value.score_url_edit,
          from_year: value.from_year_edit,
          to_year: value.to_year_edit,
          // favorite_subject: value.favorite_subject_edit,
          tutor_profile_id: data.tutor_profile_id
        };
        return newArr;
      });
      try {
        const studentId = data?.student_educations[0]?.student_education_id;
        const res = await api.put(`/student/${studentId}`, {
          school: value.school_id_edit,
          from_year: value.from_year_edit,
          to_year: value.to_year_edit
        });
        if (res.status === 200) {
          enqueueSnackbar({
            message: 'Sửa thành công',
            variant: 'success',
            autoHideDuration: 1500
          });
        }
      } catch (error) {
        console.log(error);
      }
      resetField('school_id_edit');
      // resetField('score_url_edit');
      resetField('from_year_edit');
      resetField('to_year_edit');
      // resetField('favorite_subject_edit');
      setOpen(0);
    } else {
      enqueueSnackbar({
        message: 'Vui lòng nhập đúng thông tin',
        variant: 'error',
        autoHideDuration: 1500
      });
    }
  };

  useEffect(() => {
    if (data) {
      console.log('useEffect ~ data:', data);
      setTutorEdu(
        data?.student_educations?.map((item) => {
          return {
            school: item.school,
            from_year: item.from_year,
            to_year: item.to_year,
            score_url: item.score_url,
            favorite_subject: item.favorite_subject
          };
        })
      );
    }
  }, [data]);

  const addEdu = async (value) => {
    const payload = {
      school: value.school,
      from_year: value.from_year,
      to_year: value.to_year
    };
    console.log('addEdu ~ payload:', payload);
    if (
      payload.school &&
      payload.from_year >= 1000 &&
      payload.to_year >= 1000 &&
      payload.to_year >= payload.from_year
    ) {
      setTutorEdu((prev) => [payload]);
      resetField('school');
      resetField('from_year');
      resetField('to_year');
      try {
        const res = await api.put(
          `/student/update-student-educations/${data.student_profile_id}`,
          payload
        );
        if (res.status === 200) {
          enqueueSnackbar({
            message: 'Thêm thành công',
            variant: 'success',
            autoHideDuration: 1500
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      enqueueSnackbar({
        message: 'Vui lòng nhập đúng thông tin',
        variant: 'error',
        autoHideDuration: 1500
      });
    }
  };

  const handleSaveEdu = async () => {
    try {
      const res = await api.put(
        `/tutor/update-student-educations/${data.tutor_profile_id}`,
        tutorEdu
      );
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật thành công',
          variant: 'success',
          autoHideDuration: 1500
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEdu = async (index) => {
    const newArray = [...tutorEdu];
    newArray.splice(index, 1);
    setTutorEdu(newArray);
    console.log(
      'deleteEdu ~ newArray:',
      data?.student_educations[0]?.student_education_id
    );
    const studentId = data?.student_educations[0]?.student_education_id;
    try {
      const res = await api.delete(`/student/${studentId}`);
      console.log('deleteEdu ~ res:', res);
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Xóa thành công',
          variant: 'success',
          autoHideDuration: 1500
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="form">
      <h3>Thông tin học vấn</h3>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <ControlSelect
            label="Tên trường"
            control={control}
            name="school_id"
            list={school}
          /> */}
        </Grid>

        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="school"
            label="Tên trường"
          />
        </Grid>

        {/* <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="score_url"
            label="Bằng tốt nghiệp"
          />
        </Grid> */}

        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="from_year"
            label="Năm bắt đầu"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="to_year"
            label="Năm kết thúc"
          />
        </Grid>

        {/* <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="favorite_subject"
            label="Môn học yêu thích"
          />
        </Grid> */}
      </Grid>
      {tutorEdu.length === 0 && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'end'
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit(addEdu)}
          >
            thêm mới
          </Button>
        </Box>
      )}

      {tutorEdu?.map((x, i) => (
        <Box mt={2} key={i}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">{x?.school}</Typography>
              <Typography mt={2} variant="h6">
                {x?.from_year} - {x?.to_year || 'Hiện tại'}
              </Typography>

              <Typography variant="subtitle2">{x?.score_url}</Typography>

              <Typography variant="subtitle2">{x?.favorite_subject}</Typography>
            </Box>
            <Stack alignItems="center">
              <Button
                onClick={() => {
                  setValue('school_id_edit', x?.school);
                  // setValue('score_url_edit', x.score_url);
                  setValue('from_year_edit', x.from_year);
                  setValue('to_year_edit', x?.to_year);
                  // setValue('favorite_subject_edit', x?.favorite_subject);
                  setOpen(i + 1);
                }}
              >
                Sửa
              </Button>
              <Button onClick={() => deleteEdu(i)}>Xoá</Button>
            </Stack>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      {/* {Boolean(tutorEdu.length) && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'end'
          }}
        >
          <Button color="primary" variant="contained" onClick={handleSaveEdu}>
            Lưu
          </Button>
        </Box>
      )} */}

      <Dialog onClose={() => setOpen(0)} open={Boolean(open)}>
        <Stack p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="school_id_edit"
                label="Tên trường Đại Học"
              />
            </Grid>

            {/* <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="score_url_edit"
                label="Bằng tốt nghiệp"
              />
            </Grid> */}

            <Grid item xs={6}>
              <ControlTextField
                control={control}
                name="from_year_edit"
                label="Năm bắt đầu"
              />
            </Grid>
            <Grid item xs={6}>
              <ControlTextField
                control={control}
                name="to_year_edit"
                label="Năm kết thúc"
              />
            </Grid>

            {/* <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="favorite_subject_edit"
                label="Môn học yêu thích"
              />
            </Grid> */}
          </Grid>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'end'
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(editModal)}
            >
              Sửa
            </Button>
          </Box>
        </Stack>
      </Dialog>
    </Box>
  );
};

export default EduInfoUser;

const findName = (id, school) => {
  console.log(id);
  console.log(school);

  if (id) {
    const haha = school.find((item) => item.id === id);

    if (haha) {
      return haha.name;
    }
  }
};
