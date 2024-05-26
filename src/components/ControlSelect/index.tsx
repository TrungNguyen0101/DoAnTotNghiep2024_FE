import {
  InputLabel,
  InputLabelProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Stack,
  StackProps
} from '@mui/material';
import React, { memo } from 'react';
import {
  Control,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  RegisterOptions
} from 'react-hook-form';

const ControlSelect = <T extends FieldValues>({
  label,
  control,
  name,
  rules,
  list,
  isHasAllOption,
  controlProps,
  required = false,
  labelProps,
  selectProps,
  onChangeValueForm,
  ...otherProps
}: AppFormControlSelectProps<T>) => {
  return (
    <Stack {...otherProps}>
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
      <Controller
        control={control}
        name={name}
        rules={{ required, ...rules }}
        render={({ field: { onChange, ...otherFieldProps } }) => (
          <Select
            sx={{
              backgroundColor: 'common.white',
              height: 40,
              borderRadius: '4px'
            }}
            required={required}
            onChange={(
              event: SelectChangeEvent<unknown>,
              child: React.ReactNode
            ) => {
              if (onChangeValueForm instanceof Function)
                onChangeValueForm(event);

              onChange(event, child);
            }}
            {...selectProps}
            {...otherFieldProps}
          >
            {list.map((item) => (
              <MenuItem
                sx={{
                  p: 0
                }}
                key={item.code || item.id}
                value={item.code || item.id}
              >
                {item.name || item.label}
              </MenuItem>
            ))}
          </Select>
        )}
        {...controlProps}
      />
    </Stack>
  );
};

type AppFormControlSelectProps<T extends FieldValues> = StackProps & {
  label: string;
  control: Control<any, object>;
  name: FieldPath<T>;
  list: Array<{
    id?: string | number;
    name?: string;
    label?: string;
    code?: string | number;
  }>;

  isHasAllOption?: false;
  rules?: RegisterOptions<T>;
  required?: boolean;
  controlProps?: Omit<ControllerProps, 'render' | 'name' | 'control'>;
  labelProps?: InputLabelProps;
  selectProps?: SelectProps;
  onChangeValueForm?: (event?: SelectChangeEvent<unknown>) => void;
};

export default memo(ControlSelect);
