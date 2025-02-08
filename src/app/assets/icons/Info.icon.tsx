import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
const InfoIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(20),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 50 50" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"
        fill={fill || colors.black}
      />
    </Svg>
  );
};

export default InfoIcon;