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
import React from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({});

function TutorDateForm({ isOpen, onClose, data, onSave }) {
  const formik = useFormik({
    initialValues: {
      ...data
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!formik.isValid) {
        return;
      }

      onSave({ ...data, ...values });
    }
  });

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
          <DialogTitle id="alert-dialog-title">{'Thêm mới lich'}</DialogTitle>
          <DialogContent
            sx={{
              width: '572px'
            }}
          >
            <FormGroup>
              <TextField
                id="name"
                label="Bat dau"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('start_time')}
                error={
                  formik.touched.start_time && Boolean(formik.errors.start_time)
                }
                helperText={
                  formik.touched.start_time && formik.errors.start_time
                }
              />

              <TextField
                id="description"
                label="Ket thuc"
                variant="standard"
                fullWidth
                margin="normal"
                {...formik.getFieldProps('end_time')}
                error={
                  formik.touched.end_time && Boolean(formik.errors.end_time)
                }
                helperText={formik.touched.end_time && formik.errors.end_time}
              />
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

export default TutorDateForm;
