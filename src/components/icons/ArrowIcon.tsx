import React, { memo } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const ArrowIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 17 17"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <g opacity="0.9">
        <path
          d="M6.87324 15.1935L12.7995 9.26728C13.1586 8.90812 13.1586 8.54895 12.7995 8.18979C12.4403 7.83062 12.0811 7.83062 11.722 8.18979L5.79574 14.116C5.43658 14.4752 5.43658 14.8344 5.79574 15.1935C6.15491 15.5527 6.51407 15.5527 6.87324 15.1935Z"
          fill="currentColor"
        />
        <path
          d="M5.79574 3.17353L11.722 9.09977C12.0811 9.45893 12.4403 9.45893 12.7995 9.09977C13.1586 8.7406 13.1586 8.38143 12.7995 8.02227L6.87324 2.09604C6.51407 1.73687 6.15491 1.73687 5.79574 2.09604C5.43658 2.4552 5.43658 2.81437 5.79574 3.17353Z"
          fill="currentColor"
        />
      </g>
    </SvgIcon>
  );
};

export default memo(ArrowIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
