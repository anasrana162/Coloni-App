import {View, TextInput, Pressable} from 'react-native';
import React, {useRef, useState} from 'react';
import {inputLeftIconProps} from '../../../types/components.interface';
import LockIcon from '../../../assets/icons/Lock.icon';
import EyeOffIcon from '../../../assets/icons/EyeOff.icon';
import EyeOnIcon from '../../../assets/icons/EyeOn.icon';
import {useTheme} from '@react-navigation/native';
import {textInputStyles} from './textInput.styles';
const PasswordInput: React.FC<inputLeftIconProps> = ({
  placeholder = '',
  onChangeText,
  defaultValue = '',
  inputProps = {},
  style = {},
  inputRef,
  maxLength,
  hideIcons,
  editable = true,
  secureTextEntry = false,
  name = '',
}) => {
  const containerRef = useRef<any>(null);
  const {colors} = useTheme() as any;
  const styles = textInputStyles(colors);
  const [isShowPass, setIsShowPass] = useState(false);
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
  const toggleShowPass = () => {
    setIsShowPass(!isShowPass);
  };
  return (
    <View style={[styles.container, style]} ref={containerRef}>
      {!hideIcons && (
        <View>
          <LockIcon />
        </View>
      )}
      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOnChange}
        placeholder={placeholder}
        ref={inputRef}
        placeholderTextColor={colors.gray1}
        defaultValue={defaultValue?.toString()}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        editable={editable}
        maxLength={maxLength}
        selectionColor={colors.primary}
        secureTextEntry={!isShowPass}
        {...inputProps}
      />
      {!hideIcons && (
        <View>
          <Pressable onPress={toggleShowPass}>
            {isShowPass !== true ? <EyeOffIcon /> : <EyeOnIcon />}
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default PasswordInput;
