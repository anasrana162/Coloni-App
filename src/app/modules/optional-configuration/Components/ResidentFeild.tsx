import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTheme} from '@react-navigation/native';
import DownArrow from '../../../assets/images/svg/downArrow.svg';
import BottomSheetSelect from '../../../components/core/BottomSheetSelect.app.component';
import userService from '../../../services/features/users/user.service';
import {userRoles} from '../../../assets/ts/core.data';
import {userStates} from '../../../state/allSelector.state';
import {customUseSelector} from '../../../packages/redux.package';

const ResidentField: React.FC<{
  defaultValue?: any[];
  onChange?: (value: any, name: string) => void;
  label?: string;
}> = ({defaultValue = [], onChange, label}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const styles = customSelectStyles(colors);
  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Initialize with an empty array
  const [key, setKey] = useState<number>(0); // Initialize with an empty array
  const {userInfo} = customUseSelector(userStates);

  const handleChange = (item: any) => {
    // const isSelected = selectedValues.some(val => val._id === item?._id);
    // let updatedValues;

    // if (isSelected) {
    //   updatedValues = selectedValues.filter(val => val._id !== item?._id);
    // } else {
    //   updatedValues = [...selectedValues, item];
    // }
    // console.log('1updatedValues', updatedValues);
    setSelectedValues([item]);
    onChange && onChange(item, 'resident');
  };

  // const handleRemove = (id: string, index: number) => {
  //   // const updatedValues = selectedValues.filter(val => val._id !== id);
  //   var updatedValues: any = [];
  //   if (selectedValues.length == 1) {
  //   } else {
  //     updatedValues = selectedValues.splice(index, 1);
  //   }

  //   // console.log(updatedValues);
  //   console.log('2updatedValues', updatedValues);
  //   setSelectedValues(updatedValues);
  //   setKey(key + 1);
  //   onChange && onChange(updatedValues, 'resident');
  // };

  const getDataHandler = async (query: any, success: any) => {
    const params = {asset: true, page: 1, perPage: 100};
    // userInfo?.role === userRoles.VIGILANT ? {asset: true} : undefined;
    const result = await userService.ResidentList(params);
    success(result);
  };

  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        selectedValue: selectedValues
          ?.map(item => `${item?.street?.name || ''} ${item?.home || ''}`)
          .join(', '),
        title: trans('Select Resident'),
        onChange: handleChange,
        titleField: 'FULL__DATA',
        titleFieldFormatter: item =>
          `${item?.street?.name || ''} ${item?.home || ''}`,
        getDataHandler,
      },
    });
  };

  return (
    <View style={[{marginBottom: rs(13)}]}>
      {label && (
        <Text
          style={[
            typographies(colors).ralewayMedium14,
            {color: colors.primary, marginBottom: rs(6), marginLeft: rs(12)},
          ]}>
          {label}
        </Text>
      )}
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.textContainer}
          activeOpacity={0.6}>
          {selectedValues.length > 0 ? (
            <ScrollView
              horizontal
              key={key}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexDirection: 'row'}}>
              {selectedValues?.map((item, index) => (
                <View key={item?._id} style={styles.selectedItem}>
                  <Text style={styles.selectedText}>
                    {item?.street?.name || ''} {item?.home || ''}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                globalStyles.flexShrink1,
                globalStyles.flexGrow1,
                {
                  color:
                    selectedValues.length === 0
                      ? colors.gray3
                      : colors.grayDark,
                },
              ]}
              numberOfLines={1}>
              {trans('Select Resident')}
            </Text>
          )}

          <DownArrow />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResidentField;

const customSelectStyles = (colors: any) =>
  StyleSheet.create({
    textContainer: {
      height: rs(42),
      backgroundColor: colors.gray8,
      flexDirection: 'row',
      gap: 8,
      // ...customPadding(0, 16, 0, 16),
      paddingHorizontal: 15,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray2,
      // paddingHorizontal: rs(10),
      paddingVertical: rs(6),
      // marginRight: rs(8),
      borderRadius: 10,
      zIndex: 200,
    },
    selectedText: {
      color: colors.grayDark,
      marginRight: rs(6),
    },
    removeButton: {
      backgroundColor: colors.gray10,
      borderRadius: 10,
      padding: rs(4),
    },
    removeText: {
      fontWeight: 'bold',
      fontSize: rs(10),
    },
  });
