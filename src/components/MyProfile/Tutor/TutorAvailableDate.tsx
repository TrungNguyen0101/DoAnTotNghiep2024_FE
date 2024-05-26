import api from '@/api';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import DateCalendarValue from '@/components/Calendar';
import React, { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import TutorDateForm from './Form/TutorDateForm';
import { getDate } from 'date-fns';

function TutorAvailableDate({ userId }) {
  const [availableDate, setAvailableDate] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [itemSelected, setItemSelected] = useState<any>({});

  const ref = useRef<AbortController | null>(null);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [datePick, setDatePick] = useState(dayjs().format('D/MM/YYYY'));
  useEffect(() => {
    fetchData(userId);
  }, []);

  const fetchData = async (userId) => {
    var res = await api.get(`tutor-available-date/find-by-userid/${userId}`);
    setAvailableDate(res.data?.data);
  };

  const handleMonthChange = (date: Dayjs) => {
    if (ref.current) {
      ref.current.abort();
    }
    // setHighlightedDays([]);
    // fetchHighlightedDays(date);
  };

  const handleChangeDay = (value) => {
    const day = value.format('DD/MM/YYYY');
    setDatePick(day);
  };

  const handleSaveDate = async (e) => {
    var body = {
      ...e,
      date: datePick,
      tutor_id: userId
    };

    !body?.tutor_available_date_id
      ? await api.post('tutor-available-date', body)
      : await api.put(
          'tutor-available-date/' + e.tutor_available_date_id,
          body
        );

    fetchData(userId);
    setShowForm(false);
  };

  const handleEdit = async (e) => {
    setShowForm(true);
    setItemSelected(e);
  };

  const handleDelete = async (e) => {
    console.log(e);
    await api.delete('tutor-available-date/' + e.tutor_available_date_id);
    fetchData(userId);
  };

  return (
    <>
      <Card
        sx={{
          background: 'white',
          py: '1rem',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          px: '3rem'
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <h3>Thời gian dạy</h3>
          <Button
            variant="contained"
            onClick={() => {
              setShowForm(true);
              setItemSelected({});
            }}
          >
            Thêm mới
          </Button>
        </Box>
        <Box>
          <Stack mt={2} width="70%" gap="8px">
            <Typography variant="h3">Thời gian rảnh trong tuần</Typography>
            <Stack direction="row" spacing={6}>
              <DateCalendarValue
                highlightedDays={highlightedDays}
                handleMonthChange={handleMonthChange}
                onChangeDay={handleChangeDay}
              />
              <Stack pt={2} spacing={2}>
                <Typography variant="h4">
                  Thời gian có thể dạy trong ngày
                </Typography>
                <Stack direction="row" spacing={1}>
                  {availableDate ? (
                    availableDate
                      .sort(function (a, b) {
                        return a.start_time - b.start_time;
                      })
                      .filter((x) => x.date == datePick)
                      ?.map((item, i) => (
                        <Chip
                          key={i}
                          label={`${item.start_time} : ${item.end_time}`}
                          onClick={() => handleEdit(item)}
                          onDelete={() => handleDelete(item)}
                        />
                      ))
                  ) : (
                    <Typography>
                      Không có thời gian rảnh trong ngày này!
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {showForm && (
          <TutorDateForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
            }}
            data={itemSelected}
            onSave={handleSaveDate}
          />
        )}
      </Card>
    </>
  );
}

export default TutorAvailableDate;

const chooseAllTimeAvailable = (day, arr) => {
  const dateNow = arr?.filter((item) => item.date === day);

  return dateNow?.map((item) => ({
    start_time: item.start_time,
    end_time: item.end_time
  }));
};
