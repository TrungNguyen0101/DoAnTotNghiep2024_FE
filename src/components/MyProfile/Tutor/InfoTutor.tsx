import ControlTextField from '@/components/ControlTextField';
import { Box, Button, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormDataHaha } from './ProfileTutor';
import api from '@/api';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { VerifyIcon } from '@/components/icons';

const defaultValues = {
  balance: '',
  // stripe_account_id: '',
  description: ''
};

const InfoTutor = ({ data }) => {
  const { handleSubmit, control, setValue } = useForm<FormDataHaha>({
    defaultValues
  });

  const handleSaveTutorInfo = useCallback(
    async (value) => {
      if (data) {
        try {
          const payload = {
            // stripe_account_id: value.stripe_account_id,
            balance: value.balance,
            description: value.description
          };
          const res = await api.put(
            `/tutor/${data?.tutor_profile_id}`,
            payload
          );
          if (res.status === 200) {
            enqueueSnackbar({
              message: 'Cập nhật thông tin gia sư thành công',
              variant: 'success'
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [data]
  );

  useEffect(() => {
    if (data) {
      setValue('balance', data.balance || '');
      // setValue('stripe_account_id', data.stripe_account_id || '');
      setValue('description', data.description || '');
    }
  }, [data]);

  return (
    <Box>
      <h3>Thông tin gia sư</h3>
      <Box>
        {/* <ControlTextField
          control={control}
          name="stripe_account_id"
          label="Tài khoản ngân hàng"
          textfieldProps={{
            InputProps: {
              endAdornment: (
                <InputAdornment sx={{ mx: 0 }} position="start">
                  {Boolean(Number(data.is_stripe_verified)) && (
                    <VerifyIcon
                      sx={{
                        color: '#4caf50'
                      }}
                    />
                  )}
                </InputAdornment>
              )
            }
          }}
        /> */}
        <ControlTextField
          preventInput={true}
          control={control}
          name="balance"
          label="Số dư"
        />
        <ControlTextField
          control={control}
          name="description"
          label="Mô tả về bản thân"
          textfieldProps={{
            multiline: true,
            rows: 5
          }}
        />

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
            onClick={handleSubmit(handleSaveTutorInfo)}
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoTutor;
