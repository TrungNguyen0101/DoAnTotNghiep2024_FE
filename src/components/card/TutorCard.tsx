import { Avatar, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const TutorCard = ({ data }) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push('tutor/' + data?.tutor_profile_id);
      }}
      sx={{
        transition: 'transform .5s',
        borderRadius: '12px',
        width: '100%',
        height: 400,
        p: '16px',
        boxShadow: 'unset',
        border: '1px solid #DBDBDB',

        '&:hover': {
          boxShadow: '0px 0px 20px rgba(57,76,96,.15)',
          transform: 'translate(0, -4px)',
          cursor: 'pointer'
        }
      }}
    >
      <CardContent
        sx={{
          minWidth: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src={data?.user?.avatar_url || '/static/images/avatars/3.jpg'}
          sx={{ width: 112, height: 112 }}
        />
        <Typography
          width="100%"
          variant="h3"
          textAlign="center"
          color="text.secondary"
        >
          {(data?.user?.first_name || '') + ' ' + (data?.user?.last_name || '')}
        </Typography>

        <Typography
          width="100%"
          variant="h5"
          textAlign="center"
          color="text.secondary"
        >
          {data?.description || 'Chuyên gia hàng đầu trong giáo dục'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
