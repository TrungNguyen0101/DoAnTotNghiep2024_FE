import { memo } from 'react';
import { Rating, RatingProps } from '@mui/material';
import { StarIcon } from '../icons';

const AppRating = ({ sx, ...otherProps }: RatingProps) => {
  return (
    <Rating
      icon={<StarIcon />}
      emptyIcon={<StarIcon />}
      sx={{ fontSize: '16px', ...sx }}
      {...otherProps}
    />
  );
};

export default memo(AppRating);
