import ControlTextField from '@/components/ControlTextField';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { FormDataHaha } from './ProfileTutor';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import api from '@/api';
import { useRouter } from 'next/router';
import { memo, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const defaultValues = {
  last_name: '',
  first_name: '',
  email: '',
  password: '',
  phone_number: '',
  gender: 'female'
};

const InfoUser = ({ data, id }) => {
  const { handleSubmit, control, setValue } = useForm<FormDataHaha>({
    defaultValues
  });

  const handleSaveInfo = async (data) => {
    try {
      const res = await api.put(`/user/update-user-info/${id}`, data);
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật thông tin tài khoản thành công',
          variant: 'success'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      setValue('first_name', data.first_name);
      setValue('last_name', data.last_name || '');
      setValue('email', data.email);
      setValue('phone_number', data.phone_number || '');
      setValue('gender', data.gender || 'female');
    }
  }, [data]);

  return (
    <Box component="form">
      <h3>Thông tin tài khoản</h3>
      <Box>
        <ControlTextField
          control={control}
          name="first_name"
          label="Tên gia sư"
        />
        <ControlTextField
          control={control}
          name="last_name"
          label="Họ gia sư"
        />
        <ControlTextField control={control} name="email" label="email" />
        <ControlTextField
          control={control}
          name="phone_number"
          label="Số điện thoại"
        />
        <Box sx={{ mt: 3 }}>
          <FormControl>
            <FormLabel>Giới tính</FormLabel>

            <Controller
              rules={{ required: true }}
              control={control}
              name="gender"
              defaultValue="female"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'end'
          }}
        >
          <Button
            onClick={handleSubmit(handleSaveInfo)}
            color="primary"
            variant="contained"
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(InfoUser);
