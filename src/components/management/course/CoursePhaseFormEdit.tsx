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
  name: string;
  content: string;
  overview_url: string;
};

const defaultValues = {
  name: '',
  content: '',
  overview_url: ''
};

function CoursePhaseFormEdit({ isOpen, onClose, data, setCount }) {
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues
  });

  useEffect(() => {
    if (data) {
      setValue('name', data.name);
      setValue('content', data.content);
      setValue('overview_url', data.overview_url);
    }
  }, [data]);

  const onSave = async (value) => {
    const payload = {
      course_program_id: data.course_program_id,
      ...value
    };

    const res = await api.put(
      `/course-program/phase/${data.course_program_phase_id}`,
      payload
    );
    if (res.status === 200) {
      enqueueSnackbar({
        message: 'Sửa chương thành công',
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
        <ControlTextField control={control} name="name" label="Tiêu đề" />
        <ControlTextField control={control} name="content" label="Nội dung" />
        <ControlTextField
          control={control}
          name="overview_url"
          label="Link bài học"
        />
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

export default CoursePhaseFormEdit;
