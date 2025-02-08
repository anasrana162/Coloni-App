import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Path, Svg} from 'react-native-svg';
import FillCheckIcon from '../../assets/icons/FillCheck.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {customMargin} from '../../assets/global-styles/global.style.asset';
import Badge from './Badge.app';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
interface props {
  data: {type: string; value: string}[];
  header: string;
  amount: string | number;
}
const SvgIcon = () => {
  return (
    <Svg width={'100%'} height="196" viewBox="0 0 333 196" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.63034 18.1864C0 25.3113 0 34.6384 0 53.2925V196L9.65186 196C9.65186 193.918 13.5411 192.231 18.3388 192.231C23.1365 192.231 27.0258 193.918 27.0258 196H34.7476C34.7476 193.918 38.6368 192.231 43.4345 192.231C48.2322 192.231 52.1215 193.918 52.1215 196H59.8438C59.8438 193.918 63.733 192.231 68.5307 192.231C73.3284 192.231 77.2177 193.918 77.2177 196H84.9395C84.9395 193.918 88.8287 192.231 93.6264 192.231C98.4241 192.231 102.313 193.918 102.313 196H110.035C110.035 193.918 113.924 192.231 118.722 192.231C123.519 192.231 127.409 193.918 127.409 196H135.131C135.131 193.918 139.02 192.231 143.818 192.231C148.615 192.231 152.505 193.918 152.505 196H160.226C160.226 193.918 164.115 192.231 168.913 192.231C173.711 192.231 177.6 193.918 177.6 196H185.322C185.322 193.918 189.211 192.231 194.009 192.231C198.806 192.231 202.696 193.918 202.696 196H210.417C210.417 193.918 214.307 192.231 219.104 192.231C223.902 192.231 227.791 193.918 227.791 196H235.513C235.513 193.918 239.402 192.231 244.2 192.231C248.997 192.231 252.887 193.918 252.887 196H260.608C260.608 193.918 264.498 192.231 269.295 192.231C274.093 192.231 277.982 193.918 277.982 196H285.704C285.704 193.918 289.593 192.231 294.391 192.231C299.189 192.231 303.078 193.918 303.078 196H310.8C310.8 193.918 314.69 192.231 319.487 192.231C324.285 192.231 328.174 193.918 328.174 196L333 196V53.2925C333 34.6384 333 25.3113 329.37 18.1864C326.176 11.9191 321.081 6.82367 314.814 3.63034C307.689 0 298.362 0 279.707 0H53.2925C34.6384 0 25.3113 0 18.1864 3.63034C11.9191 6.82367 6.82367 11.9191 3.63034 18.1864Z"
        fill="#3679AE"
      />
    </Svg>
  );
};
const AmountCard: React.FC<props> = ({data, amount, header}) => {
  const {colors} = useTheme() as any;
  const styles = amountCardStyles(colors);
  const {t: trans} = useTranslation();
  return (
    <View>
      <SvgIcon />
      <View style={styles.container}>
        <View style={styles.fillIcon}>
          <FillCheckIcon />
        </View>
        <Text
          style={[
            typographies(colors).montserratSemibold22,
            {lineHeight: rs(40), color: colors.pureWhite},
          ]}>
          {amount}
        </Text>
        <Badge
          text={trans(header)}
          bgColor={colors.gray5}
          textColor={colors.primary}
          classes="small"
        />
        <View style={styles.line} />
        <View style={styles.bottomContainer}>
          {data?.map((item, index: number) => (
            <View style={styles.eachContainer} key={index}>
              <Text
                style={[
                  typographies(colors).montserratNormal12,
                  {color: colors.pureWhite, lineHeight: rs(25)},
                ]}>
                {trans(item.type)}
              </Text>
              <Text
                style={[
                  typographies(colors).montserratNormal12,
                  {color: colors.pureWhite, lineHeight: rs(25)},
                ]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AmountCard;

const amountCardStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: rs(-28),
      alignItems: 'center',
      alignSelf: 'center',
      width: '100%',
    },
    fillIcon: {
      height: rs(56),
      width: rs(56),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 50,
      backgroundColor: colors.white,
    },
    line: {
      ...customMargin(5, 0, 11),
      height: rs(1.67),
      width: '90%',
      flexGrow: 1,
      backgroundColor: colors.white,
    },
    bottomContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%',
    },
    eachContainer: {alignItems: 'center', gap: 6},
  });
