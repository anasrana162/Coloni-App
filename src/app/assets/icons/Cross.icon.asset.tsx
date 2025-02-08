import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {useTheme} from '@react-navigation/native';

const CrossIcon: React.FC<iconProps> = ({width = 24, height = 24, fill}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.3637 5.3637C5.71517 5.01223 6.28502 5.01223 6.63649 5.3637L12.0001 10.7273L17.3637 5.3637C17.7152 5.01223 18.285 5.01223 18.6365 5.3637C18.988 5.71517 18.988 6.28502 18.6365 6.63649L13.2729 12.0001L18.6365 17.3637C18.988 17.7152 18.988 18.285 18.6365 18.6365C18.285 18.988 17.7152 18.988 17.3637 18.6365L12.0001 13.2729L6.63649 18.6365C6.28502 18.988 5.71517 18.988 5.3637 18.6365C5.01223 18.285 5.01223 17.7152 5.3637 17.3637L10.7273 12.0001L5.3637 6.63649C5.01223 6.28502 5.01223 5.71517 5.3637 5.3637Z"
        fill={fill || colors.black}
        fillOpacity={1}
      />
    </Svg>
  );
};
export default CrossIcon;
