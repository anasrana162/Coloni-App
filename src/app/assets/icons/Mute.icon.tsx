import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {iconProps} from '../../types/components.interface';
import {colors} from '../global-styles/color.assets';
import rs from '../global-styles/responsiveSze.style.asset';

const MuteIcon: React.FC<iconProps> = ({
  width = rs(22),
  height = rs(25),
  fill = colors.white,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 25" fill="none">
      <Path
        d="M13.684 11.805V4.422c0-2.18-1.43-3.82-3.551-3.82-2.098 0-3.551 1.605-3.551 3.726v.363l7.102 7.114zm6.41 10.172a.693.693 0 00.996 0c.281-.258.27-.715 0-.985L1.895 1.81c-.258-.27-.727-.27-.997 0a.715.715 0 000 .996l19.196 19.172zM4.742 23.465a.708.708 0 00-.691.691c0 .364.316.68.691.68h10.781c.364 0 .68-.316.68-.68 0-.363-.316-.691-.68-.691h-4.71v-3.082c1.71-.117 3.175-.692 4.3-1.606l-.972-.972c-1.032.832-2.403 1.312-4.008 1.312-3.844 0-6.457-2.683-6.457-6.34v-2.52c0-.421-.27-.69-.668-.69-.399 0-.668.269-.668.69v2.52c0 4.22 2.812 7.313 7.101 7.606v3.082H4.742zm13.172-13.207c0-.422-.27-.692-.668-.692s-.668.27-.668.692v2.52c0 .597-.082 1.171-.223 1.699l1.102 1.101a8.609 8.609 0 00.457-2.8v-2.52zm-5.836 5.484l-5.496-5.508v2.368c0 2.18 1.43 3.808 3.55 3.808.774 0 1.442-.246 1.946-.668z"
        fill={fill}
      />
    </Svg>
  );
};

export default MuteIcon;
