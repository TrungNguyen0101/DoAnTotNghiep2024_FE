import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';

const SubjectCard = ({ name, src }) => {
  return (
    <Card
      sx={{
        transition: 'transform .5s',
        borderRadius: '12px',
        height: 300,
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Avatar src={src} sx={{ width: 130, height: 130 }} />

        <Typography variant="h3" textAlign="center" color="text.secondary">
          {name}
        </Typography>
      </CardContent>
      {/* <Stack alignItems="center">
        <Button
          sx={{
            minWidth: 150,
            border: '2px solid #14398a',
            borderRadius: '20px',
            height: 48,

            '&:hover': {
              color: 'white',
              backgroundColor: 'primary.main',
              transition: 'all .2s linear'
            }
          }}
          variant="outlined"
        >
          Đặt lịch
        </Button>
      </Stack> */}
    </Card>
  );
};

export default SubjectCard;
