import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import InfoCard from '../../components/app/InfoCard.m';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {customUseSelector} from '../../packages/redux.package';
import {SirenState, userStates} from '../../state/allSelector.state';
import SirenServices from '../../services/features/Siren/Siren.services';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {NetworkInfo} from 'react-native-network-info';
import {formatDate} from '../../utilities/helper';
import Pagination from '../../components/core/Pagination.core.component';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';

const SirenOptional = () => {
  const {userInfo} = customUseSelector(userStates);
  const [List, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const {t: trans} = useTranslation();
  const [ipAddress, setIpAddress] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const {hasMore, refreshing} = customUseSelector(SirenState);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  useEffect(() => {
    NetworkInfo.getIPAddress().then(ip => {
      setIpAddress(ip || '');
    });
  }, []);

  const getDataHandler = async () => {
    setLoading(true);
    try {
      const result = await SirenServices.list(params);
      setList(result?.body?.list || []);
      setTotalPages(result?.body?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const onNext = () => {
    if (params.page < totalPages) {
      const nextPage = params.page + 1;
      setParams({...params, page: nextPage});
    }
  };

  const onBack = () => {
    if (params.page > 1) {
      const prevPage = params.page - 1;
      setParams({...params, page: prevPage});
    }
  };

  useEffect(() => {
    getDataHandler();
  }, [params]);

  const renderList = ({item}: {item: any}) => {
    console.log('Item:: ', item);
    return (
      <TouchableOpacity activeOpacity={0.2}>
        <View style={{...customPadding(2, 6, 2, 6)}}>
          <View
            style={{
              ...customPadding(7, 10, 7, 10),
              backgroundColor: colors.graySoft,
              borderRadius: rs(10),
            }}>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray7},
              ]}>
              {trans('User')}{' '}
              {`: ${item?.user?.home || ''} ${item?.user?.street?.name || ''}`}
            </Text>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray7},
              ]}>
              {trans('Device IP')} : {item?.ipAddress}
            </Text>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray7},
              ]}>
              {trans('Last Connection')} :{' '}
              {formatDate(item?.lastLogin, 'yyyy-MM-DD HH:MM:SS')}
            </Text>
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray7},
              ]}>
              {trans('Connected')} : {item.timeSinceLastLogin}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <Header text={trans('Siren')} />
      <FlatList
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        initialNumToRender={2}
        showsVerticalScrollIndicator={false}
        data={List}
        refreshing={refreshing}
        renderItem={renderList}
        keyboardDismissMode="on-drag"
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={
          <InfoCard
            title={trans('information')}
            body={trans(
              'Sorry Administrator, your private account does not have any siren configured. Ask your dealer for advice on configuration/installation.',
            )}
          />
        }
        ListEmptyComponent={<EmptyContent text={trans('There are no data!')} />}
        ListFooterComponent={
          <>
            {hasMore ? (
              <View style={[{height: rs(40)}, globalStyles.activityCenter]}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              !loading &&
              totalPages > 1 && (
                <Pagination
                  PageNo={params.page}
                  onNext={() => onNext()}
                  onBack={() => onBack()}
                />
              )
            )}
          </>
        }
        contentContainerStyle={{...customPadding(20, 20, 10, 20), gap: rs(5)}}
        onEndReachedThreshold={0.25}
      />
    </Container>
  );
};

export default SirenOptional;
