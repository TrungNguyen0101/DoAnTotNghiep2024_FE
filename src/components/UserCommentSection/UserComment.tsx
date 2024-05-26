import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LikeIcon from '../icons/LikeIcon';
import ReplyIcon from '../icons/ReplyIcon';
import SendCommentTextFiled from './SendCommentTextFiled';
import AppRating from '../AppRating';
import api from '@/api';
const UserComment = ({ data, onCommentReply, commentRely }) => {
  const { handleSubmit, control } = useForm();

  const handleSubmitForm = (comment) => {
    console.log(comment);
  };
  const [name, setName] = useState<string>('')

  useEffect(()=>  {
    const fetchData = async () => {
      const res = await api.get(`/user/get-user-info/${data.user_id}`)
      if(res.status == 200) {
        setName(res.data.data.first_name + ' ' + res.data.data.last_name)
      }
    }
    fetchData()
  }, [data])

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleSubmitForm)}
      width="100%"
    >
      <Stack direction="row" spacing={4} p="20px">
        <Avatar src="/static/images/avatars/3.jpg" />
        <Stack width="70%">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight={500}>
              {name || 'Người dùng'}
            </Typography>
            <Typography variant="h5" fontWeight={500} color="secondary">
              đã đánh giá
            </Typography>
            {/* <AppRating readOnly value={data.rating} /> */}
          </Stack>
          <Typography variant="h5" fontWeight={400} mt={2}>
            {data?.content || 'Gia sư đẳng cấp quốc tế'}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          color="text.secondary"
        >
          <Button
            sx={{ minHeight: '42px', minWidth: 120, p: 1 }}
            variant="outlined"
          >
            <LikeIcon />
            &nbsp; Hữu ích
          </Button>
          <Button
            sx={{ minHeight: '42px', minWidth: 120, p: 1 }}
            variant="outlined"
          >
            Bình luận
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(UserComment);
