import {Platform} from 'react-native';

const nativeDriver = (flag = true) => {
  return Platform.OS === 'android' ? flag : false;
};

export {nativeDriver};
