import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import Button from '../../components/core/button/Button.core';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import { useTranslation } from 'react-i18next';


const PaymentFile = () => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation();
  return (
    <Container>
      <Header
        text={trans('Payment File')}
        heading={trans('Step 1')}
        body={trans("Prepare mass approval file")}
      />
      <ScrollView
        style={{...customPadding(5)}}
        contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            {
              color: colors.primary,
              textAlign: `${'center'}`,
              lineHeight: rs(20),
            },
          ]}>
         {trans(" Prepare an excel containing the columns:")}
        </Text>
        <View
          style={{
            height: rs(4),
            width: `${'100%'}`,
            backgroundColor: colors.gray5,
          }}
        />
        <View style={[globalStyles.justifyAlignCenter, {width: `${'100%'}`}]}>
          <ImagePreview
            source={imageLink.excelImage}
            styles={{width: rs(268), height: rs(146), marginTop: rs(20)}}
          />
        </View>
        <View style={[globalStyles.flexWithGap, {marginTop: rs(20)}]}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
           {trans("Reference")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
           {trans('Reference of the resident who made the payment. If you do not use a reference, indicate the address with street and number.')}
          </Text>
        </View>
        <View style={globalStyles.flexWithGap}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
            {trans("Amount:")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
            {trans('Payment Amount.')}
          </Text>
        </View>
        <View style={globalStyles.flexWithGap}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
            {trans('F.Payment*:')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
           {trans("(Optional) Payment date in dd/MM/yyyy format, if empty, it will be taken as the current date.")}
          </Text>
        </View>
        <View style={globalStyles.flexWithGap}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
            {trans("C. Payment*:")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
          {trans("(Optional) Payment concept, if empty, it will be taken as an Installment")}
          </Text>
        </View>
        <View style={globalStyles.flexWithGap}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
            {trans("Bank Account*:")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
          {trans("(Optional) Payment concept, if empty, it will be taken as an Installment")}
          </Text>
        </View>
        <View style={globalStyles.flexWithGap}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(20)},
            ]}>
            {trans("Note*: (Optional)")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              globalStyles.flexShrink1,
              {color: colors.black, lineHeight: rs(20)},
            ]}>
            {trans("Note or comment on the entry.")}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.graySoft,
            ...customPadding(3, 6, 3, 6),
            borderRadius: rs(10),
            marginTop: rs(20),
          }}>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.primary, lineHeight: rs(15)},
            ]}>
            {trans("IMPORTANT:")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.black, lineHeight: rs(15)},
            ]}>
            {trans("1. The reference identifies each resident, each resident must have been previously captured.")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.black, lineHeight: rs(15)},
            ]}>
            {trans("2.cIt is not possible to repeat the reference.")}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.black, lineHeight: rs(15)},
            ]}>
           {trans("3. Maximum 400 rows.")}
          </Text>
        </View>
        <Button text={trans("Following") }style={{marginTop: rs(25)}}
          onPress={()=>{
            navigation.navigate(screens.paymentFileTwo as never);
        }} />
      </ScrollView>
    </Container>
  );
};

export default PaymentFile;
