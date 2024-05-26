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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  tittle: string;
  description: string;
};

const defaultValues = {
  tittle: '',
  description: ''
};

function CourseProgramFormEdit({ isOpen, onClose, data, setCount }) {
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues
  });

  useEffect(() => {
    if (data) {
      setValue('tittle', data.tittle);
      setValue('description', data.description);
    }
  }, [data]);

  const onSave = async (value) => {
    const payload = {
      course_id: data.course_id,
      ...value
    };
    const res = await api.put(
      `/course-program/${data.course_program_id}`,
      payload
    );
    if (res.status === 200) {
      enqueueSnackbar({
        message: 'Sửa bài thành công',
        variant: 'success'
      });
      setCount((prev) => prev + 1);
      onClose();
    }
  };

  return (
    <Dialog
      component="form"
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSave)}
      maxWidth={'lg'}
    >
      <DialogTitle id="alert-dialog-title">
        {data?.course_program_id ? 'Chỉnh sửa bài học' : 'Thêm mới bài học'}
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

export default CourseProgramFormEdit;
