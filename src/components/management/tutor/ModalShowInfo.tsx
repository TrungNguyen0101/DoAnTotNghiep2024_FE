import React, { memo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Theme } from '@mui/material/styles';

interface IStyleProps {
  [x: string]: SxProps<Theme>;
}

interface IModalManage {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  firstName: string;
  lastName?: string;
  gender?: number;
  phone: string;
  email: string;
  avatar: string;
  description: string;
  company?: string;
  subject: string;
}

const ModalShowInfo: React.FC<IModalManage> = ({
  setOpen,
  open,
  gender,
  email,
  phone,
  firstName,
  lastName,
  avatar,
  description,
  company,
  subject
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const GenderFormatter = (value) => {
    const formattedGender = value === 0 ? 'Nữ' : 'Nam';
    return formattedGender;
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Stack sx={style.flex}>
        <Stack sx={style.top}>
          <Avatar
            src={avatar}
            sx={{
              width: 140,
              height: 140,
              position: 'absolute',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100%',
              left: '50%',
              right: '50%',
              top: '100%',
              transform: 'translate(-50%,-50%)'
            }}
          />
        </Stack>
        <Stack sx={style.bottom}>
          <Box sx={style.contentTop}>
            <Typography fontSize={25} color={'#459D7AFF'} fontWeight={600}>
              {firstName} {lastName && lastName}
            </Typography>
          </Box>
          <Stack sx={style.contentBottom}>
            <Typography
              fontSize={20}
              color={'#459D7AFF'}
              fontWeight={500}
              sx={
                {
                  // margin: '50px 0 20px 0'
                }
              }
            >
              Thông tin
            </Typography>
            {gender && (
              <Box sx={style.converseText}>
                <Box display="flex" alignItems="center">
                  <Typography
                    marginLeft={'5px'}
                    fontSize={16}
                    color={'#6F7787FF'}
                    fontWeight={500}
                  >
                    Giới tính
                  </Typography>
                </Box>
                <Box>
                  <Chip
                    sx={{
                      backgroundColor: '#5ff290b0',
                      width: '58px',
                      height: '24px',
                      fontSize: '12px',
                      color: '#0EAA42FF'
                    }}
                    label={GenderFormatter(gender)}
                  />
                </Box>
              </Box>
            )}
            <Box sx={style.converseText}>
              <Box display="flex" alignItems="center">
                {/* <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Giới thiệu
                </Typography> */}
                <Box>
                  <Typography
                    fontSize={20}
                    color={'#0EAA42FF'}
                    fontWeight={500}
                  >
                    Giới thiệu
                  </Typography>
                  <Typography
                    fontSize={16}
                    marginLeft={'5px'}
                    color={'#6F7787FF'}
                    fontWeight={500}
                  >
                    {description}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={style.converseText}>
              <Box display="flex" alignItems="center">
                <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Điện thoại
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {phone}
                </Typography>
              </Box>
            </Box>
            <Box sx={style.converseText}>
              <Box display="flex" alignItems="center">
                <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Email
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {email}
                </Typography>
              </Box>
            </Box>
            {/* <Box sx={style.converseText}> */}
            {/* <Box display="flex" alignItems="center">
                <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Kinh nghiệm làm việc
                </Typography>
              </Box> */}
            {/* <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {company}
                </Typography>
              </Box> */}
            {/* </Box> */}
            <Box sx={style.converseText}>
              <Box display="flex" alignItems="center">
                <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Môn dạy
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {subject || 'chưa có'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default memo(ModalShowInfo);
const style: IStyleProps = {
  converseText: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0',
    paddingBottom: '10px'
  },

  flex: {
    justifyContent: 'center',
    height: '636px',
    background: 'white'
  },

  top: {
    justifyContent: 'center',
    width: '600px',
    height: '122px',
    background: '#b9fbe575',
    position: 'relative'
  },

  bottom: {
    width: '600px',
    height: 'calc(100% - 122px)',
    background: 'whtie'
  },

  contentTop: {
    width: '600px',
    height: '135px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  contentBottom: {
    width: '441px',
    height: 'calc(100% - 145px)',
    margin: '20px auto',
    display: 'flex',
    alignItems: 'flex-start'
  }
};
