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
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const validationSchema = yup.object({
  name: yup.string().required('Tên khóa học không được trống'),
  description: yup.string().nullable()
});

const steps = ['Thông tin cơ bản', 'Chi tiết nội dung', 'Chi tiết bài học'];

function CourseForm({ isOpen, onClose, data, onSave }) {
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

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleReset = () => {
    setActiveStep(0);
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
              width: '700px'
            }}
          >
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {activeStep === 0 && (
                  <FormGroup sx={{ mt: 2, mb: 1 }}>
                    <TextField
                      id="name"
                      label="Tiêu đề"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('name')}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                      id="description"
                      label="Mô tả"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('description')}
                    />
                    <TextField
                      id="price"
                      label="Học phí"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('price')}
                    />
                    <TextField
                      id="spend_time"
                      label="Số giờ/buổi"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('spend_time')}
                    />
                  </FormGroup>
                )}

                {activeStep === 1 && (
                  <FormGroup sx={{ mt: 2, mb: 1 }}>
                    <TextField
                      id="tittle"
                      label="Tiêu đề"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('tittle')}
                      error={
                        formik.touched.tittle && Boolean(formik.errors.tittle)
                      }
                      helperText={formik.touched.tittle && formik.errors.tittle}
                    />

                    <TextField
                      id="description"
                      label="Mô tả"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('description')}
                    />
                  </FormGroup>
                )}

                {activeStep === 2 && (
                  <FormGroup sx={{ mt: 2, mb: 1 }}>
                    <TextField
                      id="name"
                      label="Tiêu đề"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('name')}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                      id="description"
                      label="Mô tả"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('description')}
                    />
                    <TextField
                      id="content"
                      label="Nội dung"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('content')}
                    />
                    <TextField
                      id="content"
                      label="Link Over View"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      {...formik.getFieldProps('overview_url')}
                    />
                  </FormGroup>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )}
                  <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
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

export default CourseForm;
