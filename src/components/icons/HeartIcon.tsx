import { SvgIcon, SvgIconProps } from '@mui/material';
import { memo } from 'react';

const HeartIcon = ({ sx, ...otherProps }: IIconProps) => {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ fontSize: 'inherit', ...sx }}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="M12.899 5.94a4.913 4.913 0 1 1 6.835 7.058l-7.736 7.252-7.735-7.252a4.913 4.913 0 1 1 6.835-7.059l.9.9.901-.9Zm5.534 1.413a2.913 2.913 0 0 0-4.12 0l-2.315 2.315-2.315-2.315a2.913 2.913 0 1 0-4.052 4.186l6.367 5.97 6.368-5.97a2.913 2.913 0 0 0 .067-4.186Z"
        clipRule="evenodd"
      ></path>
    </SvgIcon>
  );
};

export default memo(HeartIcon);

export interface IIconProps extends SvgIconProps {
  sx?: object;
  className?: string;
}
