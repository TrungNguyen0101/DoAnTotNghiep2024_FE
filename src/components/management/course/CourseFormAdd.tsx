import api from '@/api';
import { CloudUpload } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { Typography } from 'antd';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  noSpin: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  }
});
const validationSchema = yup.object({
  name: yup.string().required('Tên danh mục không được trống'),
  description: yup.string().nullable()
});

function CourseFormAdd({ isOpen, onClose, data, onSave }) {
  console.log('CourseFormAdd ~ data:', data);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  // const [fileUrl, setFileUrl] = useState(data?.image_url);
  const [selectedImageUrl, setSelectedImagUrl] = useState<any>(data?.image_url);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showField, setShowField] = useState<any>(false);
  const classes = useStyles();

  const getCategory = () => {
    api.get('/category').then((res) => {
      setCategoryList(res.data.data);
    });
  };
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (data?.image_url) {
      setSelectedImagUrl(data?.image_url);
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      ...data,
      image_url: selectedImage
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('CourseFormAdd ~ values:', values);
      const { category_id, description, name, type_course } = values;

      if (!category_id || !description || !name || !type_course) {
        enqueueSnackbar({
          message: 'Vui lòng nhập đầy đủ các trường!',
          variant: 'error',
          autoHideDuration: 1500
        });
      } else {
        onSave({ ...data, ...values, image_url: selectedImage });
      }
      if (!formik.isValid) {
        enqueueSnackbar({
          message: 'Vui lòng kiểm tra lại các trường nhập!',
          variant: 'error'
        });
        return;
      }
    }
  });

  // const handleUploadFile = async (e) => {
  //   var formData = new FormData();
  //   formData.append('file', e.target.files[0]);
  //   const res = await api.post('upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });

  //   enqueueSnackbar({
  //     message: 'Tải file thành công!',
  //     variant: 'success'
  //   });

  //   setFileUrl(res.data?.data?.file);
  // };

  const handleChangeImage = (events: any) => {
    const filelist = events.target.files;
    if (filelist) {
      const file = filelist[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImagUrl(imageUrl);
      setSelectedImage(filelist[0]);
    }
  };

  return (
    <div>
      <form>
        <Dialog
          open={isOpen}
          onClose={onClose}
          maxWidth={'lg'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {data?.category_id ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
          </DialogTitle>
          <DialogContent
            sx={{
              width: '572px'
            }}
          >
            <FormGroup sx={{ mt: 2, mb: 1 }}>
              <>
                {selectedImageUrl ? (
                  <div>
                    <img
                      src={selectedImageUrl}
                      alt="Uploaded"
                      style={{ maxWidth: '100%', marginTop: '10px' }}
                    />
                    <Button
                      component="label"
                      variant="contained"
                      onClick={() => {
                        setSelectedImagUrl('');
                      }}
                    >
                      Delete Image
                    </Button>
                  </div>
                ) : (
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUpload />}
                    style={{ marginLeft: '10px' }}
                  >
                    Upload Image
                    <input
                      type="file"
                      name="image_url"
                      onChange={(e) => {
                        handleChangeImage(e);
                      }}
                      style={{ display: 'none' }}
                    />
                  </Button>
                )}
              </>
              <TextField
                id="name"
                label="Tiêu đề"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && typeof formik.errors.name === 'string'
                    ? formik.errors.name
                    : ''
                }
              />

              {/* <Box mt={2}>
                <input type="file" onChange={(e) => handleUploadFile(e)} />
              </Box> */}

              <TextField
                id="description"
                label="Mô tả"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('description')}
              />

              {showField && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: '30px'
                  }}
                >
                  <TextField
                    id="price"
                    label="Học phí"
                    variant="standard"
                    fullWidth
                    type="number"
                    margin="normal"
                    style={{ marginBottom: 20 }}
                    className={classes.noSpin}
                    {...formik.getFieldProps('price')}
                  />
                  <TextField
                    id="hour"
                    label="Tổng giờ học (h)"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    type="number"
                    style={{ marginBottom: 20 }}
                    className={classes.noSpin}
                    {...formik.getFieldProps('hour')}
                  />
                </div>
              )}
              <div style={{ width: '100%', marginBottom: 20 }}>
                <Typography>Loại khóa học</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Loại khóa học"
                  value={formik.values.type_course} // Sử dụng value từ Formik
                  style={{ width: '100%' }}
                  {...formik.getFieldProps('type_course')}
                >
                  <MenuItem
                    key={'true'}
                    value={'true'}
                    onClick={() => {
                      setShowField(true);
                    }}
                  >
                    Tốn phí
                  </MenuItem>
                  <MenuItem
                    key={'false'}
                    value={'false'}
                    onClick={() => {
                      setShowField(false);
                    }}
                  >
                    Miễn phí
                  </MenuItem>
                </Select>
              </div>
              {/* <TextField
                id="spend_time"
                label="Số giờ/buổi"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('spend_time')}
              /> */}

              <div style={{ width: '100%' }}>
                <Typography>Loại danh mục</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Loại danh mục"
                  {...formik.getFieldProps('category_id')}
                  style={{ width: '100%' }}
                >
                  {categoryList?.map((item) => {
                    return (
                      <MenuItem key={item.category_id} value={item.category_id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={formik.submitForm}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

export default CourseFormAdd;
