import {View, TextInput} from 'react-native';
import React, {useRef} from 'react';
import {inputLeftIconProps} from '../../../types/components.interface';
import {useTheme} from '@react-navigation/native';
import {textInputStyles} from './textInput.styles';
const IconWithInput: React.FC<inputLeftIconProps> = ({
  icon,
  placeholder = '',
  onChangeText,
  defaultValue = '',
  name,
  inputProps = {},
  style,
  inputRef,
}) => {
  const containerRef = useRef<any>(null);
  const {colors} = useTheme() as any;
  const styles = textInputStyles(colors);
  const handleOnChange = (text: string) => {
    if (name && name?.trim() !== '') {
      onChangeText && onChangeText(text, name);
    } else {
      onChangeText && onChangeText(text, undefined);
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
      {icon && <View>{icon}</View>}
      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOnChange}
        ref={inputRef}
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

export default IconWithInput;
