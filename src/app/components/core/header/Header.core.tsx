import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import LeftArrowIcon from '../../../assets/icons/LeftArrow.icon';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {Ellipse, Svg} from 'react-native-svg';
import {SCREEN_WIDTH} from '../../../assets/ts/core.data';
import {headerProps} from '../../../types/components.interface';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {useTheme} from '@react-navigation/native';
import {colors} from '../../../assets/global-styles/color.assets';
import {useTranslation} from 'react-i18next';

const Header: React.FC<headerProps> = ({
  text = '',
  leftIcon = true,
  leftControl,
  rightControl,
  rightIcon,
  showBg = true,
  rightBg,
  heading,
  body,
}) => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const styles = headerStyles(rightBg || colors.graySoft, heading, colors);

  const SVGIcon = () => {
    return (
      <View style={headerStyles().position}>
        <Svg
          width={SCREEN_WIDTH}
          height="150"
          viewBox="0 0 375 114"
          fill="none">
          <Ellipse
            opacity="0.1"
            cx="198.5"
            cy="-94.5"
            rx="294.5"
            ry="170.5"
            fill={colors.gray12}
          />
        </Svg>
      </View>
    );
  };

  const {t} = useTranslation();

  return (
    <View style={[globalStyles.flexShrink1, {height: rs(114)}]}>
      {showBg && <SVGIcon />}
      <View style={styles.container}>
        <View>
          {leftIcon && (
            <TouchableOpacity
              style={[styles.arrowIcon, styles.leftArrow]}
              activeOpacity={0.6}
              onPress={() => leftControl || navigation.goBack()}>
              <LeftArrowIcon fill="#000" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={2}
            style={[
              typographies(colors).montserratSemibold,
              styles.text,
              {marginTop: heading ? 10 : 0},
            ]}>
            {t(`${text}`)}
          </Text>
          {heading && (
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray3},
              ]}>
              {t(`${heading}`)}
            </Text>
          )}
          {body && (
            <Text
              style={[
                typographies(colors).montserratMedium10,
                {color: colors.gray3, lineHeight: rs(20)},
              ]}>
              {t(`${body}`)}
            </Text>
          )}
        </View>
        <View>
          {rightIcon && (
            <TouchableOpacity
              style={[styles.rightArrowIcon, styles.rightArrow]}
              activeOpacity={0.6}
              onPress={rightControl}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const headerStyles = (rightBg?: string, heading?: string, colors?: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...customPadding(9, 25, 0, 25),
      flexShrink: 1,
      backgroundColor: colors?.transparent,
    },
    arrowIcon: {
      height: rs(50),
      width: rs(50),
      // backgroundColor: colors?.graySoft,
      backgroundColor: '#F5F4F8',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightArrowIcon: {
      height: rs(50),
      width: rs(50),
      backgroundColor: rightBg,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftArrow: {position: 'absolute', left: 0, zIndex: 1},
    rightArrow: {position: 'absolute', right: 0, zIndex: 1},
    position: {position: 'absolute', top: 0},
    text: {
      flexShrink: 1,
      textAlign: 'center',
      color: colors?.primaryText,
    },
    textContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 1,
      height: heading ? 'auto' : rs(54),
    },
  });
