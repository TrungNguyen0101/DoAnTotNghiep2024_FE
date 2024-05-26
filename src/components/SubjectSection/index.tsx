import { Stack, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SubjectCard from '../card/SubjectCard';
import { useEffect, useState } from 'react';
import api from '@/api';

const SubjectSection = () => {


  const [subjectList, setsubjectList] = useState([])
  const getSubject = async () => {
     try {
      const rs = await api.get('/category')
      if(rs.status == 200) {
        setsubjectList(rs.data.data)
      }
     } catch (e) {
      console.log(e);
     }
  }
  useEffect(() => {
    getSubject()
  }, [])

  return (
    <Stack
      direction="column"
      spacing={2}
      height={450}
      p="10px"
      alignItems="center"
    >
      <Typography variant="h2">Môn học</Typography>
      <Typography variant="h5">
        Có đầy đủ các môn học từ mẫu giáo tới đại học
      </Typography>

      <Swiper
        // pagination={{ clickable: true }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiper"
        slidesPerView={4}
        spaceBetween={35}
        navigation={true}
        style={{
          userSelect: 'none',
          padding: '4px 33px '
        }}
      >
        {subjectList.map((item, i) => (
          <SwiperSlide key={item.category_id}>
            <SubjectCard name={item.name} src={item.image_url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
};

export default SubjectSection;