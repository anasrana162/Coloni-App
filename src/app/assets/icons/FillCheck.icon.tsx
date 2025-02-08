import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
const FillCheckIcon: React.FC<iconProps> = ({
  width = rs(33),
  height = rs(33),
  fill ="#41D195"
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
      <Path
        d="M16.37 2.861c-7.444 0-13.51 6.066-13.51 13.51 0 7.443 6.066 13.508 13.51 13.508 7.443 0 13.508-6.065 13.508-13.509 0-7.443-6.065-13.509-13.509-13.509zm6.457 10.402l-7.66 7.66a1.012 1.012 0 01-1.432 0L9.912 17.1a1.02 1.02 0 010-1.432 1.02 1.02 0 011.432 0l3.107 3.107 6.944-6.944a1.02 1.02 0 011.432 0 1.02 1.02 0 010 1.432z"
        fill={fill}
      />
    </Svg>
  );
};

export default FillCheckIcon;
