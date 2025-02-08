import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const LockIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(20),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        d="M13.333 10H6.667m6.666 0H14.5a.5.5 0 01.5.5v5.667a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-5.666a.5.5 0 01.5-.5h7.833zm0 0V6.668c0-1.11-.666-3.333-3.333-3.333-2.667 0-3.333 2.222-3.333 3.333v3.334h6.666z"
        stroke={fill || colors.secondary}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LockIcon;
