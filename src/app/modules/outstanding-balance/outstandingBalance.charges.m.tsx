import {
  View,
  Text,
  Dimensions,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import Badge from '../../components/app/Badge.app';
import BillItem from '../../components/app/BillItem.app';
import {screens} from '../../routes/routeName.route';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useCustomNavigation} from '../../packages/navigation.package';
import {billsStyles as styles} from '../bills/styles/bills.style';
import CalenderIcon from '../../assets/icons/Calender.icon';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
import {debounceHandler, showAlertWithOneAction} from '../../utilities/helper';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {config} from '../../../Config';
import monthChargesService from '../../services/features/monthCharges/monthCharges.service';
import ChargesItem from '../residents/ChargesItem.residents';
import outstandingBalancesService from '../../services/features/outstandingBalances/outstandingBalances.service';
import OutstandingChargesItem from './components/outstandingChargesItem.m';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Pagination from '../../components/core/Pagination.core.component';
import SelectMonth from '../../components/app/SelectMonth.app';
import moment from 'moment';
const {width, height} = Dimensions.get('screen');

const OutstandingBalanceCharges: React.FC<{
  route: {
    params?: {
      ResidentName?: string;
      resident_id?: any;
    };
  };
}> = ({
  route: {
    params: {ResidentName, resident_id} = {
      ResidentName: '',
      resident_id: null,
    },
  },
}) => {
  const navigation = useCustomNavigation();
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [paginationinfo, setPaginationInfo] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [payload, setPayload] = useState<any>({
    id: resident_id,
    status: 'Earning',
    page: 1,
    perPage: 12,
    search: '',
    period: moment(new Date()).format('YYYY-MM-DD'),
  });
  // Create a new Date object
  const date = new Date();
  // Options for formatting
  const options: any = {month: 'long', year: 'numeric'};
  // Format the date
  const formattedDate = date.toLocaleString('en-US', options);

  useEffect(() => {
    if (isFocused) {
      fetchOutstandingCharges(payload);
    }
  }, [isFocused]);

  const fetchOutstandingCharges = async (payload: any) => {
    setLoading(true);
    try {
      let charges = await outstandingBalancesService.listCharges(payload);
      //   console.log('fetchOutstandingCharges Result:', charges);
      var {data, success, pagination, total} = charges;
      if (success) {
        setList(data);
        setPaginationInfo(pagination);
        setTotalAmount(total);
        setLoading(false);
      } else {
        Alert.alert(trans('Error'), trans('Error Fetching Charges'));
        setLoading(false);
      }
    } catch (error) {
      console.log('Error fetching month charges:', error);
      setLoading(false);
    }
  };

  const handleSearch = debounceHandler((value: string) => {
    setPayload({
      ...payload,
      search: value,
    });

    fetchOutstandingCharges({
      ...payload,
      search: value,
    });
  }, 500);
  
  const onNextPage = () => {
    if (payload.page >= paginationinfo?.totalPages) {
      return;
    }
    setPayload({
      ...payload,
      page: payload?.page + 1,
    });
    fetchOutstandingCharges({
      ...payload,
      page: payload?.page + 1,
    });
  };
  
  const onPrevPage = () => {
    if (payload?.page <= 1) {
      return;
    }
    setPayload({
      ...payload,
      page: payload?.page - 1,
    });
    fetchOutstandingCharges({
      ...payload,
      page: payload?.page - 1,
    });
  };

  console.log(' Item first', resident_id);
  return (
    <Container>
      <Header
        text={ResidentName}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addOutstandingCharges as never, {
            id: resident_id,
            ResidentName,
          })
        }
      />
      <View
        style={{
          marginBottom: 30,
          position: 'relative',
          top: 30,
          alignSelf: 'center',
          width: '90%',
        }}>
        <SearchInput
          defaultValue={payload?.search}
          onChangeText={handleSearch}
        />
        <View style={[styles.badgeContainer, {gap: rs(6), marginTop: 35}]}>
          <Badge
            text={trans('Earning')}
            bgColor={payload?.status === 'Earning' ? '' : colors.gray5}
            onPress={() => {
              setList([]);
              setPayload({
                ...payload,
                status: 'Earning',
                page: 1,
                perPage: 12,
                period: moment(selectedDate).format('YYYY-MM-DD'),
              });
              fetchOutstandingCharges({
                ...payload,
                status: 'Earning',
                page: 1,
                perPage: 12,
                period: moment(selectedDate).format('YYYY-MM-DD'),
              });
            }}
            textColor={payload?.status === 'Earning' ? '' : colors.gray7}
            classes="small"
            style={{
              flexGrow: 1 / 3,
              width: `${'32%'}`,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Badge
            text={trans('To Be Approved')}
            bgColor={payload?.status === 'To Be Approved' ? '' : colors.gray5}
            textColor={payload?.status === 'To Be Approved' ? '' : colors.gray7}
            onPress={() => {
              setList([]);
              setPayload({
                ...payload,
                status: 'To Be Approved',
                page: 1,
                perPage: 12,
                period: moment(selectedDate).format('YYYY-MM-DD'),
              });
              fetchOutstandingCharges({
                ...payload,
                status: 'To Be Approved',
                page: 1,
                perPage: 12,
                period: moment(selectedDate).format('YYYY-MM-DD'),
              });
            }}
            classes="small"
            style={{
              flexGrow: 1 / 3,
              width: `${'32%'}`,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Badge
            text={trans('Approved')}
            onPress={() => {
              setPayload({
                ...payload,
                status: 'Approved',
                page: 1,
                perPage: 12,
              });
              fetchOutstandingCharges({
                ...payload,
                status: 'Approved',
                page: 1,
                perPage: 12,
                period: moment(selectedDate).format('YYYY-MM-DD'),
              });
            }}
            bgColor={payload?.status === 'Approved' ? '' : colors.gray5}
            textColor={payload?.status === 'Approved' ? '' : colors.gray7}
            style={{
              flexGrow: 1 / 3,
              width: `${'32%'}`,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            classes="small"
          />
        </View>
        <View style={styles.middleContainer}>
          <SelectMonth
            defaultValue={new Date(selectedDate)}
            onPress={(value: string) => {
              console.log('value date selected', value);
              setSelectedDate(value);
              setPayload({
                ...payload,
                period: moment(value).format('YYYY-MM-DD'),
              });
              fetchOutstandingCharges({
                ...payload,
                period: moment(value).format('YYYY-MM-DD'),
              });
            }}
          />
          <Text style={[typographies(colors).ralewayBold15, {}]}>{`${
            totalAmount == undefined
              ? trans('Calculating...')
              : `Total: ${totalAmount}`
          }`}</Text>
        </View>
      </View>
      <FlatList
        scrollEnabled={true}
        data={list}
        keyExtractor={(_item, index) => index.toString()}
        bounces={true}
        contentContainerStyle={{...customPadding(17, 20, 0, 20)}}
        // ListHeaderComponent={() => {
        //   return (

        //   );
        // }}
        ListEmptyComponent={
          <>
            {loading ? (
              <ActivityIndicator size={'large'} color={colors.primary} />
            ) : (
              <EmptyContent text={trans('There is no data!')} />
            )}
          </>
        }
        keyboardDismissMode="on-drag"
        renderItem={({item, index}) => {
          return <OutstandingChargesItem item={item} index={index} />;
        }}
        ListFooterComponent={
          
          <>
            {!loading && paginationinfo?.totalPages > 1 && (
              <Pagination
                PageNo={payload?.page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
      />
    </Container>
  );
};

export default OutstandingBalanceCharges;
