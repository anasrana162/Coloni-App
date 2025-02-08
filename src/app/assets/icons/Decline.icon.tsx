import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';

const DeclineIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(21),
  fill = colors.white,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      <Path
        d="M.757 18.29c-.381.38-.396 1.025 0 1.406.38.396 1.025.381 1.406 0L10 11.86l7.837 7.837c.38.381 1.025.396 1.406 0 .396-.38.381-1.025 0-1.406l-7.837-7.837 7.837-7.851a.977.977 0 000-1.392c-.38-.396-1.025-.38-1.406 0L10 9.047 2.163 1.21c-.38-.38-1.025-.396-1.406 0a.977.977 0 000 1.392l7.837 7.851L.757 18.29z"
        fill={fill}
      />
    </Svg>
  );
};

export default DeclineIcon;
