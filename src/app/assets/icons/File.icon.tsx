import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';

const FileIcon: React.FC<iconProps> = ({
  width = rs(27),
  height = rs(27),
  fill = colors.white,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 27 27" fill="none">
      <G clipPath="url(#clip0_4058_13848)" fill={fill}>
        <Path d="M6.294 18.9v-6.247c-.01-.36.09-.715.284-1.019a1.762 1.762 0 011.427-.83H18.859a1.815 1.815 0 011.795 1.429c.028.137.043.277.044.417v12.524a1.805 1.805 0 01-1.631 1.829c-.05.003-.1.003-.15 0H8.075a1.788 1.788 0 01-1.749-1.506 2.614 2.614 0 01-.03-.389c-.002-2.07-.003-4.139-.002-6.207zm10.71-.57l-.027-.03-2.847-2.846a.888.888 0 00-1.28.013l-2.797 2.798c-.023.022-.043.047-.053.058l1.276 1.28c.43-.437.87-.879 1.33-1.34v4.343h1.792v-4.322l.033-.018 1.314 1.324 1.258-1.26z" />
        <Path d="M21.129 5.425h-4.023v1.792H23.716a.203.203 0 01.189.1 4.43 4.43 0 01.84 2.609c0 .085.03.107.108.139 1.152.422 1.868 1.235 2.098 2.44a3.14 3.14 0 01-3.073 3.693h-1.386v-3.606a3.592 3.592 0 00-2.977-3.527 3.84 3.84 0 00-.627-.057H8.102a3.594 3.594 0 00-3.596 3.602c-.008 1.155 0 2.31 0 3.465v.128h-1.39a3.148 3.148 0 01-.967-6.133.122.122 0 00.097-.141 4.488 4.488 0 013.452-4.38.215.215 0 00.176-.16 7.883 7.883 0 011.937-3.048 8.088 8.088 0 0113.282 2.987c.01.025.023.056.036.097z" />
      </G>
      <Defs>
        <ClipPath id="clip0_4058_13848">
          <Path fill={fill} d="M0 0H27V27H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default FileIcon;
