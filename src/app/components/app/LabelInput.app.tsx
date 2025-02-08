import React from 'react';
import {TextInputProps, View, ViewStyle, Text} from 'react-native';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../core/text-input/OnlyTextInput.core';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

interface props {
  label?: string;
  placeholder?: string;
  style?: ViewStyle;
  inputProps?: TextInputProps;
  labelIcon?: any;
  name?: string;
  defaultValue?: string;
  onChangeText?: (value: string, name?: string) => void;
  inputRef?: any;
  editable?: boolean;
  keyboardType: any;
  txtInputStyle: any;
  placeholderColor: string;
}

const LabelInput: React.FC<props> = ({
  label,
  placeholder,
  style,
  inputProps,
  labelIcon,
  defaultValue,
  name,
  onChangeText,
  inputRef,
  editable,
  keyboardType,
  txtInputStyle,
  placeholderColor,
}) => {
  const {colors} = useTheme() as any;

  const {t} = useTranslation();
  return (
    <View style={[{marginBottom: rs(13)}, style]}>
      <View style={[globalStyles.flexRow, {gap: rs(6)}]}>
        {label && (
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {
                color: colors.primary,
                marginBottom: rs(6),
                marginLeft: rs(12),
              },
            ]}>
            {t(`${label}`)}{' '}
          </Text>
        )}
        {labelIcon}
      </View>
      <OnlyTextInput
        placeholderColor={placeholderColor}
        style={txtInputStyle}
        placeholder={t(`${placeholder}`)}
        inputProps={{...inputProps, multiline: true}}
        defaultValue={defaultValue}
        name={name}
        editable={editable}
        inputRef={inputRef}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default LabelInput;
