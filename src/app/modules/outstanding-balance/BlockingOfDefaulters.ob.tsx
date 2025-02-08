import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import Badge from '../../components/app/Badge.app';
import { useCustomNavigation } from '../../packages/navigation.package';
import userService from '../../services/features/users/user.service';

interface BlockingOfDefaultersProps {
  route: {
    params: { item: any };
  };
}

const BlockingOfDefaulters: React.FC<BlockingOfDefaultersProps> = ({
  route: {
    params: { item = {} },
  },
}) => {
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
  const [select, setSelect] = useState<number>(1);
  const navigation = useCustomNavigation();
  const [values, setValues] = useState({})
  const [key, setKey] = useState<number>(0);
  const list = [
    { title: 'Visits/Delinquent', value: 1, key: 'defaulter' },
    { title: 'Frequent Visits', value: 2, key: 'frequentBlock' },
    { title: 'Bookings', value: 3, key: 'reservationBlock' },
    { title: 'Surveys', value: 4, key: 'surveyBlock' },
    { title: 'Announcements', value: 5, key: 'announcement' },
    { title: 'Social Wall', value: 6, key: 'communicationBlock' },
  ];
  const handleChange = (value: boolean, keys: string, selected: boolean) => {
    if (selected) {
      var obj: any = values
      delete obj[keys]
      setValues(obj)
      setKey(key + 1)
    } else {
      setValues({ ...values, [keys]: value })
    }
  }

  const handleSubmit = async () => {
    try {
      let result = await userService.patchResident(values, item?.resident_id)
      console.log("updated resident for blocking defaulters", result)
      if(result.status){
        Alert.alert("Success","Updated Successfuly")
        navigation.goBack()
        return
      }else{
        Alert.alert("Error","Unable to update")
      }

    } catch (error) {
      Alert.alert("Error","Unable to update")
      console.log("Error in performing updation blocked:", error)
    }
  }
  return (
    <Container>
      <Header text={trans('Blocking Of Defaulters')} leftIcon={false} />
      <View
        style={[
          globalStyles.flex1,
          { justifyContent: `${'space-between'}`, paddingBottom: rs(20) },
        ]}>
        <View style={globalStyles.flexGrow1}>
          <Text
            style={[
              typographies(colors).ralewayBold12,
              {
                ...customPadding(13, 23, 13, 23),
                marginTop: rs(10),
                backgroundColor: colors.light,
                color: colors.dark,
              },
            ]}>
            {trans('Restrict')}
          </Text>
          <View key={key} style={{ ...customPadding(19, 23, 20, 23) }}>
            {list.map((item, index: number) => {
              let selected = Object.keys(values).find(data => data === item.key)

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleChange(true, item?.key, selected === item.key)}
                  style={[globalStyles.flexRow, { gap: rs(14), marginTop: 15 }]}
                  key={index}>
                  <View
                    style={{
                      width: rs(15),
                      height: rs(15),
                      borderRadius: rs(50),
                      backgroundColor:
                        selected === item.key ? colors.primary : colors.gray5,
                    }}
                  />
                  <Text
                    style={[
                      typographies(colors).ralewayMedium14,
                      { color: colors.primary, lineHeight: rs(20) },
                    ]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
        <View
          style={[
            globalStyles.flexRow,
            { marginTop: rs(9), marginHorizontal: rs(20) },
          ]}>
          <Badge
            text={trans('Cancel')}
            style={{
              borderRadius: rs(10),
              flexGrow: 1 / 2,
              width: `${'48%'}`,
            }}
            textColor={colors.dark}
            bgColor={colors.gray3}
            onPress={() => navigation.goBack()}
          />
          <Badge
            text={trans('Accept')}
            style={{
              borderRadius: rs(10),
              flexGrow: 1 / 2,
              width: `${'48%'}`,
            }}
            textColor={colors.dark}
            onPress={() => handleSubmit()}
            bgColor={colors.light}
          />
        </View>
      </View>
    </Container>
  );
};

export default BlockingOfDefaulters;
