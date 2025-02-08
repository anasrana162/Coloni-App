import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
const ClockIcon: React.FC<iconProps> = ({
  width = rs(14),
  height = rs(13),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill="none">
      <Path
        d="M255.8 48C141 48 48 141.2 48 256s93 208 207.8 208c115 0 208.2-93.2 208.2-208S370.8 48 255.8 48zm.2 374.4c-91.9 0-166.4-74.5-166.4-166.4S164.1 89.6 256 89.6 422.4 164.1 422.4 256 347.9 422.4 256 422.4z"
        fill={fill || colors.primary}
      />
      <Path
        d="M266.4 152h-31.2v124.8l109.2 65.5 15.6-25.6-93.6-55.5V152z"
        fill={fill || colors.primary}
      />
    </Svg>
  );
};

export default ClockIcon;
