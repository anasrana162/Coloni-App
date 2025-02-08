import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
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
import AddPayment from './AddVisitType.bottomSheet';
import frequentVisitService from '../../../services/features/frequentVisit/frequentVisit.service';
import {useSelector} from 'react-redux';
import {userStates} from '../../../state/allSelector.state';
import {userRoles} from '../../../assets/ts/core.data';
const VisitType: React.FC<{
  defaultValue?: string;
  onChange?: (value: any, name: string) => void;
  ScreenName?: string;
  name: string;
}> = ({defaultValue, onChange, ScreenName, name}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const styles = customSelectStyles(colors);
  const [value, setValue] = useState<any>(defaultValue || '');
  const {userInfo} = useSelector(userStates);
  const handleChange = (item: any) => {
    onChange && onChange(item, name);
    setValue(item);
  };

  const handleOpenAddExpense = () => {
    global.showBottomSheet({
      flag: true,
      component: AddPayment,
      componentProps: {onChange: handleChange},
    });
  };

  const getDataHandler = async (query: any, success: any) => {
    try {
      const result = await frequentVisitService.typeList();
      console.log('Result:', result?.body[0]);
      
      const filteredResult = result?.body.filter((item: any) =>
        item?.screen?.includes(ScreenName),
      );
      success(result);
      //success({...result, body: {list: filteredResult}});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onPress = () => {
    global.showBottomSheet({
      flag: true,
      component: BottomSheetSelect,
      componentProps: {
        selectedValue: value?.name,
        title: trans('Visit Type'),
        onChange: handleChange,
        titleField: 'name',
        rightComponent: userInfo?.role === userRoles.SUPER_ADMIN && (
          <TouchableOpacity activeOpacity={0.7} onPress={handleOpenAddExpense}>
            <Text style={typographies(colors).ralewayMedium14}>
              {trans('Add Type')}
            </Text>
          </TouchableOpacity>
        ),
        getDataHandler,
      },
    });
  };

  return (
    <View style={{marginBottom: rs(13)}}>
      <TouchableOpacity
        style={styles.textContainer}
        onPress={onPress}
        activeOpacity={0.6}>
        <Text
          style={[
            typographies(colors).ralewayMedium12,
            globalStyles.flexShrink1,
            globalStyles.flexGrow1,
            {color: !value?.name ? colors.gray3 : colors.grayDark},
          ]}
          numberOfLines={1}>
          {value?.name || trans('Visit Type')}
        </Text>
        <DownArrow />
      </TouchableOpacity>
    </View>
  );
};

export default VisitType;

const customSelectStyles = (colors: any) =>
  StyleSheet.create({
    textContainer: {
      height: rs(42),
      backgroundColor: colors.gray8,
      flexDirection: 'row',
      gap: 8,
      ...customPadding(0, 16, 0, 16),
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
  });
