import React, {useRef} from 'react';
import {Text, TextInput, View} from 'react-native';
import {multilineProps} from '../../../types/components.interface';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import {textInputStyles} from './textInput.styles';

import {useTranslation} from 'react-i18next';
const MultiLineInput: React.FC<multilineProps> = ({
  placeholder = '',
  onChangeText,
  defaultValue = '',
  name,
  validationRules = undefined,
  inputProps = {},
  placeholderTextColor,
  label,
  style,
  textInputStyle,
}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const styles = textInputStyles(colors);
  const containerRef = useRef<any>(null);
  const handleOnChange = (text: string) => {
    if (name && name?.trim() !== '') {
      onChangeText && onChangeText(text, name, validationRules);
    } else {
      onChangeText && onChangeText(text, undefined, validationRules);
    }
  };
  const handleOnFocus = () => {
    containerRef.current.setNativeProps({
      style: {...styles.activeContainer},
    });
  };
  const handleOnBlur = () => {
    containerRef.current.setNativeProps({
      style: {...styles.container},
    });
  };
  return (
    <View style={[{marginBottom: rs(13)}, style]}>
      {label && (
        <Text
          style={[
            typographies(colors).ralewayMedium14,
            {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
          ]}>
          {trans(label)}
        </Text>
      )}
      <View style={[styles.container, textInputStyle]} ref={containerRef}>
        <TextInput
          style={[styles.input, styles.multi]}
          numberOfLines={5}
          onChangeText={handleOnChange}
          placeholder={trans(placeholder)}
          placeholderTextColor={placeholderTextColor || colors.gray1}
          defaultValue={defaultValue?.toString()}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          multiline={true}
          {...inputProps}
        />
      </View>
    </View>
  );
};

export default MultiLineInput;
