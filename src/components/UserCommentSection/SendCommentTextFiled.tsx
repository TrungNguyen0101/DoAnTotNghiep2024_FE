import { IconButton, InputAdornment } from '@mui/material';
import { memo, useState } from 'react';
import SendCommentIcon from '../icons/SendCommentIcon';
import ControlTextField from '../ControlTextField';

const SendCommentTextFiled = ({ control, name, variant }) => {
  const [isShowActiveIcon, setIsShowActiveIcon] = useState(false);

  const handleChangeValueForm = (value: any) => {
    setIsShowActiveIcon(Boolean(value));
  };



  console.log(control,name,variant);
  
  return (
    <ControlTextField
      name={name}
      width="100%"
      control={control}
      controlProps={{
        defaultValue: ''
      }}
      required
      textfieldProps={{
        placeholder: 'Viết bình luận ...',
        InputProps: {
          sx: { height: 48, borderRadius: 999, pl: '20px' },
          endAdornment: (
            <IconButton
              sx={{
                '&.MuiIconButton-root:hover': {
                  bgcolor: 'unset'
                }
              }}
              type="submit"
            >
              <InputAdornment
                sx={{
                  cursor: 'pointer',
                  fontSize: 22
                }}
                position="end"
              >
                <SendCommentIcon
                  sx={{
                    color: isShowActiveIcon ? 'primary.main' : 'inherit'
                  }}
                />
              </InputAdornment>
            </IconButton>
          )
        },
        autoComplete: 'off',
        variant: variant
      }}
      onChangeValueForm={(e: any) => handleChangeValueForm(e?.target?.value)}
    />
  );
};

export default memo(SendCommentTextFiled);
