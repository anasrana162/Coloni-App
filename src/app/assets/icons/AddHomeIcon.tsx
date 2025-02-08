import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';  // Optional: For theme colors

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const AddHomeIcon: React.FC<IconProps> = ({
  width = 18,
  height = 18,
  fill,
}) => {
  const { colors } = useTheme(); 

  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.46728 5.24047C0 6.09415 0 7.12394 0 9.18351V10.5525C0 14.0632 0 15.8187 1.05441 16.9093C2.10883 18 3.80588 18 7.2 18H10.8C14.1941 18 15.8912 18 16.9456 16.9093C18 15.8187 18 14.0632 18 10.5525V9.18351C18 7.12394 18 6.09415 17.5327 5.24047C17.0654 4.38679 16.2118 3.85696 14.5044 2.79731L12.7044 1.68018C10.8995 0.560061 9.99711 0 9 0C8.00289 0 7.10045 0.560061 5.29563 1.68018L3.49563 2.79732C1.78825 3.85696 0.93456 4.38679 0.46728 5.24047ZM9.675 8.1C9.675 7.72722 9.37278 7.425 9 7.425C8.62722 7.425 8.325 7.72722 8.325 8.1V10.125H6.3C5.92721 10.125 5.625 10.4272 5.625 10.8C5.625 11.1728 5.92721 11.475 6.3 11.475H8.325V13.5C8.325 13.8728 8.62722 14.175 9 14.175C9.37278 14.175 9.675 13.8728 9.675 13.5V11.475H11.7C12.0728 11.475 12.375 11.1728 12.375 10.8C12.375 10.4272 12.0728 10.125 11.7 10.125H9.675V8.1Z"
        fill={fill || "#3D65A7"}
      />
    </Svg>
  );
};

export default AddHomeIcon;
