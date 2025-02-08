import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const ArrowLeftIcon: React.FC<iconProps> = ({
  width = rs(24),
  height = rs(24),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.828 11H20v2H7.828l5.364 5.365-1.414 1.414L4 12l7.778-7.778 1.414 1.414L7.828 11z"
        fill={fill || colors.black}
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
