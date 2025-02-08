import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Button from '../../components/core/button/Button.core';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTranslation} from 'react-i18next';
const AddUpdateByExcelOptional = () => {
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  return (
    <Container>
      <Header
        text={trans('Update by Excel')}
        rightIcon={<ImagePreview source={imageLink.saveIcon} />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          ...customPadding(10, 20, 20, 20),
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            {
              ...customPadding(7, 10, 7, 10),
              backgroundColor: colors.error5,
              borderRadius: rs(10),
            },
          ]}>
          {trans(
            'Mass updates cannot be reverted once performed, validate that the information is correct before performing this process',
          )}
        </Text>
        <Button
          text={trans('Accept')}
          onPress={() => navigation.navigate(screens.AddUpdateByExcel as never)}
        />
      </ScrollView>
    </Container>
  );
};

export default AddUpdateByExcelOptional;
