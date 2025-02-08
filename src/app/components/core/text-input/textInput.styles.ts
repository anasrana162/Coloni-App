import { StyleSheet } from 'react-native';
import { customPadding } from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';

export const textInputStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.transparent,
      backgroundColor: colors.graySoft,
      ...customPadding(0, 16, 0, 16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: rs(70), // Changed from height to minHeight
    },
    onlyTextContainer: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.transparent,
      backgroundColor: colors.graySoft,
      ...customPadding(0, 16, 0, 16),
      minHeight: rs(42), // Changed from height to minHeight
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
    multi: {
      textAlignVertical: 'top',
      maxHeight: rs(150),
    },
  });
