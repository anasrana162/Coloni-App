import * as React from 'react';
import Svg, {Ellipse, Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';

const SearchIcon: React.FC<iconProps> = ({
  width = rs(15),
  height = rs(14),
  fill = colors.white,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 15 14" fill="none">
      <Ellipse
        cx={7.35019}
        cy={6.62093}
        rx={6.11387}
        ry={5.48421}
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.603 10.72L14 12.866l-2.397-2.144z"
        fill={fill}
      />
      <Path
        d="M11.603 10.72L14 12.866"
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
