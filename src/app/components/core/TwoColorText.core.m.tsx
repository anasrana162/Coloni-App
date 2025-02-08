import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {twoColorProps} from '../../types/components.interface';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';

const TwoColorText: React.FC<twoColorProps> = ({
  text1,
  text2,
  color1,
  color2,
  light = false,
  style = {},
}) => {
  const {colors} = useTheme() as any;
  const styles = twoColorStyles(
    color1 || colors.primary,
    color2 || colors.secondary,
  );
  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          light
            ? typographies(colors).montserratMedium17
            : typographies(colors).montserratSemibold16,
          styles.color1,
          {fontSize: 20},
        ]}>
        {text1}{' '}
        <Text
          style={[
            typographies(colors).montserratSemibold16,
            styles.color2,
            {fontSize: 20},
          ]}>
          {text2}
        </Text>
      </Text>
    </View>
  );
};

export default TwoColorText;

const twoColorStyles = (color1: string, color2: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '60%',
    },
    color1: {color: color1},
    color2: {color: color2},
  });
