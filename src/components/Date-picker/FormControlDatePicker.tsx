import { InputLabel, InputLabelProps, Stack, StackProps } from '@mui/material';
import { DatePickerProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { memo } from 'react';
import {
  Control,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';
import AppDatePicker from './AppDatePicker';

const AppFormControlDatePicker = <T extends FieldValues>({
  label,
  control,
  name,
  rules,
  controlProps,
  required = false,
  labelProps,
  datePickerProps,
  ...otherProps
}: AppFormControlDatePickerProps<T>) => {
  return (
    <Stack {...otherProps}>
      {label && (
        <InputLabel
          sx={{
            '&': {
              mb: 0.5
            }
          }}
          required={required}
          {...labelProps}
        >
          {label}
        </InputLabel>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required, ...rules }}
        render={({ field }) => (
          <AppDatePicker
            {...field}
            views={['year']}
            maxDate={dayjs()}
            {...datePickerProps}
          />
        )}
        {...controlProps}
      />
    </Stack>
  );
};

type AppFormControlDatePickerProps<T extends FieldValues> = StackProps & {
  label?: string;
  control: Control<any, object>;
  name: FieldPath<T>;

  rules?: RegisterOptions<T>;
  required?: boolean;
  controlProps?: Omit<ControllerProps, 'render' | 'name' | 'control'>;
  labelProps?: InputLabelProps;
  datePickerProps?: DatePickerProps<any>;
};

export default memo(AppFormControlDatePicker);
