import { SvgIcon, SvgIconProps } from '@mui/material';
import { memo } from 'react';

const PersonIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="M7 8a5 5 0 1 1 10 0A5 5 0 0 1 7 8Zm13 13v-6H4v6h16Z"
        clipRule="evenodd"
      ></path>
    </SvgIcon>
  );
};

export default memo(PersonIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
