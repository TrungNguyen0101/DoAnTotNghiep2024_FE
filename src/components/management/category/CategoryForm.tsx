import { CloudUpload } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Tên danh mục không được trống'),
  description: yup.string().nullable()
});

function CategoryForm({ isOpen, onClose, data, onSave }) {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedImageUrl, setSelectedImagUrl] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      ...data
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!formik.isValid) {
        return;
      }

      onSave({ ...data, ...values, image_url: selectedImage });
    }
  });
  useEffect(() => {
    if (data?.image_url) {
      setSelectedImagUrl(data?.image_url);
    }
  }, [data]);

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
            {data?.category_id ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
          </DialogTitle>
          <DialogContent
            sx={{
              width: '572px'
            }}
          >
            <FormGroup>
              <TextField
                id="name"
                label="Tiêu đề"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={(formik.touched.name && formik.errors.name) as any}
              />

              <TextField
                id="description"
                label="Mô tả"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('description')}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  (formik.touched.description &&
                    formik.errors.description) as any
                }
              />

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

              {/* <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              /> */}
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

export default CategoryForm;
