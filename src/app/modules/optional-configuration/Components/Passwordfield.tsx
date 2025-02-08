import {View, TextInput, Pressable, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {inputLeftIconProps} from '../../../types/components.interface';
import LockIcon from '../../../assets/icons/Lock.icon';
import EyeOffIcon from '../../../assets/icons/EyeOff.icon';
import EyeOnIcon from '../../../assets/icons/EyeOn.icon';
import {useTheme} from '@react-navigation/native';
import {textInputStyles} from '../../../components/core/text-input/textInput.styles'
import { colors } from '../../../assets/global-styles/color.assets';
import { customPadding } from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
const PasswordField: React.FC<inputLeftIconProps> = ({
  placeholder = '',
  onChangeText,
  defaultValue = '',
  inputProps = {},
  style = {},
  inputRef,
  name = '',
}) => {
  const containerRef = useRef<any>(null);
  const {colors} = useTheme() as any;
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
    <View style={styles.container} ref={containerRef}>
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
        selectionColor={colors.primary}
        secureTextEntry={!isShowPass}
        {...inputProps}
      />
      <View>
        <Pressable onPress={toggleShowPass}>
          {isShowPass !== true ? <EyeOffIcon /> : <EyeOnIcon />}
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        gap: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.transparent,
        backgroundColor: colors.graySoft,
        ...customPadding(0, 12, 0, 12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      onlyTextContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.transparent,
        backgroundColor: colors.graySoft,
        ...customPadding(0, 16, 0, 16),
        minHeight: rs(0),
      },
      activeContainer: {
        borderColor: colors.primary,
      },
      errorContainer: { borderColor: colors.error1 },
      input: {
        ...typographies(colors).ralewayMedium12,
        color: colors.grayDark,
        flexGrow: 1,
      },

});

export default PasswordField;
