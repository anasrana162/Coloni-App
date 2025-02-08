import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
import {headerProps, headerPropstwo} from '../../../types/components.interface';
import {useCustomNavigation} from '../../../packages/navigation.package';
import {useTheme} from '@react-navigation/native';

const SVGIcon = () => {
  return (
    <View style={headerStyles().position}>
      <Svg width={SCREEN_WIDTH} height="150" viewBox="0 0 375 114" fill="none">
        <Ellipse
          opacity="0.1"
          cx="198.5"
          cy="-94.5"
          rx="294.5"
          ry="170.5"
          fill="#234F68"
        />
      </Svg>
    </View>
  );
};

const Header: React.FC<headerPropstwo> = ({
  text = '',
  leftIcon = true,
  leftControl,
  rightControl,
  rightIcon,
  secondRightIcon,
  secondRightControl,
  showBg = true,
  rightBg,
  heading,
  body,
}) => {
  const navigation = useCustomNavigation();
  const {colors} = useTheme() as any;
  const styles = headerStyles(rightBg || colors.graySoft, heading, colors);

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
              <LeftArrowIcon />
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
            {text}
          </Text>
          {heading && (
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray3},
              ]}>
              {heading}
            </Text>
          )}
          {body && (
            <Text
              style={[
                typographies(colors).montserratMedium10,
                {color: colors.gray3, lineHeight: rs(20)},
              ]}>
              {body}
            </Text>
          )}
        </View>
        <View style={styles.rightIconsContainer}>
          {rightIcon && (
            <TouchableOpacity
              style={[styles.rightArrowIcon, styles.rightArrow]}
              activeOpacity={0.6}
              onPress={rightControl}>
              {rightIcon}
            </TouchableOpacity>
          )}
          {secondRightIcon && (
            <TouchableOpacity
              style={[styles.rightArrowIcon, styles.rightArrow]}
              activeOpacity={0.6}
              onPress={secondRightControl}>
              {secondRightIcon}
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
      alignItems: 'center',
      justifyContent: 'space-between',
      ...customPadding(9, 25, 0, 25),
      backgroundColor: colors?.transparent,
    },
    arrowIcon: {
      height: rs(50),
      width: rs(50),
      backgroundColor: colors?.graySoft,
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
      marginLeft: 10,
    },
    leftArrow: {position: 'relative'},
    rightArrow: {position: 'relative'},
    rightIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    position: {position: 'absolute', top: 0},
    text: {
      flexShrink: 1,
      textAlign: 'center',
      color: colors?.primaryText,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
