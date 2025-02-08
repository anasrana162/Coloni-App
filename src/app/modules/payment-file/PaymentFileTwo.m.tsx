import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Button from '../../components/core/button/Button.core';
import MultiLineInput from '../../components/core/text-input/MultiLineInput.core.component';
import {useTranslation} from 'react-i18next';
import ShowDate from '../../components/app/ShowDate.app';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import ApproveBottomSheet from '../bills/bottomSheet/Approve.bottomSheet';
import PaymentBottomSheet from './PaymentBottomSheet.m';

const PaymentFileTwo = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  return (
    <Container>
      <Header
        text={trans('Payment File')}
        heading={trans('Step 2')}
        body={trans('Import the content from Excel.')}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <Text
          style={[typographies(colors).ralewayMedium12, styles.centeredText]}>
          {trans('Copy the information without including the headers')}
        </Text>
        <View style={styles.separator} />
        <View style={styles.imagePreviewContainer}>
          <ImagePreview
            source={imageLink.excelImage}
            styles={styles.imagePreview}
          />
        </View>
        <View style={styles.container}>
          <MultiLineInput placeholder={trans('Paste the result here')} />
          <Text style={styles.grayText}>
            {trans('Indicate the month to approve')}
          </Text>
        </View>
        <ShowDate />
        <View
          style={{
            ...customMargin(36, 20, 36, 20),
            ...customPadding(38, 20, 38, 20),
          }}></View>
        <View style={styles.buttonContainer}>
          <Button
            text={trans('Former')}
            style={{...styles.button, ...styles.grayButton}}
            onPress={() => {
              navigation.navigate(screens.paymentFile as never);
            }}
          />
          <Button
            text={trans('Following')}
            style={styles.button}
            onPress={() =>
              global.showBottomSheet({
                flag: true,
                component: PaymentBottomSheet,
                componentProps: {
                  title: trans('Payment'),
                  body: trans(
                    'It is necessary to copy and paste the records to import',
                  ),
                  onPress: () => navigation.goBack(),
                },
              })
            }
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    ...customPadding(5),
  },
  scrollViewContent: {
    ...customPadding(0, 20, 20, 20),
    paddingBottom: rs(20),
  },
  centeredText: {
    color: colors.primary,
    textAlign: 'center',
    lineHeight: rs(20),
  },
  separator: {
    height: rs(4),
    width: '100%',
    backgroundColor: colors.gray5,
  },
  imagePreviewContainer: {
    ...globalStyles.justifyAlignCenter,
    width: '100%',
  },
  imagePreview: {
    width: rs(268),
    height: rs(146),
    marginTop: rs(20),
  },
  container: {
    ...customMargin(16, 6, 6, 6),
  },
  grayText: {
    ...typographies(colors).ralewayMedium10,
    color: colors.gray1,
    lineHeight: rs(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rs(40),
  },
  button: {
    width: '49%',
  },
  grayButton: {
    backgroundColor: colors.gray,
  },
});

export default PaymentFileTwo;
