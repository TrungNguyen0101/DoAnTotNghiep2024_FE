import { TUTOR_DETAIL_PATH } from '@/const';
import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  HeartIcon,
  LangueTeachIcon,
  PersonIcon,
  SpeakLangueIcon,
  StarIcon
} from '../icons';
import { useEffect, useState } from 'react';

const TutorDetailCard = ({ data }: TutorDetailCardProps) => {
  console.log('TutorDetailCard ~ data:', data);
  const router = useRouter();
  const [certificate, setCertificates] = useState([]);

  useEffect(() => {
    setCertificates(data.tutor_certifications);
  }, []);

  return (
    <Stack
      border="2px solid #121117"
      p={3}
      borderRadius="4px"
      // height={275}
      direction="row"
      spacing={3}
      justifyContent="space-between"
    >
      <>
        <Box
          sx={{
            height: 160,
            minWidth: 160,
            position: 'relative'
          }}
        >
          <Image
            src={data?.user?.avatar_url || '/static/images/avatars/3.jpg'}
            layout="fill"
            style={{ borderRadius: '4px' }}
            objectFit="cover"
          />
        </Box>

        <Stack width="100%" spacing={2}>
          <Typography variant="h2">
            {(data?.user?.first_name || '') +
              ' ' +
              (data?.user?.last_name || '')}
          </Typography>
          <Stack spacing={1}>
            <Stack>
              <Typography
                display="flex"
                variant="h5"
                color="secondary"
                alignItems="center"
                gap="8px"
              >
                <LangueTeachIcon />{' '}
                {data?.tutor_educations[0]?.favorite_subject}
              </Typography>
            </Stack>
            <Stack>
              <Typography
                display="flex"
                variant="h5"
                color="secondary"
                alignItems="center"
                gap="8px"
              >
                <PersonIcon /> 20 học sinh đang theo học
              </Typography>
            </Stack>
            <Stack>
              <Typography
                display="flex"
                variant="h5"
                color="secondary"
                alignItems="center"
                gap="8px"
              ></Typography>
            </Stack>

            <Typography mt={2} variant="h4">
              {/* {certificate.map((item, i) => (
            <Typography key={item.user_id}    
                variant="h4"
                fontWeight={400}
                className="text-ellipsis-2-row">
                  {item.name}
                </Typography>
            ))} */}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={400}
              className="text-ellipsis-2-row"
            >
              {data?.description || `Information tutor ...`}
            </Typography>
          </Stack>
        </Stack>
      </>

      <Stack justifyContent="space-between" minWidth="25%">
        <Stack spacing={1}>
          <Button
            sx={{ border: '2px solid #121117' }}
            variant="contained"
            onClick={() =>
              router.push({
                pathname: TUTOR_DETAIL_PATH,
                query: { id: data?.tutor_profile_id }
              })
            }
          >
            Chi tiết
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TutorDetailCard;

type TutorDetailCardProps = {
  data?: any;
};
