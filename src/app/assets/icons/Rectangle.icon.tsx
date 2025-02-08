import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const RectangleIcon: React.FC<iconProps> = ({
  width = rs(21),
  height = rs(17),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 21 17" fill="none">
      <Path
        fill={fill || colors.gray3}
        stroke="#3679AE"
        d="M0.5 0.5H20.5V16.5H0.5z"
      />
    </Svg>
  );
};

export default RectangleIcon;
