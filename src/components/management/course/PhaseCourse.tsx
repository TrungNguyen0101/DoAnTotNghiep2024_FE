import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CoursePhaseFormEdit from './CoursePhaseFormEdit';
import api from '@/api';
import { enqueueSnackbar } from 'notistack';

const PhaseCourse = ({
  child,
  setCount,
  number,
  add,
  myCourse,
  myCourseExpiry,
  isCourse,
  course
}) => {
  const [openPhaseEdit, setOpenPhaseEdit] = useState(false);
  const [youtubeId, setYoutubeId] = useState('');

  const handleDelete = async () => {
    const res = await api.delete(
      `/course-program/phase/${child.course_program_phase_id}`
    );
    if (res.status === 200) {
      enqueueSnackbar({
        message: 'Xoá chương thành công',
        variant: 'success'
      });
      setCount((prev) => prev + 1);
    }
  };
  const getYoutubeId = (link?: string) => {
    const regex =
      /(?:youtube(?:-nocookie)?.com\/(?:[^\/\n\s]+\/[\s\S]+\/|(?:v|e(?:mbed)?)\/|[\s\S]*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const result = link?.match(regex);
    if (result && result[1]) {
      return result[1];
    }
    return '';
  };

  useEffect(() => {
    const id = getYoutubeId(child.overview_url);
    setYoutubeId(id);
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" mb={1}>
          {child.name}
        </Typography>
        {add && (
          <Box>
            <IconButton
              color="secondary"
              onClick={() => setOpenPhaseEdit(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12.9 6.855l4.242 4.242l-9.9 9.9H3v-4.243zm1.414-1.415l2.121-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"
                />
              </svg>
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M216 48h-36V36a28 28 0 0 0-28-28h-48a28 28 0 0 0-28 28v12H40a12 12 0 0 0 0 24h4v136a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20V72h4a12 12 0 0 0 0-24M100 36a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v12h-56Zm88 168H68V72h120Zm-72-100v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0m48 0v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0"
                />
              </svg>{' '}
            </IconButton>
          </Box>
        )}
      </Stack>
      <Typography fontSize={14} mb={1} color="secondary">
        {child.content}
      </Typography>
      {child?.type_video === '1' ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?controls=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
          allowFullScreen
          title="Embedded youtube"
          width="400"
          height="200"
        />
      ) : (
        <>
          {isCourse && course?.type_course === 'true' ? (
            <>
              {myCourseExpiry ? (
                <video
                  width="400"
                  height="200"
                  controls
                  controlsList="nodownload  noremoteplayback"
                >
                  <source
                    id="my-video"
                    src={child?.overview_url}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '35%',
                      left: '5%',
                      zIndex: '99',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    Vui lòng mua khóa học để xem video
                  </div>
                  <video
                    width="400"
                    height="200"
                    controls
                    controlsList="nodownload  noremoteplayback"
                    style={{ filter: 'blur(5px)', pointerEvents: 'none' }}
                  >
                    <source
                      id="my-video"
                      src={child?.overview_url}
                      type="video/mp4"
                    />
                  </video>
                </div>
              )}
            </>
          ) : (
            <video
              width="400"
              height="200"
              controls
              controlsList="nodownload  noremoteplayback"
            >
              <source
                id="my-video"
                src={child?.overview_url}
                type="video/mp4"
              />
            </video>
          )}
        </>
      )}

      <CoursePhaseFormEdit
        data={child}
        isOpen={openPhaseEdit}
        onClose={() => setOpenPhaseEdit(false)}
        setCount={setCount}
      />
    </>
  );
};

export default PhaseCourse;
