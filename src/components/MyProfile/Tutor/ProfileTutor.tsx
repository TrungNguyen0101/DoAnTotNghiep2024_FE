import api from '@/api';
import { ROLE_STUDENT_ID, ROLE_TEACHER_ID } from '@/const';
import { Box, Card, Tab, Tabs } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import CerInfo from './CerInfo';
import CoursePanel from './Course';
import EduInfo from './EduInfo';
import ExpInfo from './ExpInfo';
import InfoTutor from './InfoTutor';
import InfoUser from './InfoUser';
import TutorAvailableDate from './TutorAvailableDate';
import { useRouter } from 'next/router';
import EduInfoUser from './EduInfoUser';

export type FormDataHaha = {
  last_name: string;
  first_name: string;
  email: string;
  phone_number: string;
  gender: string;
  balance: string;
  stripe_account_id: string;
  description: string;

  start_time: string;
  end_time: string;
  organization: string;
  position: string;
  description_tutor_experiences: string;

  school_name: string;
  score_url: string;
  from_year: string;
  to_year: string;
  favorite_subject: string;

  certification_name: string;
  organization_certification: string;
  award_url: string;
};

export const defaultValues = {
  certification_name: '',
  organization_certification: '',
  award_url: ''
};

function ProfileTutor() {
  const [tab, setTab] = useState(0);

  // const [school, setSchool] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [tutorInfo, setTutorInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const getInfoUser = async () => {
    const token = localStorage?.getItem('access_token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      setUserId(decoded?.user_id);
      try {
        const res = await api.get(`/user/get-user-info/${decoded?.user_id}`);
        // const resSchool = await api.get('/school');
        console.log('getInfoUser ~ res:', res);

        // setSchool(
        //   resSchool.data.data.map((item) => {
        //     return { name: item.name, id: item.school_id };
        //   })
        // );

        if (res.status === 200) {
          setUser(res.data.data);
          const user = res.data.data;
          const tutor_profile = res.data.data.tutor_profiles[0];
          const student_profile = res.data.data.student_profile;

          // tutor
          if (user.role_id === ROLE_TEACHER_ID) {
            setTutorInfo(tutor_profile);
            console.log(tutor_profile);
          } else if (user.role_id === ROLE_STUDENT_ID) {
            setTutorInfo(student_profile);
          }
        }
      } catch (error) {}
    } else {
      router.push('/auth/login');
    }
  };
  useEffect(() => {
    getInfoUser();
  }, []);

  const handleChange = (_, value) => {
    setTab(value);
    getInfoUser();
  };

  function CustomTabPanel(props: any) {
    const { children, index, ...other } = props;

    return (
      <Box role="tabpanel" hidden={tab !== index} {...other}>
        {tab === index && <Box>{children}</Box>}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '600px'
      }}
    >
      <Box sx={{ my: 3 }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Thông tin tài khoản" />
          {Boolean(tutorInfo?.tutor_profile_id) === true && (
            <Tab label="Thông tin gia sư" />
          )}
          {/* {Boolean(tutorInfo?.tutor_profile_id) === true && ( */}
          <Tab label="Học vấn" />
          {/* )} */}
          {/* {Boolean(tutorInfo?.tutor_profile_id) === true && (
            <Tab label="Thời gian dạy" />
          )} */}
          {Boolean(tutorInfo?.tutor_profile_id) === true &&
            tutorInfo?.check_approve && <Tab label="Khóa học" />}
        </Tabs>
      </Box>
      {/* thông tin tài khoản */}
      <CustomTabPanel index={0}>
        <Card
          sx={{
            background: 'white',
            py: '1rem',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            px: '3rem',
            width: '100%'
          }}
        >
          <InfoUser data={user} id={userId} />
        </Card>
      </CustomTabPanel>
      {/* thông tin gia sư */}
      {Boolean(tutorInfo?.tutor_profile_id) === true && (
        <CustomTabPanel index={1}>
          <Card
            sx={{
              background: 'white',
              py: '1rem',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              px: '3rem'
            }}
          >
            <InfoTutor data={tutorInfo} />
          </Card>
        </CustomTabPanel>
      )}
      {/* thông tin kinh nghiệm */}
      <CustomTabPanel
        index={Boolean(tutorInfo?.tutor_profile_id) === true ? 2 : 1}
      >
        {/* <Card
          sx={{
            background: 'white',
            py: '1rem',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            px: '3rem',
            mb: 3
          }}
        >
          <ExpInfo data={tutorInfo} />
        </Card> */}

        <Card
          sx={{
            background: 'white',
            py: '1rem',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            px: '3rem',
            mb: 3
          }}
        >
          {user?.type === '1' ? (
            <EduInfoUser data={tutorInfo}></EduInfoUser>
          ) : (
            <EduInfo data={tutorInfo} />
          )}
        </Card>

        {/* <Card
          sx={{
            background: 'white',
            py: '1rem',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            px: '3rem',
            mb: 3
          }}
        >
          <CerInfo data={tutorInfo} />
        </Card> */}
      </CustomTabPanel>
      {/* <CustomTabPanel index={3}>
        <TutorAvailableDate userId={user?.user_id} />
      </CustomTabPanel> */}
      <CustomTabPanel index={3}>
        <Card
          sx={{
            background: 'white',
            py: '1rem',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            px: '3rem',
            mb: 3
          }}
        >
          <CoursePanel tutor={tutorInfo} />
        </Card>
      </CustomTabPanel>
    </Box>
  );
}

export default ProfileTutor;
