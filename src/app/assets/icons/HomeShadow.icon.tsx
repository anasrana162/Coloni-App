import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';
const HomeShadowIcon: React.FC<iconProps> = ({
  width = rs(25),
  height = rs(25),
  fill = colors.tertiary,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
      <Path d="M5.8 3.904h1.6v2.64L5.8 8.143V3.904z" fill={fill} />
      <Path
        d="M24.6 13.168c-.11 0-.24-.015-.313-.087l-11-11.001a.399.399 0 00-.566 0L1.716 13.085c-.072.072-.206.083-.316.083a.4.4 0 01-.4-.4c0-.11.006-.25.079-.322L12.614.932s.15-.164.39-.164c.24 0 .392.159.392.159L24.92 12.449c.072.072.081.208.081.319a.4.4 0 01-.4.4z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.8 23.231a.8.8 0 00.8-.8V10.99l-9.597-9.596L3.4 10.996V22.43a.8.8 0 00.8.8h17.6zm-11.392-10.24h5.12v10.24h-5.12v-10.24zm-1.807.176H5.529v5.836H8.6v-5.836zm8.798 0h3.072v5.836H17.4v-5.836z"
        fill={fill}
      />
      <Rect
        x={0.791992}
        y={22.4336}
        width={23.6558}
        height={1.94141}
        rx={0.970703}
        fill={fill}
      />
    </Svg>
  );
};

export default HomeShadowIcon;
