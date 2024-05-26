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
const EduInfo = ({ data }) => {
  const { handleSubmit, control, resetField, setValue } = useForm<FormDataEdu>({
    defaultValues
  });
  const [tutorEdu, setTutorEdu] = useState<any>([]);
  const [open, setOpen] = useState(0);

  const editModal = (value) => {
    setTutorEdu((prev) => {
      const newArr = [...prev];
      newArr[open - 1] = {
        school: value.school_id_edit,
        score_url: value.score_url_edit,
        from_year: value.from_year_edit,
        to_year: value.to_year_edit,
        favorite_subject: value.favorite_subject_edit,
        tutor_profile_id: data.tutor_profile_id
      };
      return newArr;
    });
    resetField('school_id_edit');
    resetField('score_url_edit');
    resetField('from_year_edit');
    resetField('to_year_edit');
    resetField('favorite_subject_edit');
    setOpen(0);
  };

  useEffect(() => {
    if (data) {
      setTutorEdu(
        data?.tutor_educations?.map((item) => {
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

  const addEdu = (value) => {
    const payload = {
      school: value.school,
      from_year: value.from_year,
      to_year: value.to_year,
      score_url: value.score_url,
      favorite_subject: value.favorite_subject
    };
    setTutorEdu((prev) => [payload, ...prev]);
    resetField('school');
    resetField('from_year');
    resetField('to_year');
    resetField('score_url');
    resetField('favorite_subject');
  };

  const handleSaveEdu = async () => {
    try {
      const res = await api.put(
        `/tutor/update-tutor-educations/${data.tutor_profile_id}`,
        tutorEdu
      );
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật học vấn gia sư thành công',
          variant: 'success'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEdu = (index) => {
    const newArray = [...tutorEdu];
    newArray.splice(index, 1);
    setTutorEdu(newArray);
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
            label="Tên trường Đại Học"
          />
        </Grid>

        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="score_url"
            label="Bằng tốt nghiệp"
          />
        </Grid>

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

        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="favorite_subject"
            label="Môn học yêu thích"
          />
        </Grid>
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
          onClick={handleSubmit(addEdu)}
        >
          thêm mới
        </Button>
      </Box>

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
                  setValue('score_url_edit', x.score_url);
                  setValue('from_year_edit', x.from_year);
                  setValue('to_year_edit', x?.to_year);
                  setValue('favorite_subject_edit', x?.favorite_subject);
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

      {Boolean(tutorEdu.length) && (
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
      )}

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

            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="score_url_edit"
                label="Bằng tốt nghiệp"
              />
            </Grid>

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

            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="favorite_subject_edit"
                label="Môn học yêu thích"
              />
            </Grid>
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

export default EduInfo;

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
