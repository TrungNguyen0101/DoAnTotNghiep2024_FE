import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

type FormData = {
  tittle: string;
  description: string;
};

const defaultValues = {
  tittle: '',
  description: ''
};

function CourseProgramFormAdd({ isOpen, onClose, data, setCount }) {
  const { control, handleSubmit, resetField } = useForm<FormData>({
    defaultValues
  });
  const onSave = async (value) => {
    const payload = {
      course_id: data.course_id,
      ...value
    };
    const res = await api.post('/course-program/', payload);
    if (res.status === 200) {
      enqueueSnackbar({
        message: 'thêm bài thành công',
        variant: 'success'
      });
      setCount((prev) => prev + 1);
      onClose();
      resetField('tittle');
      resetField('description');
    }
  };

  return (
    <Dialog
      component="form"
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSave)}
      maxWidth={'lg'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {data?.course_program_id
          ? 'Chỉnh sửa chương học'
          : 'Thêm mới chương học'}
      </DialogTitle>
      <DialogContent
        sx={{
          width: '572px'
        }}
      >
        <ControlTextField control={control} name="tittle" label="Tiêu đề" />
        <ControlTextField control={control} name="description" label="Mô tả" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="submit" color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CourseProgramFormAdd;
