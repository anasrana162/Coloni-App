import {Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const VerifyTime = () => {
  const [seconds, setSeconds] = useState(30);
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <Text
      style={[
        typographies(colors).montserratNormal16,
        {
          textAlign: `${'right'}`,
          color: seconds ? colors.black : colors.error1,
        },
      ]}>
      {`00:${seconds < 10 ? `0${seconds}` : seconds} ${trans('Sec')}`}
    </Text>
  );
};

export default VerifyTime;
