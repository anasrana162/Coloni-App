import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import rs from '../global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';

const HomeIcon: React.FC<iconProps> = ({
  width = rs(20),
  height = rs(20),
  fill,
}) => {
  const {colors} = useTheme() as any;
  return (
    <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 21.6v-3.099c0-.465 0-.697-.038-.89a2 2 0 00-1.572-1.572c-.193-.038-.425-.038-.89-.038s-.697 0-.89.038a2 2 0 00-1.572 1.572c-.038.193-.038.425-.038.89V21.6H8.717c-.354 0-.895-.067-1.435-.218-.525-.146-1.164-.401-1.615-.848a4.864 4.864 0 01-.885-1.115l-.015-.024c-.198-.33-.338-.564-.465-.932-.128-.369-.172-.715-.234-1.209l-.008-.057-.742-5.836a.75.75 0 01-.006-.094c0-1.091.509-2.12 1.375-2.787l5.603-4.32h2.21v.216-.217h2.209l5.602 4.32v.001a3.518 3.518 0 011.375 2.787.749.749 0 01-.006.094l-.742 5.836-.007.057c-.063.494-.107.84-.234 1.21-.128.367-.268.6-.466.93l-.015.025c-.347.58-.592.824-.885 1.115-.45.447-1.09.702-1.615.849-.54.15-1.08.217-1.434.217H15zM10.29 4.16h2.21v-.742h-.032c-.788 0-1.555.26-2.178.741zm4.419 0h-2.21v-.742h.032c.788 0 1.554.26 2.178.741z"
        fill={fill || colors.gray3}
      />
    </Svg>
  );
};

export default HomeIcon;
