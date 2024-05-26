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

type FormDataExp = {
  start_time: string;
  end_time: string;
  organization: string;
  position: string;
  description_tutor_experiences: string;

  start_time_edit: string;
  end_time_edit: string;
  organization_edit: string;
  position_edit: string;
  description_tutor_experiences_edit: string;
};

const defaultValues = {
  start_time: '',
  end_time: '',
  organization: '',
  position: '',
  description_tutor_experiences: '',

  start_time_edit: '',
  end_time_edit: '',
  organization_edit: '',
  position_edit: '',
  description_tutor_experiences_edit: ''
};

const ExpInfo = ({ data }) => {
  const { handleSubmit, control, resetField, setValue } = useForm<FormDataExp>({
    defaultValues
  });
  const [tutorExp, setTutorExp] = useState([]);
  const [open, setOpen] = useState(0);

  const editModal = (value) => {
    setTutorExp((prev) => {
      const newArr = [...prev];
      newArr[open - 1] = {
        start_time: value.start_time_edit,
        end_time: value.end_time_edit,
        organization: value.organization_edit,
        position: value.position_edit,
        description: value.description_tutor_experiences_edit,
        tutor_profile_id: data.tutor_profile_id
      };
      return newArr;
    });
    resetField('start_time_edit');
    resetField('end_time_edit');
    resetField('organization_edit');
    resetField('position_edit');
    resetField('description_tutor_experiences_edit');
    setOpen(0);
  };

  useEffect(() => {
    if (data) {
      setTutorExp(
        data?.tutor_experiences?.map((item) => {
          return {
            organization: item.organization,
            start_time: item.start_time,
            end_time: item.end_time,
            position: item.position,
            description: item.description,
            tutor_profile_id: data.tutor_profile_id
          };
        })
      );
    }
  }, [data]);

  const addExp = (value) => {
    const payload = {
      organization: value.organization,
      position: value.position,
      start_time: value.start_time,
      end_time: value.end_time,
      description: value.description_tutor_experiences,
      tutor_profile_id: data.tutorId
    };
    setTutorExp((prev) => [payload, ...prev]);
    resetField('organization');
    resetField('position');
    resetField('start_time');
    resetField('end_time');
    resetField('description_tutor_experiences');
  };

  const handleSaveExperience = async () => {
    try {
      const res = await api.put(
        `/tutor/update-tutor-experience/${data?.tutor_profile_id}`,
        tutorExp
      );
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật kinh nghiệm thành công',
          variant: 'success'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExp = (index) => {
    const newArray = [...tutorExp];
    newArray.splice(index, 1);
    setTutorExp(newArray);
  };

  return (
    <Box component="form">
      <h3>Thông tin kinh nghiệm</h3>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="organization"
            label="Công ty đang làm việc"
          />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField control={control} name="position" label="Vị trí" />
        </Grid>

        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="start_time"
            label="Thời gian bắt đầu"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlTextField
            control={control}
            name="end_time"
            label="Thời gian kết thúc"
          />
        </Grid>

        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="description_tutor_experiences"
            label="Mô tả công việc"
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
          onClick={handleSubmit(addExp)}
        >
          Thêm mới
        </Button>
      </Box>

      {tutorExp?.map((x, i) => (
        <Box mt={2} key={i}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">{x?.organization}</Typography>
              <Typography mt={2} variant="h6">
                {x?.start_time} - {x?.end_time || 'Hiện tại'}
              </Typography>
              <Typography variant="subtitle2">{x?.position}</Typography>
              <Typography variant="subtitle2">{x?.description}</Typography>
            </Box>
            <Stack alignItems="center">
              <Button
                onClick={() => {
                  setValue('start_time_edit', x.start_time);
                  setValue('end_time_edit', x.end_time);
                  setValue('description_tutor_experiences_edit', x.description);
                  setValue('organization_edit', x?.organization);
                  setValue('position_edit', x?.position);
                  setOpen(i + 1);
                }}
              >
                Sửa
              </Button>
              <Button onClick={() => deleteExp(i)}>Xoá</Button>
            </Stack>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      {Boolean(tutorExp.length) && (
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
            onClick={handleSaveExperience}
          >
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
                name="organization_edit"
                label="Công ty đang làm việc"
              />
            </Grid>
            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="position_edit"
                label="Vị trí"
              />
            </Grid>

            <Grid item xs={6}>
              <ControlTextField
                control={control}
                name="start_time_edit"
                label="Thời gian bắt đầu"
              />
            </Grid>
            <Grid item xs={6}>
              <ControlTextField
                control={control}
                name="end_time_edit"
                label="Thời gian kết thúc"
              />
            </Grid>

            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="description_tutor_experiences_edit"
                label="Mô tả công việc"
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

export default ExpInfo;
