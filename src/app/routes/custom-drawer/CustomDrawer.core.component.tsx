import React, {FC, useMemo} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  Text,
  FlatList,
} from 'react-native';

import EachDrawerItem from './EachDrawerItem';
import {useCustomNavigation} from '../../packages/navigation.package';
import {STATUS_BAR_HEIGHT, userRoles} from '../../assets/ts/core.data';
import {
  drawerList,
  languageOptions,
  drawerListResident,
  drawerListViglant,
} from '../../assets/ts/dropdown.data';
import {colors} from '../../assets/global-styles/color.assets';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import imageLink from '../../assets/images/imageLink';
import CustomStatusBar from '../../components/core/CustomStatusBar.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {themeStates} from '../../../app/state/allSelector.state';

import BottomSheetSelect from '../../components/core/BottomSheetSelect.app.component';
import {useTranslation} from 'react-i18next';
import {updateLanguage} from '../../state/features/languageSlice';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {languageStates} from '../../state/allSelector.state';
import {config} from '../../../Config';

const CustomDrawer: FC = () => {
  const navigation = useCustomNavigation();

  const {i18n, t: trans} = useTranslation();
  const {language} = customUseSelector(languageStates);
  const {theme} = customUseSelector(themeStates);

  const dispatch = customUseDispatch();
  const handleChange = (item: any) => {
    console.log('Item lang', item);
    dispatch(updateLanguage(item.shortName));
    i18n.changeLanguage(item.shortName);
  };
  const foundOption = languageOptions.find(
    option => option.shortName === language,
  );
  const value = foundOption
    ? foundOption.name
    : languageOptions.find(option => option.shortName === 'en')?.name;
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <EachDrawerItem
      key={index}
      title={trans(item.title)}
      Icon={item.Icon}
      Component={item?.component}
      onPress={() => {
        item?.title == 'Language'
          ? global.showBottomSheet({
              flag: true,
              component: BottomSheetSelect,
              componentProps: {
                data: languageOptions,
                title: trans('Select Language'),
                titleField: 'name',
                onChange: handleChange,
                selectedValue: value,
              },
            })
          : item.function
          ? item.function()
          : navigation.navigate(item.name as never);
      }}
    />
  );

  return (
    <View style={[styles.container]}>
      <ImageBackground
        source={theme === 'dark' ? null : imageLink.drawerBg}
        resizeMode="stretch"
        style={[
          globalStyles.flexGrow1,
          {
            paddingTop: rs(45),
          },
        ]}>
        <CustomStatusBar bgColor={colors.transparent} />
        <Text
          style={[
            typographies(colors).montserratSemibold16,
            {marginTop: -(STATUS_BAR_HEIGHT ?? 0)},
          ]}>
          {trans('Extra')}
        </Text>
        <FlatList
          data={
            config.role === userRoles.VIGILANT
              ? drawerListViglant
              : config.role === userRoles.RESIDENT
              ? drawerListResident
              : drawerList
          }
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: rs(100)}}
          renderItem={renderItem}
          keyExtractor={(_, index: number) => index.toString()}
        />
      </ImageBackground>
    </View>
  );
};
export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.black,
  },
  agencyName: {
    ...typographies(colors).montserratMedium25,
    color: colors.black,
    textTransform: 'uppercase',
  },
  top0: {gap: 0, flex: 1},
  logoPreview: {
    height: 60,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: StatusBar.currentHeight === 0 ? 30 : 0,
  },
  logoPreviewAlt: {
    ...customPadding(16, 0, 6, 0),
  },
  logo: {flexGrow: 1, flex: 1, height: 26, width: 228},
  footerAlt: {...customPadding(0, 16, 5, 16), gap: 5},
  footerAgency: {flexDirection: 'column'},
  topBorder: {borderTopWidth: 1},
  bottomBorder: {borderBottomWidth: 1},
  profileImage: {height: 40, width: 40, overflow: 'hidden', borderRadius: 50},
  profileCont: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'flex-start',
  },
});
