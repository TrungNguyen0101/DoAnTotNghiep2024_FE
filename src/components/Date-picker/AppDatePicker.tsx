import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/vi';
import { forwardRef, memo } from 'react';

const AppDatePicker = forwardRef<HTMLInputElement, DatePickerProps<any>>(
  (props: DatePickerProps<any>, ref) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'vi'}>
        <DatePicker
          inputRef={ref}
          dayOfWeekFormatter={(day) => day}
          slots={{
            textField: TextField
          }}
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
          {...props}
        />
      </LocalizationProvider>
    );
  }
);

export default memo(AppDatePicker);
