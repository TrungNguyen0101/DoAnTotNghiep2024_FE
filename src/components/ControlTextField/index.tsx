import {
  InputLabel,
  InputLabelProps,
  Stack,
  StackProps,
  TextField,
  TextFieldProps
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

const ControlTextField = <T extends FieldValues>({
  label,
  control,
  name,
  rules,
  controlProps,
  required = false,
  textfieldProps,
  onChangeValueForm,
  labelProps,
  ...otherProps
}: AppFormControlTextFieldProps<T>) => {
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
        control={control}
        name={name}
        rules={{ required, ...rules }}
        {...controlProps}
        render={({ field: { onChange, ...otherFieldProps } }) => (
          <TextField
            size="small"
            margin="normal"
            id={name}
            required={required}
            onChange={(event) => {
              if (onChangeValueForm instanceof Function)
                onChangeValueForm(event);

              onChange(event);
            }}
            {...otherFieldProps}
            {...textfieldProps}
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export type AppFormControlTextFieldProps<T extends FieldValues> = StackProps & {
  label?: string;
  control: Control<any, object>;
  name: FieldPath<T>;

  rules?: RegisterOptions<T>;
  required?: boolean;
  controlProps?: Omit<ControllerProps, 'render' | 'name' | 'control'>;
  textfieldProps?: TextFieldProps;
  onChangeValueForm?: (event?: React.ChangeEvent) => void;
  labelProps?: InputLabelProps;
};

export default memo(ControlTextField);
