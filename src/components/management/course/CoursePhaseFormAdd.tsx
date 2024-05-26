import api from '@/api';
import ControlTextField from '@/components/ControlTextField';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
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

function CoursePhaseFormAdd({ isOpen, onClose, data, setCount }) {
  const { control, handleSubmit, resetField } = useForm<FormData>({
    defaultValues
  });
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [selectedOption, setSelectedOption] = useState('1');

  const onSave = async (value) => {
    const payload = {
      course_program_id: data.course_program_id,
      ...value
    };
    payload.type_video = selectedOption;
    if (selectedOption !== '1') {
      payload.overview_url = videoURL;
    }
    if (payload?.overview_url && payload?.name) {
      console.log('onSave ~ payload:', payload);
      const res = await api.post('/course-program/phase/', payload);
      if (res.status === 200) {
        enqueueSnackbar({
          message: 'thêm chương thành công',
          variant: 'success'
        });
        setCount((prev) => prev + 1);
        onClose();
        resetField('name');
        resetField('content');
        resetField('overview_url');
      }
    } else {
      enqueueSnackbar({
        message: 'Vui lòng điền đầy đủ',
        variant: 'error',
        autoHideDuration: 1500
      });
    }
  };

  useEffect(() => {
    resetField('name');
    resetField('content');
    resetField('overview_url');
    setVideoURL('');
    setLoading(false);
  }, [isOpen]);

  const uploadProfileImg = async (formData) => {
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dsrvia1wu/video/upload',
        formData
      );
      console.log('uploadProfileImg ~ res:', res);
      const { url, asset_id, etag } = res.data;
      return { url, asset_id, etag };
    } catch (err) {
      console.log(err);
    }
  };
  /* Upload image with local */
  const upLoadImage = async (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('upload_preset', 'nguyenGMO');
        const image = await uploadProfileImg(formData);
        setVideoURL(image.url);
        setLoading(false); // Tải lên hoàn thành
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUploadVideo = (e) => {
    upLoadImage(e);
  };

  const handleChange = (event) => {
    setSelectedOption(event?.target?.value);
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
        <ControlTextField control={control} name="name" label="Tiêu đề" />
        <ControlTextField control={control} name="content" label="Nội dung" />

        <>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Trạng thái video
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selectedOption}
            onChange={handleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="Công khai" />
            <FormControlLabel value="2" control={<Radio />} label="Riêng tư" />
          </RadioGroup>
        </>
        {selectedOption === '1' ? (
          <ControlTextField
            control={control}
            name="overview_url"
            label="Link bài học"
          />
        ) : (
          <div>
            {!loading && !videoURL ? (
              <>
                <input
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="upload-video"
                  type="file"
                  onChange={handleUploadVideo}
                />
                <label htmlFor="upload-video">
                  <Button variant="contained" component="span">
                    Upload Video
                  </Button>
                </label>
              </>
            ) : (
              <>
                {videoURL ? (
                  <video width="400" controls>
                    <source src={videoURL} type="video/mp4" />
                  </video>
                ) : (
                  <CircularProgress color="secondary" />
                )}
              </>
            )}
          </div>
        )}
        {/* {loading && <CircularProgress color="secondary" />} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="submit" color="primary" variant="contained">
          Lưu
        </Button>
        {/* <Button type="button" color="primary" variant="contained" onClick={}>
          Test
        </Button> */}
        {/* <input
          accept="video/*"
          // style={{ display: 'none' }}
          id="upload-video"
          type="file"
          onChange={upLoadImage}
        /> */}

        {/* <div>
          <input
            accept="video/*"
            style={{ display: 'none' }}
            id="upload-video"
            type="file"
            onChange={handleUploadVideo}
          />
          <label htmlFor="upload-video">
            <Button variant="contained" component="span">
              Upload Video
            </Button>
          </label>
        </div> */}
      </DialogActions>
    </Dialog>
  );
}

export default CoursePhaseFormAdd;
