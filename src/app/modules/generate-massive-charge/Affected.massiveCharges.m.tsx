import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useTranslation} from 'react-i18next';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import {userStates} from '../../state/allSelector.state';
import {userRoles} from '../../assets/ts/core.data';
import imageLink from '../../assets/images/imageLink';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import {screens} from '../../routes/routeName.route';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {config} from '../../../Config';
import generateMassiveCharges from '../../services/features/generate-massive-charges/generateMassiveCharges';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import SearchIcon from '../../assets/icons/Search.icon';
import {TextInput} from 'react-native-gesture-handler';
import {debounceHandler} from '../../utilities/helper';
import EmptyContent from '../../components/core/EmptyContent.core.component';
const {width, height} = Dimensions.get('screen');

const AffectedMassiveCharge: React.FC<{
  route: {params?: {id?: string}};
}> = ({route: {params: {id = ''} = {}}}) => {
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {userInfo} = customUseSelector(userStates);
  const [list, setList] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //   console.log('Token', id);

  const fetchSurcharges = async () => {
    setLoading(true);
    try {
      let payload = {};
      let charges = await generateMassiveCharges.affectedChargeList(
        payload,
        id,
      );
      console.log('Affected Charges Fetched: ', charges);
      var {status, body, message} = charges;
      if (status) {
        setList(body);
        setLoading(false);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      Alert.alert(trans('Error'), message);
      console.log(trans('Error fetching Surcharges'), error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useLayoutEffect(() => {
    fetchSurcharges();
  }, []);
  // const handleSearch = debounceHandler((txt: string) => {
  //   setParams(prevParams => ({...prevParams, search: txt}));
  //   fetchDocuments({...params, search: txt});
  // });
  const filterData = debounceHandler((data: any) => {
    setSearch(data);
    const query = data.toLowerCase();
    const result = list?.charges?.filter((item: any) => {
      return (
        item.status.toLowerCase().includes(query) ||
        item.amount.toString().includes(query) ||
        item.totalPartialAmount.toString().includes(query)
      );
    });
    setFilteredData(result);
  }, 500);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurcharges();
  };

  return (
    <Container>
      <Header text={trans('Affected Positions')} />

      <FlatList
        data={filteredData?.length == 0 ? list?.charges : filteredData}
        keyboardShouldPersistTaps="always"
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{marginTop: 20}}>
            {loading ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <EmptyContent text={trans('There is no data!')} />
            )}
          </View>
        }
        ListHeaderComponent={() => {
          return (
            <View style={styles.searchInputcont}>
              <SearchIcon />
              <TextInput
                placeholder="Search"
                placeholderTextColor={colors.white}
                defaultValue={search} // Use value instead of defaultValue
                style={{
                  width: '80%',
                  ...typographies(colors).montserratMedium13,
                  color: colors.white,
                  marginLeft: 10,
                }}
                onChangeText={txt => filterData(txt)} // Keep updating the search state
              />
            </View>
          );
        }}
        renderItem={({item, index}) => {
          return (
            <View style={styles.listCont}>
              <View>
                <Text style={[styles.itemtext, {color: colors.error1}]}>
                  {list?.resident?.name}
                </Text>
                <Text style={styles.itemtext}>Status: {item?.status}</Text>
                <Text style={styles.itemtext}>
                  {trans('Previous Amount:')} {item?.totalPartialAmount}
                </Text>
              </View>
              <View style={{gap: 10}}>
                <Text style={styles.itemtext}>
                {trans('Current Amount:')} ${item?.amount}
                </Text>
                <Text style={styles.itemtext}>
                  {trans('Current Status:')}{' '}
                  <Text style={[styles.itemtext, {color: colors.error1}]}>
                    ${item?.amount}
                  </Text>
                </Text>
              </View>
            </View>
          );
        }}
      />
    </Container>
  );
};

export default AffectedMassiveCharge;

const styles = StyleSheet.create({
  listCont: {
    width: width - 40,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.graySoft,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 15,
  },
  itemtext: {
    ...typographies(colors).montserratMedium13,
    fontSize: 12,
  },
  searchInputcont: {
    width: width - 40,
    height: 45,
    borderRadius: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
});
