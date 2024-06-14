import api, { formatCurrency } from '@/api';
import CustomizedAccordions from '@/components/CustomizedAccordions';
import AppRating from '@/components/AppRating';
// import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import CourseCard from '@/components/card/CourseCard';
import { RemoteIcon } from '@/components/icons';
import AoTrinhIcon from '@/components/icons/AoTrinhIcon';
import SpentTimeIcon from '@/components/icons/SpentTimeIcon';
import BaseLayout from '@/layouts/BaseLayout';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { Dayjs } from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { chooseAllTimeAvailable } from 'pages/tutor/[id]';
import { useEffect, useMemo, useRef, useState } from 'react';
// import io from 'socket.io-client';
import ClearIcon from '@mui/icons-material/Clear';
import { io } from 'socket.io-client';

const socket = io('http://localhost:10000/');

const CourseDetail = () => {
  const router = useRouter();
  const course_id = router.query.id;
  const [course, setCourse] = useState(null);
  const nameTutor = useMemo(() => {
    if (course?.tutor_profile) {
      return (
        course?.tutor_profile?.user?.last_name +
        ' ' +
        course?.tutor_profile?.user?.first_name
      );
    }
  }, [course]);

  const [courseTutorId, setCourseTutorId] = useState('null');
  const [listUserMessage, setListUserMessage] = useState<any>([]);
  const [myCourse, setMyCourse] = useState<any>(false);
  const [myCourseExpiry, setMyCourseExpiry] = useState<any>(false);

  const [showFormDetail, setShowFormDetail] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();

  const handleSaveData = (body) => {
    // const request = !body?.course_program_id
    //   ? api.post('course-program', { course_id: course_id, ...body })
    //   : api.put(`course-program/${body.course_program_id}`, body);
    // request
    //   .then((res) => {
    //     setShowFormDetail(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const handleDelete = () => {
    const { course_program_id } = dataSelected;
    api.delete(`course-program/${course_program_id}`).then(() => {
      setShowConfirmDelete(false);
    });
  };
  const ref = useRef<AbortController | null>(null);

  const [availableDay, setAvailableDay] = useState(null);
  const [timeDeadLine, setTimeDeadLine] = useState('');
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [timeAvaiLableDay, setTimeAvailableDay] = useState([]);
  const [payload, setPayload] = useState<any>({});
  const [bookSession, setBookSession] = useState<any>({});
  const elementRef = useRef(null);

  const expiryTime = useMemo(() => {
    if (timeDeadLine && course) {
      const startTime = new Date(timeDeadLine);
      const expiryHours = course?.hour; // 0.5 giờ, sẽ chuyển thành 30 phút
      const expiryMinutes = expiryHours * 60; // chuyển đổi giờ thành phút
      const expiryTime = new Date(startTime.getTime() + expiryMinutes * 60000);
      return expiryTime;
    }
  }, [course, timeDeadLine, myCourseExpiry, myCourse]);

  const calculateTimeLeft = (expiryTime: any) => {
    const now: any = new Date();
    const difference = expiryTime - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(expiryTime));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isExpired || !myCourseExpiry) return;
    const timer = setTimeout(() => {
      const newTimeLeft: any = calculateTimeLeft(expiryTime);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [expiryTime, isExpired, timeLeft]);
  useEffect(() => {
    if (isExpired) {
      const handleUpdate = async () => {
        const res = await api.put(
          `/booked-session/expiry/${bookSession?.booked_session_id}`
        );
      };
      handleUpdate();
    }
  }, [isExpired, bookSession?.booked_session_id]);

  // ----------------------------------------------------------------
  const [userId, setUserId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoadMessage, setIsLoadMessage] = useState(false);
  const [userLoadMessage, setUserLoadMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isRead, setIsRead] = useState<any>();
  const [lastMessage, setLastMessage] = useState<any>();

  useEffect(() => {
    const token = localStorage?.getItem('access_token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      setUserId(decoded?.user_id);
      socket.emit('authenticate', decoded?.user_id);

      socket.on('receive-message', async (data) => {
        setLastMessage(data);
        if (
          (data.senderId === userLoadMessage ||
            data.senderId === decoded?.user_id) &&
          showChat
        ) {
          setMessages((prevMessages) => [...prevMessages, data]);
        } else {
          getMessageById(decoded?.user_id);
        }

        if (!showChat) {
          setIsRead(true);
        }

        // if (
        //   !(
        //     data.senderId === userLoadMessage ||
        //     data.senderId === decoded?.user_id
        //   )
        // ) {
        //   setIsRead(true);
        // }

        // if (
        //   !(
        //     data.senderId === userLoadMessage ||
        //     data.senderId === decoded?.user_id
        //   ) &&
        //   showChat
        // ) {
        //   setIsRead(true);
        // }

        // console.log('socket.on ~ data:', data);
        const res = await api.get(`/message/read/${decoded?.user_id}`);
        console.log('socket.on ~ res:', res.data.data);
      });

      return () => {
        socket.off('receive-message');
      };
    }
  }, [userLoadMessage, showChat]);

  const getMessageById = async (id?) => {
    try {
      const res = await api.get(`/message/${userId || id}`);
      const result = res?.data?.data;
      const listMessage = await Promise.all(
        result.map(async (item) => {
          let res: any;
          if (item?.receiver_id === userId) {
            res = await api.get(`/user/get-user-info/${item?.sender_id}`);
          } else {
            res = await api.get(`/user/get-user-info/${item?.receiver_id}`);
          }
          const userData = res?.data?.data;
          return {
            message: item,
            user: userData
          };
        })
      );
      // Create a Set to keep track of unique user_ids
      const uniqueUserIds = new Set();
      const filteredListMessage = listMessage.filter((item) => {
        if (uniqueUserIds.has(item.user?.user_id)) {
          return false; // If user_id already exists, filter out this item
        }
        uniqueUserIds.add(item.user?.user_id);
        return true; // If user_id is new, keep this item
      });

      setListUserMessage(filteredListMessage);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userId) {
      getMessageById();
    }
  }, [userId]);
  useEffect(() => {
    if (elementRef && messages) {
      elementRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [listUserMessage, messages, elementRef, showChat]);

  useEffect(() => {
    if (course) {
      setCourseTutorId(course?.tutor_profile?.user_id);
    }
  }, [course]);

  const getMessageByUser = async (receiver_id: any) => {
    console.log('getMessageByUser ~ receiver_id:', receiver_id);
    setReceiverId(receiver_id);
    try {
      const res = await api.get(
        `/message?sender_id=${userId}&receiver_id=${receiver_id}`
      );
      const result = res?.data?.data;
      const filteredResult = result.map(({ message, sender_id }) => ({
        message,
        senderId: sender_id
      }));
      setMessages(filteredResult);
      setIsLoadMessage(true);
      setShowChat(true);
    } catch (error) {
      setIsLoadMessage(true);
      setShowChat(true);
      console.log(error);
    }
  };

  const handleLoadMessage = () => {
    if (userLoadMessage) {
      getMessageByUser(userLoadMessage);
    }
  };
  const sendMessage = () => {
    socket.emit('send-message', {
      receiverId,
      message
    });
    console.log(lastMessage);
    socket.emit('mark-message-read', {
      message_id: lastMessage?.message_id
    });
    setMessage('');
    if (elementRef.current) {
      console.log(elementRef.current.scrollHeight);
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (course_id) {
      const getCourse = async () => {
        try {
          const res = await api.get(`/course/${course_id}`);
          if (res.status === 200) {
            setCourse(res.data.data);
            // const availableTime = await api.get(
            //   `/tutor-available-date/find-by-userid/${res.data.data.tutor_profile.user_id}`
            // );

            const token = localStorage.getItem('access_token');
            if (token) {
              const decoded = jwtDecode<any>(token);

              setPayload((prev) => {
                return {
                  ...prev,
                  tutor_id: res.data.data.tutor_profile.user_id,
                  student_id: decoded?.user_id,
                  course_id: res.data.data.course_id
                };
              });
            }
            // setAvailableDay(availableTime.data.data);
            // setHighlightedDays(findDayHightLight(availableTime.data.data));
            // setTimeAvailableDay(
            //   chooseAllTimeAvailable(
            //     dayjs().format('DD'),
            //     availableTime.data.data
            //   )
            // );
          }
        } catch (error) {
          console.log(error);
        }
      };
      getCourse();
    }
  }, [course_id]);

  useEffect(() => {
    if (course_id && userId) {
      const getMyCourse = async () => {
        try {
          const res = await api.get(
            `/booked-session/my-course?user_id=${userId}&course_id=${course_id}`
          );
          if (res.status === 200) {
            setTimeDeadLine(res.data.data.isNotExpiry[0]?.time);
            setMyCourse(!!res.data.data.isExpiry.length);
            setMyCourseExpiry(!!res.data.data.isNotExpiry.length);
            setBookSession(res.data.data.isNotExpiry[0]);
          }
          console.log('getMyCourse ~ res.data.data:', res.data.data);
        } catch (error) {
          console.log(error);
        }
      };
      getMyCourse();
    }
  }, [course_id, userId]);

  const handleMonthChange = (date: Dayjs) => {
    if (ref.current) {
      ref.current.abort();
    }
    // setHighlightedDays([]);
    // fetchHighlightedDays(date);
  };

  const handleChangeDay = (value) => {
    const day = value.format('DD/MM/YYYY');
    setTimeAvailableDay(chooseAllTimeAvailable(day, availableDay));
  };

  const handleClickChip = (id) => {
    setPayload((prev) => ({
      ...prev,
      tutor_available_date: prev.tutor_available_date.concat(id)
    }));
  };
  const handleMua = async () => {
    try {
      const res = await api.post('/payment/get-payment-url', payload);
      console.log('handleMua ~ res:', res);
      if (res.status === 200) {
        router.push(res.data.data);
        // window.location.href = res.data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetUserTutor = async () => {
    getMessageByUser(course?.tutor_profile?.user_id);
    setUserName(
      course?.tutor_profile?.user?.last_name +
        ' ' +
        course?.tutor_profile?.user?.first_name
    );
  };

  // useEffect(() => {
  //   const handleContextMenu = (event) => {
  //     event.preventDefault();
  //   };

  //   const handleInspect = (event) => {
  //     event.preventDefault();
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('keydown', handleInspect);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('keydown', handleInspect);
  //   };
  // }, []);

  useEffect(() => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Grid mt={5} container>
        <Grid item xs={8}>
          <Typography variant="h2">{course?.name}</Typography>
          <Typography mt={2} color="secondary" variant="h4">
            {course?.description}
          </Typography>
          {course?.type_course === 'true' && (
            <Typography mt={2} variant="h5" color="secondary">
              Giá tiền : {formatCurrency(course?.price, 'vi-VN', 'VND')}
            </Typography>
          )}
          <Typography mt={2} variant="h4" color="black">
            Gia sư : {nameTutor}
          </Typography>
          {(myCourse || myCourseExpiry) && (
            <div>
              {timeLeft.days !== 0 ||
              timeLeft.hours !== 0 ||
              timeLeft.minutes !== 0 ||
              timeLeft.seconds !== 0 ? (
                <Typography mt={2} variant="h4" color="black">
                  Khóa học sẽ hết hạn sau: {timeLeft.days} ngày {timeLeft.hours}{' '}
                  giờ {timeLeft.minutes} phút{' '}
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}{' '}
                  giây
                </Typography>
              ) : (
                <Typography mt={2} variant="h4" color="red">
                  Thời gian học đã hết hạn, vui lòng mua lại khóa học
                </Typography>
              )}
            </div>
          )}
          {/* <Divider sx={{ mt: 2 }} />
          <Typography mt={2} variant="h3">
            Thông tin khóa học
          </Typography> */}

          {/* <Typography mt={2} variant="h5" color="secondary">
            Đánh giá : <AppRating value={Number(course?.ratting)} />
          </Typography>
          <Typography mt={2} variant="h5" color="secondary">
            Tổng thời lượng của khóa học : {course?.spend_time}
          </Typography> */}
          <Divider sx={{ mt: 2 }} />
          <Typography mt={2} variant="h3">
            Nội dung khóa học
          </Typography>
          <Typography my={2} variant="h5" color="secondary">
            {course?.course_programs?.length} chương
          </Typography>
          <Stack spacing={1}>
            {course?.course_programs
              ?.slice()
              .reverse()
              .map((item) => {
                return (
                  <CustomizedAccordions
                    key={item.course_program_id}
                    keyExpand={item.course_program_id}
                    title={item.tittle}
                    childTitle={item.course_program_phases}
                    data={item}
                    setDataSelected={setDataSelected}
                    setShowForm={setShowFormDetail}
                    setShowConfirmDelete={setShowConfirmDelete}
                    myCourse={myCourse}
                    myCourseExpiry={myCourseExpiry}
                    isCourse={true}
                    course={course}
                  />
                );
              })}
          </Stack>
        </Grid>
        <Grid
          display="flex"
          flexDirection="column"
          alignItems="center"
          item
          gap="20px"
          xs={4}
        >
          <CourseCard
            src={course?.image_url}
            title={course?.name}
            course_id={course?.course_id}
            noPush
          />
          <Stack alignItems="center" gap="10px">
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                gap: '12px'
              }}
            >
              <Typography
                display="flex"
                alignItems="center"
                variant="h6"
                color="secondary"
              >
                <AoTrinhIcon /> Cơ bản
              </Typography>

              <Typography
                display="flex"
                alignItems="center"
                variant="h6"
                color="secondary"
              >
                <RemoteIcon /> Tiện ích
              </Typography>
              <Typography
                display="flex"
                alignItems="center"
                variant="h6"
                color="secondary"
              >
                <SpentTimeIcon /> Thời lượng: {course?.spend_time}
              </Typography>
            </Box> */}
            {/* <Button onClick={handleMua} variant="contained">
              Mua
            </Button> */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              {course?.type_course === 'true' ? (
                <>
                  {myCourse || myCourseExpiry ? (
                    <>
                      {myCourseExpiry ? (
                        <Button
                          sx={{ border: '2px solid #121117' }}
                          variant="text"
                          disabled
                        >
                          Khóa học đã được mua
                        </Button>
                      ) : (
                        <Button
                          sx={{ border: '2px solid #121117' }}
                          variant="contained"
                          onClick={() => {
                            if (localStorage.getItem('access_token')) {
                              handleMua();
                            } else {
                              router.push('/auth/login');
                            }
                          }}
                        >
                          Mua lại khóa học
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      sx={{ border: '2px solid #121117' }}
                      variant="contained"
                      onClick={() => {
                        if (localStorage.getItem('access_token')) {
                          handleMua();
                        } else {
                          router.push('/auth/login');
                        }
                      }}
                    >
                      Mua khóa học
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  sx={{ border: '2px solid #121117' }}
                  variant="text"
                  disabled
                >
                  Khóa học miễn phí
                </Button>
              )}
              {userId && (
                <>
                  {courseTutorId !== userId && (
                    <Button
                      sx={{ border: '2px solid #121117' }}
                      variant="contained"
                      onClick={handleGetUserTutor}
                    >
                      Nhắn tin với gia sư
                    </Button>
                  )}
                </>
              )}
            </div>
          </Stack>
        </Grid>
      </Grid>
      {/* {showFormDetail && (
        <CourseProgramFormAdd
          data={dataSelected}
          isOpen={showFormDetail}
          onSave={handleSaveData}
          onClose={() => setShowFormDetail(false)}
          key={''}
        />
      )} */}
      {/* {showConfirmDelete && (
        <ConfirmDeleteModal
          open={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )} */}

      {/* <Dialog
        sx={{
          maxWidth: 'unset'
        }}
        onClose={() => setOpen(false)}
        open={open}
      >
        <DialogTitle>
          <Typography variant="h1">Chọn lịch học</Typography>
        </DialogTitle>
        <Divider />
        <Stack p={3} width="100%" gap="8px">
          <Typography variant="h3">Thời gian rảnh trong tuần</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DateCalendarValue
                highlightedDays={highlightedDays}
                handleMonthChange={handleMonthChange}
                onChangeDay={handleChangeDay}
              />
            </Grid>
            <Grid item xs={6}>
              <Stack pt={2} spacing={2}>
                <Typography variant="h4">
                  Thời gian có thể dạy trong ngày
                </Typography>
                <Stack direction="row" spacing={1}>
                  {timeAvaiLableDay?.length ? (
                    timeAvaiLableDay
                      .sort(function (a, b) {
                        return a.start_time.localeCompare(b.start_time);
                      })
                      .filter((item) => item.schedule == null)
                      ?.map((item, i) => (
                        <Chip
                          key={i}
                          label={`${item.start_time} : ${item.end_time}`}
                          onClick={() => handleClickChip(item.id)}
                        />
                      ))
                  ) : (
                    <Typography>
                      Không có thời gian rảnh trong ngày này!
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            {Boolean(payload?.tutor_available_date?.length) && (
              <Typography variant="h3" color="secondary">
                Đã học {payload?.tutor_available_date?.length} buổi{' '}
                {payload?.tutor_available_date?.length && (
                  <VerifyIcon
                    sx={{
                      color: 'green'
                    }}
                  />
                )}
              </Typography>
            )}
            <Button onClick={handleMua} variant="contained">
              Mua
            </Button>
          </Stack>
        </Stack>
      </Dialog> */}
      {/* <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === userId ? 'You' : msg.senderId}: </strong>
            {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button> */}

      <div>
        {userId && (
          <div className="chat-container1">
            {showChat && (
              <div style={{ position: 'relative' }}>
                <div
                  style={{ display: 'flex', width: '100%' }}
                  className="text-load"
                >
                  <div className="text-load1">{userName}</div>
                  <ClearIcon
                    fontSize="small"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowChat(false);
                    }}
                  />
                </div>
                <div className="chat-container">
                  <div className="chat-box" id="chat-box" ref={elementRef}>
                    {messages.map((msg, index) => (
                      <div key={index}>
                        {msg.senderId === userId ? (
                          <div className="chat-message incoming">
                            <div className="message">{msg.message}</div>
                          </div>
                        ) : (
                          <div className="chat-message outgoing">
                            <div className="message">{msg.message}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      className="input1"
                      id="message-input"
                      value={message}
                      placeholder="Type your message..."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="button-container" onClick={sendMessage}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="image-container">
              {listUserMessage.length &&
                listUserMessage.map((message) => {
                  return (
                    <Tooltip
                      arrow
                      title={
                        message?.user?.last_name +
                        ' ' +
                        message?.user?.first_name
                      }
                      placement="left-start"
                      key={message?.user?.user_id}
                    >
                      <div
                        style={{ marginBottom: '10px' }}
                        onClick={() => {
                          getMessageByUser(message?.user?.user_id);
                          setUserLoadMessage(message?.user?.user_id);
                          setUserName(
                            message?.user?.last_name +
                              ' ' +
                              message?.user?.first_name
                          );
                        }}
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src={
                            message?.user?.avatar_url ||
                            '/static/images/avatars/2.jpg'
                          }
                          sx={{ width: 48, height: 48, cursor: 'pointer' }}
                        />
                      </div>
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CourseDetail;
CourseDetail.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;
