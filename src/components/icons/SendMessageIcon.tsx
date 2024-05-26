import { SvgIcon, SvgIconProps } from '@mui/material';
import { memo } from 'react';

const SendMessageIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="M16 6H8a4 4 0 0 0-4 4v8h12a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4ZM8 4a6 6 0 0 0-6 6v10h14a6 6 0 0 0 6-6v-4a6 6 0 0 0-6-6H8Zm0 5h8v2H8V9Zm3 4H8v2h3v-2Z"
        clipRule="evenodd"
      ></path>
    </SvgIcon>
  );
};

export default memo(SendMessageIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
