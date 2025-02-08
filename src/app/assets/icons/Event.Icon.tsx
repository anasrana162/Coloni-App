import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconProps } from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import { useTheme } from '@react-navigation/native';

const EventIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(22),
  fill,
}) => {
  const { colors } = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 20 22" fill="none">
<Path d="M18.0004 6.40002V16.9C18.0004 18.6 16.7004 19.9 15.0004 19.9H3.90039C3.90039 21 4.80039 21.9 5.90039 21.9H16.0004C18.2004 21.9 20.0004 20.1 20.0004 17.9V8.40002C20.0004 7.30002 19.1004 6.40002 18.0004 6.40002Z"       
  fill={fill || colors.gray3}/>
<Path d="M3 0.0999756V2.09998H2C0.9 2.09998 0 2.99998 0 4.09998V16.1C0 17.2 0.9 18.1 2 18.1H14.2C15.3 18.1 16.2 17.2 16.2 16.1V4.09998C16.2 2.99998 15.3 2.09998 14.2 2.09998H13.2V0.0999756H11.2V2.09998H5V0.0999756H3ZM2 7.09998H14.2V16.1H2V7.09998Z"  fill={fill || colors.gray3}/>
<Path d="M11.7 15.3L9.3 13.9L7 15.3L7.6 12.6L5.5 10.8L8.3 10.6L9.4 8L10.5 10.5L13.3 10.8L11.2 12.6L11.7 15.3Z"  fill={fill || colors.gray3}/>

    </Svg>
  );
};

export default EventIcon;
