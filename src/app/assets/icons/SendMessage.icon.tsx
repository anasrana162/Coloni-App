import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';

const SendMessageIcon: React.FC<iconProps> = ({
  width = rs(22),
  height = rs(19),
  fill = colors.primary,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 19" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.758 1.086l-10.21 17.557a.715.715 0 01-1.31-.178L7.61 8.601l-.022-.03a.729.729 0 01-.049-.105L.354 1.23C-.097.777.222 0 .861 0h20.278c.554 0 .899.605.619 1.086zm-2.58 1.58l-10.1 5.871 2.1 7.887 8-13.757zM2.591 1.444l15.827-.001L8.384 7.274 2.59 1.443z"
        fill={fill}
      />
    </Svg>
  );
};

export default SendMessageIcon;
