import {View, TextInput, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {inputLeftIconProps} from '../../types/components.interface';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import SearchIcon from '../../assets/icons/Search.icon';
import {useTheme} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';

const SearchInput: React.FC<inputLeftIconProps> = ({
  placeholder = 'Search', 
  onChangeText,
  defaultValue = '',
  name,
  validationRules = undefined,
  inputProps = {},
  style,
}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
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
  const styles = searchInputStyles(colors);
  return (
    <View style={[styles.container, style]} ref={containerRef}>
      <SearchIcon />
      <TextInput
        style={styles.input}
        numberOfLines={1}
        onChangeText={handleOnChange}
        placeholder={trans(placeholder)} 
        selectionColor={colors.primary}
        placeholderTextColor={colors.pureWhite}
        defaultValue={defaultValue?.toString()}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...inputProps}
      />
    </View>
  );
};

export default SearchInput;

const searchInputStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.transparent,
      backgroundColor: colors.primary,
      ...customPadding(0, 11, 0, 11),
      height: rs(42),
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    activeContainer: {
      borderColor: colors.secondary,
    },
    errorContainer: {borderColor: colors.error1},
    input: {
      ...typographies(colors).ralewayMedium12,
      color: colors.pureWhite,
      flexShrink: 1,
      width: '100%',
    },
  });
