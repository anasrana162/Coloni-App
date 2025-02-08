import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const EmailIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(20),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5.833 7.5L10 10.417 14.167 7.5"
        stroke={fill || colors.secondary}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.667 14.166V5.833a1.667 1.667 0 011.666-1.667h13.334a1.666 1.666 0 011.666 1.667v8.333a1.666 1.666 0 01-1.666 1.667H3.333a1.667 1.667 0 01-1.666-1.667z"
        stroke={fill || colors.secondary}
        strokeWidth={1.6}
      />
    </Svg>
  );
};

export default EmailIcon;
