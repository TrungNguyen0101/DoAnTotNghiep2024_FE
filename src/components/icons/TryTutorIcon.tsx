import { SvgIcon, SvgIconProps } from '@mui/material';
import { memo } from 'react';

const TryTutorIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="m14 10 1-8L2 14h9l-1 8 12-12h-8Z"
        clipRule="evenodd"
      ></path>
    </SvgIcon>
  );
};

export default memo(TryTutorIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
