import React from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { customPadding, globalStyles } from '../../assets/global-styles/global.style.asset';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import Badge from '../../components/app/Badge.app';

const MyBills = () => {
  const { t: trans } = useTranslation();
  return (
    <Container>
      <Header text={trans("My Bills")} />
      <ScrollView
        contentContainerStyle={{ ...customPadding(0, 20, 20, 20) }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <SearchInput />
        <View>
          <Text style={styles.topText}>
            {trans("If you would like to change your billing information, you can do so")}
            <TouchableOpacity onPress={() => { }}>
              <Text style={styles.linkText}> {trans("here")}</Text>
            </TouchableOpacity>.
          </Text>
        </View>
        <View style={globalStyles.flexRow}>
              <Badge
                text={trans('Earring')}
                // onPress={() => handleStatus('asset')}
                style={{width: `${'49%'}`}}
                
                // bgColor={status === 'asset' || hasAssetItems() ? colors.tertiary : colors.gray5}
                // textColor={status === 'asset' || hasAssetItems() ? colors.white : colors.gray7}
              />
              <Badge
                text={trans('Approved')}
                // onPress={() => handleStatus('inactive')}
                style={{width: `${'49%'}`}}
                // bgColor={status === 'inactive' || hasInactiveItems() ? colors.tertiary : colors.gray5}
                // textColor={status === 'inactive' || hasInactiveItems() ? colors.white : colors.gray7}
              />
            </View>


            <EmptyContent text="There is no data to display" /> 


      </ScrollView>


    
    </Container>
  );
};
const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    ...typographies(colors).ralewayMedium12,
    color: colors.active,
  },
  topText: {
    ...customPadding(10, 10, 10, 10),
    ...typographies(colors).ralewayMedium12
  }
});
export default MyBills;
