import { SvgIcon, SvgIconProps } from '@mui/material';
import { memo } from 'react';

const SpeakLangueIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="M10 3H8v2H3v2h8.015a8.507 8.507 0 0 1-1.314 4.286L6.707 8.293 5.293 9.707l3.166 3.166c-.297.312-.606.6-.918.865a14.317 14.317 0 0 1-3.565 2.196 8.387 8.387 0 0 1-.297.119l-.012.004L4 17l.334.943.004-.002.007-.002.025-.01a7.958 7.958 0 0 0 .383-.152 16.31 16.31 0 0 0 4.081-2.514c.35-.297.699-.622 1.039-.976l1.42 1.42 1.414-1.414-1.563-1.563A10.502 10.502 0 0 0 13.017 7H15V5h-5V3Zm8.253 17-.597-1.596H14.34L13.74 20H11.7l3.264-8.4h2.064l3.265 8.4h-2.04Zm-2.255-6.027 1.02 2.727h-2.041l1.02-2.727Z"
        clipRule="evenodd"
      ></path>
    </SvgIcon>
  );
};

export default memo(SpeakLangueIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
