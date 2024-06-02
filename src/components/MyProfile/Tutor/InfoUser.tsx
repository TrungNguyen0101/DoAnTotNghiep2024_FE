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
import { memo, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Upload } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const defaultValues = {
  last_name: '',
  first_name: '',
  email: '',
  phone_number: '',
  gender: 'female'
};

const InfoUser = ({ data, id }) => {
  const { handleSubmit, control, setValue } = useForm<FormDataHaha>({
    defaultValues
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSaveInfo = async (data) => {
    try {
      console.log('handleSaveInfo ~ data:', data);
      const res = await api.put(`/user/update-user-info/${id}`, {
        ...data,
        avatar_url: fileList[0].url
      });
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'Cập nhật thông tin tài khoản thành công',
          variant: 'success',
          autoHideDuration: 1500
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
      if (data?.avatar_url) {
        setFileList([
          {
            url: data?.avatar_url
          }
        ]);
      }
    }
  }, [data]);

  const handleRemove = (e) => {
    const index = fileList?.findIndex((f) => f?.uid === e?.uid);
    const copyList = fileList.slice();
    copyList.splice(index, 1);
    setFileList([...copyList]);
    if (copyList.length === 0) {
    }
  };

  const uploadProfileImg = async (formData) => {
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dsrvia1wu/image/upload',
        formData
      );
      const { url, asset_id, etag } = res.data;
      return { url, asset_id, etag };
    } catch (err) {
      console.log(err);
    }
  };

  const upLoadImage = async (e) => {
    try {
      if (e.file) {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', e.file);
        formData.append('upload_preset', 'nguyenGMO');
        const image = await uploadProfileImg(formData);

        /* etag : check image upload trùng nếu cần */
        setFileList((prevImagePaths) => [
          ...prevImagePaths,
          {
            url: image?.url
          }
        ]);
        setLoading(false); // Tải lên hoàn thành
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box component="form">
      <h3>Thông tin tài khoản</h3>
      <Box>
        <ControlTextField
          control={control}
          name="first_name"
          label={`${data?.type === '1' ? 'Tên học sinh' : 'Tên gia sư'}`}
        />
        <ControlTextField
          control={control}
          name="last_name"
          label={`${data?.type === '1' ? 'Họ học sinh' : 'Họ gia sư'}`}
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

        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          maxCount={1}
          // onPreview={handlePreview}
          // beforeUpload={beforeUpload}
          onRemove={(e) => handleRemove(e)}
          customRequest={(e) => upLoadImage(e)}
          showUploadList={{ showPreviewIcon: false }}
        >
          {fileList.length >= 1 ? null : (
            <div>
              {loading ? (
                <LoadingOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ) : (
                <PlusOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              )}
              <div
                style={{
                  marginTop: 8
                }}
              >
                Upload
              </div>
            </div>
          )}
        </Upload>

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
