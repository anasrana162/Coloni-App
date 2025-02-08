import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const CallIcon: React.FC<iconProps> = ({
  width = rs(26),
  height = rs(26),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 26 26" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.44 25.282C8.72 25.282 0 16.55 0 5.815 0 2.608 2.606 0 5.807 0c.328 0 .653.028.967.082.307.05.616.128.915.231.412.143.72.488.817.913l1.73 7.54c.094.414-.026.849-.32 1.157-.173.18-.177.184-1.742 1.004 1.267 2.748 3.47 4.946 6.16 6.172.82-1.568.825-1.573 1.004-1.745.31-.296.745-.411 1.158-.32l7.528 1.73c.423.098.768.406.91.817.104.299.181.607.233.924.053.312.08.636.08.962 0 3.207-2.604 5.815-5.806 5.815z"
        fill={fill || colors.active}
      />
    </Svg>
  );
};

export default CallIcon;
