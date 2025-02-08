import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  customPadding,
  globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import ArrowLeftIcon from '../../../assets/icons/ArrowLeft.icon';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import OnlyTextInput from '../../../components/core/text-input/OnlyTextInput.core';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import Button from '../../../components/core/button/Button.core';
import {showMessage} from 'react-native-flash-message';
import {apiResponse} from '../../../services/features/api.interface';
import {useSelector} from 'react-redux';
import {userStates} from '../../../state/allSelector.state';
import {userRoles} from '../../../assets/ts/core.data';
import streetService from '../../../services/features/street/street.service';

const AddColony: React.FC<{onChange: (value: any) => void}> = ({onChange}) => {
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const value = useRef<string>('');
  const {userInfo} = useSelector(userStates);
  const [loading, setLoading] = useState<boolean>(false);
  const handlePress = async () => {
    if (value.current) {
      setLoading(true);
      const result = await streetService.create({name: value.current});
      const {body, status} = result as apiResponse;
      if (status) {
        onChange(body);
        global.showBottomSheet({flag: false});
        setLoading(false);
      }
    } else {
      showMessage({message: trans("Type can't Empty")});
    }
  };
  return (
    <View style={{...customPadding(10, 20, 20, 20)}}>
      <View style={globalStyles.flexRow}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            global.showBottomSheet({flag: false});
          }}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[
            typographies(colors).montserratSemibold16,
            globalStyles.flexShrink1,
            {color: colors.black},
          ]}>
          {trans('Add Colony')}
        </Text>
      </View>
      <OnlyTextInput
        placeholder={trans('Colony')}
        style={{marginVertical: rs(15)}}
        defaultValue={value.current}
        onChangeText={(text: string) => (value.current = text)}
      />
      {userInfo?.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN) && (
        <Button
          text={trans('Add Colony')}
          onPress={handlePress}
          isLoading={loading}
        />
      )}
    </View>
  );
};

export default AddColony;
