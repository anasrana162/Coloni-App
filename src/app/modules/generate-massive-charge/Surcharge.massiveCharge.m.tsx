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
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useCustomNavigation } from '../../packages/navigation.package';
import { useIsFocused, useTheme } from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import { useTranslation } from 'react-i18next';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import { userStates } from '../../state/allSelector.state';
import { userRoles } from '../../assets/ts/core.data';
import imageLink from '../../assets/images/imageLink';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import { screens } from '../../routes/routeName.route';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { config } from '../../../Config';
import generateMassiveCharges from '../../services/features/generate-massive-charges/generateMassiveCharges';
import { colors } from '../../assets/global-styles/color.assets';
import moment from 'moment';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Pagination from '../../components/core/Pagination.core.component';
const { width, height } = Dimensions.get('screen');

const SurchargeMassiveCharge: React.FC<{
  route: { params?: { id?: string; resident: string } };
}> = ({ route: { params: { id = '', resident = '' } = {} } }) => {
  const navigation = useCustomNavigation<any>();
  const { colors } = useTheme() as any;
  const { t: trans } = useTranslation();
  const dispatch = customUseDispatch();
  const isFocused = useIsFocused();
  const { userInfo } = customUseSelector(userStates);
  const [list, setList] = useState(null);
  
  const [paginationinfo, setPaginationInfo] = useState<any>({});
  const [params, setParams] = useState<any>({
    page: 1,
    perPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //   console.log('Token', id);
  
  const fetchSurcharges = async (params: any) => {
    setLoading(true)
    try {
      let charges = await generateMassiveCharges.surchargeList(params, id, true);
      console.log('SURCharges Fetched: ', charges);
      var { success, data, message, page, perPage, totalPages } = charges;
      if (success) {
        setList(data);
        setPaginationInfo({
          page,
          perPage,
          totalPages,
        })
      } else {
        Alert.alert(trans('Error'), message);
      }
    } catch (error) {
      Alert.alert(trans('Error'), message);
      console.log('Error fetching Surcharges', error);
    }
    finally {
      setLoading(false)
      setRefreshing(false)
    }
  };

  useLayoutEffect(() => {
    if (isFocused) {
      fetchSurcharges(params);
    }
  }, [isFocused]);

  
  const onRefresh = () => {
    setRefreshing(true)
    fetchSurcharges(params)
  };

  
  const onNextPage = () => {
    if (params.page >= paginationinfo?.totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params?.page + 1,
    });
    fetchSurcharges({
      ...params,
      page: params?.page + 1,
    });
  };
  
  const onPrevPage = () => {
    if (params?.page <= 1) {
      return;
    }
    setParams({
      ...params,
      page: params?.page - 1,
    });
    fetchSurcharges({
      ...params,
      page: params?.page - 1,
    });
  };

  return (
    <Container>
      <Header
        text={trans('Surcharges')}
        rightIcon={
          userInfo?.role === userRoles.ADMIN ||
            userInfo?.role === userRoles.SUPER_ADMIN ? (
            <ImagePreview source={imageLink.addIcon} />
          ) : undefined
        }
        rightControl={() =>
          navigation.navigate(screens.addSurchargeMassiveCharges as never, {
            id,
            resident,
          })
        }
      />

      <FlatList
        data={list}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <>
            {loading ? <ActivityIndicator size={"large"} color={colors.primary} />
              :
              <EmptyContent text={trans('There is no data!')} />}
          </>
        }
        ListFooterComponent={
          
          <>
            {!loading && paginationinfo?.totalPages > 1 && (
              <Pagination
                PageNo={params?.page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(screens.affectedMassiveCharges as never, {
                  id: item?._id,
                });
              }}
              style={styles.listCont}>
              <View>
                <Text style={styles.itemtext}>
                  {item.valor}{' '}
                  {item?.increamentType == 'percentage' ? '%' : 'amount'}{' '}
                </Text>
                <Text style={styles.itemtext}>key: {item?.resident?.name}</Text>
                <Text style={styles.itemtext}>{item?.note}</Text>
                {!item?.includeApproved && (
                  <Text style={[styles.itemtext, { color: colors.error1 }]}>
                    {trans('Does not include approved')}
                  </Text>
                )}
              </View>
              <Text style={styles.itemtext}>
                {moment(item.createdAt).format('MM/DD/YYYY')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

    </Container>
  );
};

export default SurchargeMassiveCharge;

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
  },
});
