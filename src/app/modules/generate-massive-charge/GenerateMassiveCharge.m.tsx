import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import MassiveChargesItem from '../../components/app/MassiveChargesItem.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {showAlertWithOneAction} from '../../utilities/helper';
import generateMassiveCharges from '../../services/features/generate-massive-charges/generateMassiveCharges';
import {useIsFocused} from '@react-navigation/native';
import {billsStyles as styles} from '../bills/styles/bills.style';
import SelectMonth from '../../components/app/SelectMonth.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Pagination from '../../components/core/Pagination.core.component';
const GenerateMassiveCharge = () => {
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {t: trans} = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<any>(new Date()); 
  const [params, setParams] = useState<any>({
    page: 1,
    perPage: 8,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  }); 
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  useLayoutEffect(() => {
    if (isFocused) {
      fetchMassiveCharges(params);
    }
  }, [isFocused]);

  const fetchMassiveCharges = async (params: any) => {
    setLoading(true);
    try {
      const result = await generateMassiveCharges.list(params);
      const {
        success,
        message,
        data: {list, page, perPage, results, total, totalPages},
      } = result;
      console.log('result', result);
      if (success) {
        setPaginationInfo({page, perPage, results, total, totalPages});
        setList(list);
        setTotalAmount(total);
        setRefreshing(false);
      } else {
        showAlertWithOneAction({
          title: trans('Error'),
          body: message,
        });
        setRefreshing(false);
      }
    } catch (err) {
      console.error('Error while fetching Massive Charges:', err); // Debugging line
      showAlertWithOneAction({
        title: trans('Error'),
        body: trans('An error occurred while fetching.'),
      });
      setRefreshing(false);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchMassiveCharges(params);
  };

  
  const onNextPage = () => {
    if (params.page >= paginationInfo?.totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params?.page + 1,
    });
    fetchMassiveCharges({
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
    fetchMassiveCharges({
      ...params,
      page: params?.page - 1,
    });
  };

  return (
    <Container>
      <Header
        text={trans('Massive Charges')}
        rightControl={() =>
          navigation.navigate(screens.addUpdateMassiveCharges as never, {
            add: false,
          })
        }
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
      />

      <FlatList
        data={list}
        scrollEnabled={true}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        ListEmptyComponent={
          <>
            {loading ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <EmptyContent text={trans('There is no data!')} />
            )}
          </>
        }
        ListHeaderComponent={() => {
          return (
            <View style={[styles.middleContainer, {marginBottom: 20}]}>
              <SelectMonth
                defaultValue={new Date(selectedDate)}
                onPress={value => {
                  setParams({
                    ...params,
                    month: new Date(value).getMonth() + 1,
                    year: new Date(value).getFullYear(),
                  });
                  setSelectedDate(value);
                  fetchMassiveCharges({
                    ...params,
                    month: new Date(value).getMonth() + 1,
                    year: new Date(value).getFullYear(),
                  });
                }}
              />
              <Text style={[typographies(colors).ralewayBold15, {}]}>
                {`${
                  totalAmount == undefined
                    ? trans('Calculating...')
                    : `Total: ${totalAmount?.toFixed(2)}`
                }`}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          <>
            {console.log('Total Pages:', paginationInfo)}
            {!loading && paginationInfo?.totalPages > 1 && (
              <Pagination
                PageNo={params?.page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
        renderItem={({item, index}) => {
          return (
            <MassiveChargesItem
              data={item}
              onPress={() =>
                navigation.navigate(screens.addUpdateMassiveCharges as never, {
                  add: true,
                  item: item,
                  index: index,
                })
              }
            />
          );
        }}
      />
    </Container>
  );
};

export default GenerateMassiveCharge;
