import {View, Text, ViewStyle, ActivityIndicator} from 'react-native';
import React from 'react';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import EmptyIcon from '../../assets/images/svg/emptyIcon.svg';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
const EmptyContent: React.FC<{
  text?: string;
  style?: ViewStyle;
  forLoading?: boolean;
  loadingColor?: string;
}> = ({text = '', style = {}, forLoading = false, loadingColor}) => {
  const {colors} = useTheme() as any;
  return (
    <View style={[{marginTop: rs(70), alignItems: `${'center'}`}, style]}>
      {forLoading ? (
        <ActivityIndicator
          size={'large'}
          color={loadingColor || colors.primary}
        />
      ) : (
        <View
          style={[
            globalStyles.flexRow,
            {gap: rs(5), width: `${'70%'}`, justifyContent: `${'center'}`},
          ]}>
          <EmptyIcon />
          <Text
            numberOfLines={2}
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {
                textAlign: `${'center'}`,
                color: colors.primary,
              },
            ]}>
            {text}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmptyContent;
