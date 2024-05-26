import { LinearProgress, LinearProgressProps } from '@mui/material';
import { memo } from 'react';

const AppLinearProgress = ({ sx, ...otherProps }: LinearProgressProps) => {
  return (
    <LinearProgress
      variant="determinate"
      sx={{
        borderRadius: '5px',
        height: 8,
        bgcolor: '#eeeeee',

        '& .MuiLinearProgress-bar': {
          bgcolor: 'grey.400',
          borderRadius: '5px'
        },
        ...sx
      }}
      {...otherProps}
    />
  );
};

export default memo(AppLinearProgress);
