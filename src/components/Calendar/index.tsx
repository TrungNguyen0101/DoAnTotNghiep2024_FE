import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { VerifyIcon } from '../icons';
import { memo, useRef, useState } from 'react';

// function getRandomNumber(min: number, max: number) {
//   return Math.round(Math.random() * (max - min) + min);
// }

// function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
//   return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       const daysInMonth = date.daysInMonth();
//       const daysToHighlight = [1, 2, 3].map(() =>
//         getRandomNumber(1, daysInMonth)
//       );

//       resolve({ daysToHighlight });
//     }, 500);

//     signal.onabort = () => {
//       clearTimeout(timeout);
//       reject(new DOMException('aborted', 'AbortError'));
//     };
//   });
// }

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <VerifyIcon
            sx={{
              color: '#4caf50',
              fontSize: 18
            }}
          />
        ) : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

function DateCalendarServerRequest({
  handleMonthChange,
  highlightedDays,
  onChangeDay
}) {
  const [isLoading, setIsLoading] = useState(false);

  // const fetchHighlightedDays = (date: Dayjs) => {
  //   const controller = new AbortController();
  //   fakeFetch(date, {
  //     signal: controller.signal
  //   })
  //     .then(({ daysToHighlight }) => {
  //  console.log(daysToHighlight);

  //       setHighlightedDays(daysToHighlight);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       if (error.name !== 'AbortError') {
  //         throw error;
  //       }
  //     });

  //   requestAbortController.current = controller;
  // };

  // useEffect(() => {
  //   fetchHighlightedDays(initialValue);
  //   return () => requestAbortController.current?.abort();
  // }, []);

  const [value, setValue] = useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onChangeDay(newValue);
        }}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay
        }}
        slotProps={{
          day: {
            highlightedDays
          } as any
        }}
      />
    </LocalizationProvider>
  );
}

export default memo(DateCalendarServerRequest);
