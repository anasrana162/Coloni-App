import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import imagePicker from '../../packages/image-picker/imagePicker';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import {
  customPadding,
  customMargin,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import CameraIcon from '../../assets/icons/Camera.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { getHexaOpacityColorCode } from '../../utilities/helper';
import { useTranslation } from 'react-i18next';
import GalleryFillIcon from '../../assets/icons/GalleryFill.icon.asset';
import ArrowLeftIcon from '../../assets/icons/ArrowLeft.icon';

const ImagePickerBottomSheet: React.FC<{
  success: (params: any) => void;
  failed: (params: any) => void;
  multiple?: boolean;
}> = ({ success, failed, multiple }) => {
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
  const handleOpenCamera = () => {
    global.showBottomSheet({ flag: false });
    imagePicker.openCamera({ success, failed });
  };
  const handleOpenGallery = () => {
    global.showBottomSheet({ flag: false });
    imagePicker.openGallery({ success, failed, multiple: multiple || true });
  };
  const styles = bottomSheetStyles(colors);
  return (
    <View>
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            global.showBottomSheet({ flag: false });
          }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[
            typographies(colors).montserratSemibold16,
            globalStyles.flexShrink1,
            { color: colors.black },
          ]}>
          {trans('Image Picker')}
        </Text>
      </View>
      <View style={[globalStyles.rowBetween, styles.middleHeader]}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.6}
          onPress={handleOpenCamera}>
          <View style={styles.imageContainer}>
            <CameraIcon
              height={rs(40)}
              width={rs(40)}
              fill={getHexaOpacityColorCode(colors.primary, 0.5)}
            />
          </View>
          <Text style={typographies(colors).ralewayMedium14}>
            {trans('Open Camera')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.6}
          onPress={handleOpenGallery}>
          <View style={styles.imageContainer}>
            <GalleryFillIcon
              height={rs(40)}
              width={rs(40)}
              fill={getHexaOpacityColorCode(colors.primary, 0.5)}
            />
          </View>
          <Text style={typographies(colors).ralewayMedium14}>
            {trans('Open Gallery')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePickerBottomSheet;

const bottomSheetStyles = (colors: any) =>
  StyleSheet.create({
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      ...customPadding(10, 20, 10, 20),
    },
    container: {
      alignItems: 'center',
      width: '50%',
    },
    imageContainer: {
      height: rs(88),
      width: rs(88),
      backgroundColor: colors.gray5,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      ...customMargin(0, 0, 8),
    },
    middleHeader: { ...customPadding(20, 0, 20, 0), flex: 0, gap: 0 },
  });

