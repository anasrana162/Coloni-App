/* eslint-disable react-native/no-inline-styles */
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
import SearchInput from '../../components/app/SearchInput.app';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CheckFill from '../../assets/images/svg/CheckFill.svg';
import Badge from '../../components/app/Badge.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {calculateCash} from '../../utilities/helper';
import {momentTimezone} from '../../packages/momentTimezone.package';
const AddUpdateProcessBalance = () => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  return (
    <Container>
      <Header
        text={trans('Process Balance')}
        rightIcon={<ImagePreview source={imageLink.saveIcon} />}
      />
      <ScrollView
        style={{...customPadding(10)}}
        contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <SearchInput style={{marginBottom: rs(7)}} />
        <LabelInput placeholder="02/2024" label={trans('Period')} />
        <LabelInput
          placeholder={trans('Share')}
          label={trans('Apply to Type Positions:')}
        />
        <LabelInput
          placeholder={trans('Oldest')}
          label={trans('Apply Balance In Favor')}
        />
        <View style={globalStyles.flexRow}>
          <View style={[globalStyles.flexRow, globalStyles.flexGrow1]}>
            <CheckFill height={rs(16)} width={rs(16)} />
            <Text
              style={[
                typographies(colors).ralewayMedium14,
                {color: colors.primary},
              ]}>
              {trans('Balance in favor applied')}
            </Text>
          </View>
          <Badge classes="small" text={trans('Calculate Balance')} />
        </View>
        <View style={[globalStyles.flexRow, {marginTop: rs(10)}]}>
          <View style={[globalStyles.flexRow, globalStyles.flexGrow1]}>
            <CheckFill fill={colors.success1} height={rs(16)} width={rs(16)} />
            <Text
              style={[
                typographies(colors).ralewayMedium14,
                {color: colors.primary},
              ]}>
              {trans('Processable Document')}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: rs(10),
            paddingVertical: rs(5),
            marginTop: rs(12),
          }}>
          <View style={{paddingHorizontal: rs(12)}}>
            <Text
              style={[
                typographies(colors).ralewaySemibold14,
                {color: colors.pureWhite, lineHeight: rs(20)},
              ]}>
              Oro 105 Andress gerardo gauna escelera
            </Text>
            <Text
              style={[
                typographies(colors).ralewaySemibold14,
                {color: colors.pureWhite, lineHeight: rs(20), marginTop: rs(3)},
              ]}>
              {momentTimezone().format('DD/MM/YYYY')} {trans('Fee')}
            </Text>
            <View
              style={[
                globalStyles.flexRow,
                {
                  justifyContent: 'space-between',
                  borderBottomWidth: rs(1),
                  borderBottomColor: colors.pureWhite,
                },
              ]}>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {momentTimezone().format('DD/MM/YYYY')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {calculateCash(800)}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}
              />
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {calculateCash(800)}
              </Text>
            </View>
            <View
              style={[globalStyles.flexRow, {justifyContent: 'space-between'}]}>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('Date')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('Amount')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('To discount')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('To turn off')}
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: colors.gray5}}>
            <Text
              style={[
                typographies(colors).ralewaySemibold8,
                {
                  lineHeight: rs(20),
                  color: colors.primary,
                  textAlign: 'center',
                },
              ]}>
              {trans('No outstanding debt in {{x}}', {
                x: momentTimezone().format('YYYY-MM'),
              })}
            </Text>
          </View>
          <Text
            style={[
              typographies(colors).ralewaySemibold8,
              {
                lineHeight: rs(9),
                color: colors.pureWhite,
                textAlign: 'center',
                marginTop: rs(5),
              },
            ]}>
            {trans(
              'No "Installation" debit was found dated 2024-02, validate that you have not manually approved the charge or another credit balance has been used in this month.',
            )}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: rs(10),
            paddingVertical: rs(5),
            marginTop: rs(12),
          }}>
          <View style={{paddingHorizontal: rs(12)}}>
            <Text
              style={[
                typographies(colors).ralewaySemibold14,
                {color: colors.pureWhite, lineHeight: rs(20)},
              ]}>
              Oro 105 Andress gerardo gauna escelera
            </Text>
            <Text
              style={[
                typographies(colors).ralewaySemibold14,
                {color: colors.pureWhite, lineHeight: rs(20), marginTop: rs(3)},
              ]}>
              {momentTimezone().format('DD/MM/YYYY')} {trans('Fee')}
            </Text>
            <View
              style={[
                globalStyles.flexRow,
                {
                  justifyContent: 'space-between',
                  borderBottomWidth: rs(1),
                  borderBottomColor: colors.pureWhite,
                },
              ]}>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {momentTimezone().format('DD/MM/YYYY')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {calculateCash(800)}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}
              />
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {calculateCash(800)}
              </Text>
            </View>
            <View
              style={[globalStyles.flexRow, {justifyContent: 'space-between'}]}>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('Date')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('Amount')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('To discount')}
              </Text>
              <Text
                style={[
                  typographies(colors).ralewaySemibold8,
                  {lineHeight: rs(20), color: colors.pureWhite},
                ]}>
                {trans('To turn off')}
              </Text>
            </View>
          </View>
          <View style={{backgroundColor: colors.gray5}}>
            <Text
              style={[
                typographies(colors).ralewaySemibold8,
                {
                  lineHeight: rs(20),
                  color: colors.primary,
                  textAlign: 'center',
                },
              ]}>
              {trans('No outstanding debt in {{x}}', {
                x: momentTimezone().format('YYYY-MM'),
              })}
            </Text>
          </View>
          <Text
            style={[
              typographies(colors).ralewaySemibold8,
              {
                lineHeight: rs(9),
                color: colors.pureWhite,
                textAlign: 'center',
                marginTop: rs(5),
              },
            ]}>
            {trans(
              'No "Installation" debit was found dated 2024-02, validate that you have not manually approved the charge or another credit balance has been used in this month.',
            )}
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default AddUpdateProcessBalance;
