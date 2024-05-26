import { Container } from '@mui/material';

import ProfileTutor from '@/components/MyProfile/Tutor/ProfileTutor';
import BaseLayout from '@/layouts/BaseLayout';

function MyProfile() {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          background: '#dde3e9'
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            mb: 10
          }}
        >
          <ProfileTutor />
        </Container>
      </Container>
    </>
  );
}

MyProfile.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default MyProfile;
