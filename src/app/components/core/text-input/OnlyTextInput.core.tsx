import {View, TextInput, Keyboard} from 'react-native';
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
  rightIcon,
  inputRef,
  editable,
  keyboardType,
  placeholderColor = '',
}) => {
  const {colors} = useTheme() as any;
  const styles = textInputStyles(colors);
  const containerRef = useRef<any>(null);

  const handleOnChange = (text: string) => {
    if (name && name.trim() !== '') {
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
      style: {...styles.onlyTextContainer},
    });
  };

  return (
    <View style={[styles.onlyTextContainer, style]} ref={containerRef}>
      <TextInput
        style={[styles.input, {textAlignVertical: 'top'}]} // Ensure vertical text alignment
        multiline={true} // Allow multiline input
        onChangeText={handleOnChange}
        placeholder={placeholder}
        selectionColor={colors.primary}
        placeholderTextColor={placeholderColor || colors.gray1}
        defaultValue={defaultValue?.toString()}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        editable={editable}
        ref={inputRef}
        keyboardType={keyboardType ?? 'default'}
        {...inputProps}
      />
      {rightIcon}
    </View>
  );
};

export default OnlyTextInput;
