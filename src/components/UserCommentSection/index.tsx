import { Avatar, Box, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SendCommentTextFiled from './SendCommentTextFiled';
import UserComment from './UserComment';
import api from '@/api';
import { jwtDecode } from 'jwt-decode';
import Snackbar from '@mui/material/Snackbar';

const UserCommentSection = ({id}) => {

  
  const { handleSubmit, control, reset } = useForm();
  const [commentRely, setCommentRely] = useState<any>(null);
  const [dataList, setDataList] = useState<any>([])
  const [checkAdd, setAdd] = useState<boolean>(false)



  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await api.get(`/tutor/${id}`);
        if(resUser.status == 200) {
            const response = await api.get(`/comment/${resUser.data.data.user.user_id}`);
            if(response.status == 200) {
              setDataList(response.data?.data);
            }
        }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [id,checkAdd])
  const handleSubmitForm = async ({comment}) => {
    const token = localStorage.getItem('access_token');
    if(!token) {
      handleClick();
    } else {
      const decoded = jwtDecode<any>(token);
      if(id) {
        const resUser = await api.get(`/tutor/${id}`);
          if(resUser.status == 200) {
            const res = await api.post('/comment/create', {
              content: comment,
              author_id: resUser.data.data.user.user_id,
              user_id: decoded?.user_id
            });
            if(res.status == 200) {
              reset();
              setAdd(!checkAdd)
          }
       
      } else {
        console.log('error')
      }
      }
    }
  

 

    
    
  };

  const handleCommentReply = useCallback(
    (comment?: any) => {
      if (comment) {
        if (commentRely?.id === comment?.id) {
          setCommentRely(null);
        } else {
          setCommentRely(comment);
        }
        return;
      }
      setCommentRely(null);
    },
    [commentRely]
  );

  return (
    <Grid container mt={10}>
      <Grid
        borderBottom="1px solid "
        borderColor="grey.300"
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
      >
        <Typography pb={1} variant="h2" lineHeight="32px">
          Bình luận
        </Typography>
      </Grid>
      <Grid
        component="form"
        onSubmit={handleSubmit(handleSubmitForm)}
        display="flex"
        flexDirection="row"
        gap="30px"
        alignItems="center"
        item
        xs={12}
        mt={2.8}
        mb={2.8}
        pl={2.8}
      >
        <Avatar src="/static/images/avatars/1.jpg" />

        <SendCommentTextFiled
          control={control}
          name="comment"
          variant="outlined"
        />
      </Grid>

      { dataList.length > 0 ?
        dataList.map((item) => (
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="row"
            gap="64px"
            border="1px solid"
            borderColor="grey.300"
            borderRadius="12px"
            mb={2.8}
            key={item.id}
          >
            <UserComment
              data={item}
              commentRely={commentRely}
              onCommentReply={handleCommentReply}
            />
          </Grid>
      )) : <Grid
          item
          xs={12}
          display="flex"
          flexDirection="row"
          gap="64px"
          border="1px solid"
          borderColor="grey.300"
          borderRadius="12px"
          mb={2.8}
        >
      
      </Grid>}

    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message="Bạn cần đăng nhập để đánh giá và bình luận"
    />

    </Grid>
  );
};

export default UserCommentSection;
