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

type FormData = {
  name: string;
  organization: string;
  award_url: string;

  name_edit: string;
  organization_edit: string;
  award_url_edit: string;
};

const defaultValues = {
  name: '',
  organization: '',
  award_url: '',

  name_edit: '',
  organization_edit: '',
  award_url_edit: ''
};

const CerInfo = ({ data }) => {
  const { handleSubmit, control, resetField, setValue } = useForm<FormData>({
    defaultValues
  });
  const [tutorCer, setTutorCer] = useState<any>([]);

  const [open, setOpen] = useState(0);

  const editModal = (value) => {
    setTutorCer((prev) => {
      const newArr = [...prev];
      newArr[open - 1] = {
        name: value.name_edit,
        organization: value.organization_edit,
        award_url: value.award_url_edit,
        tutor_profile_id: data.tutor_profile_id
      };
      return newArr;
    });
    resetField('name_edit');
    resetField('organization_edit');
    resetField('award_url_edit');
    setOpen(0);
  };

  useEffect(() => {
    if (data) {
      setTutorCer(
        data?.tutor_certifications?.map((item) => {
          return {
            name: item.name,
            organization: item.organization,
            award_url: item.award_url,
            tutor_profile_id: data.tutor_profile_id
          };
        })
      );
    }
  }, [data]);

  const addCer = (data) => {
    const payload = {
      name: data.name,
      organization: data.organization,
      award_url: data.award_url,
      tutor_profile_id: data.tutor_profile_id
    };
    setTutorCer((prev) => [payload, ...prev]);
    resetField('award_url');
    resetField('organization');
    resetField('name');
  };

  const handleSaveCertificate = async () => {
    try {
      const res = await api.put(
        `/tutor/update-tutor-certifications/${data?.tutor_profile_id}`,
        tutorCer
      );
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật chứng chỉ gia sư thành công',
          variant: 'success'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCer = (index) => {
    const newArray = [...tutorCer];
    newArray.splice(index, 1);
    setTutorCer(newArray);
  };
  return (
    <Box component="form">
      <h3>Thông tin chứng chỉ</h3>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlTextField control={control} name="name" label="Chứng chỉ" />
        </Grid>

        <Grid item xs={12}>
          <ControlTextField control={control} name="organization" label="Năm" />
        </Grid>
        <Grid item xs={12}>
          <ControlTextField
            control={control}
            name="award_url"
            label="Đường dẫn chứng chỉ"
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
          onClick={handleSubmit(addCer)}
        >
          Thêm mới
        </Button>
      </Box>

      <Divider sx={{ mt: 4 }} />
      {/* {tutorCer.map((x, i) => (
        <Box mt={2} key={i}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">{x?.name}</Typography>
              <Typography mt={2} variant="subtitle2">
                {x?.organization}
              </Typography>
              <Typography variant="subtitle2">{x?.award_url}</Typography>
            </Box>
            <Stack alignItems="center">
              <Button
                onClick={() => {
                  setValue('name_edit', x.name);
                  setValue('organization_edit', x.organization);
                  setValue('award_url_edit', x?.award_url);
                  setOpen(i + 1);
                }}
              >
                Sửa
              </Button>
              <Button onClick={() => deleteCer(i)}>Xoá</Button>
            </Stack>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))} */}

      {/* {Boolean(tutorCer.length) && (
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
            onClick={handleSaveCertificate}
          >
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
                name="name_edit"
                label="Chứng chỉ"
              />
            </Grid>

            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="organization_edit"
                label="Năm"
              />
            </Grid>
            <Grid item xs={12}>
              <ControlTextField
                control={control}
                name="award_url_edit"
                label="Đường dẫn chứng chỉ"
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

export default CerInfo;
