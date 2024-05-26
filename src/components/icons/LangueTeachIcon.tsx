import React, { memo } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const LangueTeachIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path d="m12 21-7-3.8v-6L1 9l11-6 11 6v8h-2v-6.9l-2 1.1v6L12 21Zm0-8.3L18.85 9 12 5.3 5.15 9 12 12.7Zm0 6.025 5-2.7V12.25L12 15l-5-2.75v3.775l5 2.7Z"></path>
    </SvgIcon>
  );
};

export default memo(LangueTeachIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
