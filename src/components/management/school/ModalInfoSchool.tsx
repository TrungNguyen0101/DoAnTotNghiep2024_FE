import React, { memo } from 'react';
import {
  Box,
  Dialog,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';

interface IStyleProps {
  [x: string]: SxProps<Theme>;
}

interface IModalManage {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  location: string;
  description: string;
  established_date: number;
}

const ModalShowInfo: React.FC<IModalManage> = ({
  setOpen,
  open,
  name,
  description,
  location,
  established_date
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
          <Box
            width={'100%'}
            height={'200px'}
            sx={{
              position: 'absolute',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100%'
            }}
          ></Box>
        </Stack>
        <Stack sx={style.bottom}>
          <Box sx={style.contentTop}>
            <Typography fontSize={25} color={'#459D7AFF'} fontWeight={600}>
              {name}
            </Typography>
          </Box>
          <Stack sx={style.contentBottom}>
            <Typography fontSize={20} color={'#459D7AFF'} fontWeight={500}>
              Thông tin
            </Typography>
            <Box sx={style.converseText}>
              <Box display="flex" alignItems="center">
                <Typography
                  marginLeft={'5px'}
                  fontSize={16}
                  color={'#6F7787FF'}
                  fontWeight={500}
                >
                  Giới thiệu
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {description}
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
                  Năm thành lập
                </Typography>
              </Box>
              <Box display="flex">
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {established_date}
                </Typography>
                <StarIcon />
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
                  Địa chỉ
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={16} color={'#6F7787FF'} fontWeight={500}>
                  {location}
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
    margin: '10px 0'
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
    height: 'calc(100% - 120px)',
    margin: '20px auto',
    display: 'flex',
    alignItems: 'flex-start'
  }
};
