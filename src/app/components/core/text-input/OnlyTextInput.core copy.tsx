import {View, TextInput} from 'react-native';
import React, {useRef} from 'react';
import {inputLeftIconProps} from '../../../types/components.interface';
import {useTheme} from '@react-navigation/native';
import {textInputStyles} from './textInput.styles';
const OnlyTextInput: React.FC<inputLeftIconProps> = ({
  placeholder = '',
  onChangeText,
  defaultValue = '',
  name,
  validationRules = undefined,
  inputProps = {},
  style = {},
}) => {
  const containerRef = useRef<any>(null);
  const {colors} = useTheme() as any;
  const styles = textInputStyles(colors);
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
    <View style={[styles.container, style]} ref={containerRef}>
      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOnChange}
        placeholder={placeholder}
        selectionColor={colors.primary}
        placeholderTextColor={colors.gray1}
        defaultValue={defaultValue?.toString()}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...inputProps}
      />
    </View>
  );
};

export default OnlyTextInput;
