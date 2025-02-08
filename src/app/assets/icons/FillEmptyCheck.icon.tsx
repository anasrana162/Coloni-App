import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
const FillEmptyCheckIcon: React.FC<iconProps> = ({
  width = rs(33),
  height = rs(33),
  fill ="#41D195"
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 172 172" fill="none">
      <Path
        d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"
        fill={fill}
      />
    </Svg>
  );
};

export default FillEmptyCheckIcon;
