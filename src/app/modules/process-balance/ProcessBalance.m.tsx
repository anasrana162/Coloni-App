import {View, Text, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import InputFieldWithCalender from './InputFieldWithCalender';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import LabelInput from '../../components/app/LabelInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import CustomSelect from '../../components/app/CustomSelect.app';
import CheckFill from '../../assets/images/svg/CheckFill.svg';
import InfoIcon from '../../assets/images/svg/infoIcon.svg';
import Badge from '../../components/app/Badge.app';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {calculateCash} from '../../utilities/helper';
import CalculateBalanceCard from './CalculateBalanceCard';
import ProcessBalanceService from '../../services/features/Process Balance/ProcessBalanceServices';
import {FlatList} from 'react-native-gesture-handler';
import MonthYearInput from './Components/MonthYearInput';
import Pagination from '../../components/core/Pagination.core.component';

const ProcessBalance = () => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const [isCardVisible, setCardVisible] = useState(false);
  const [data, setData] = useState<any>(null);
  const [Response, setResponse] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [favorType, setfavorType] = useState('Recent');
  console.log('checking data.....', data);
  console.log('checking response.....', Response);
  const [positionType, setPositionType] = useState('Share');
  const [period, setPeriod] = useState<Date | null>(new Date);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
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
  const handleCalculateBalancePress = async () => {
    const payload = {search, period, positionType, favorType};
    console.log('checking params>>>>>', payload);
    try {
      const response = await ProcessBalanceService.list(payload);
      console.log('API Response:', response);
      setResponse(response?.body);
      setData(response?.body?.list);
      setTotalPages(response?.body?.totalPages || 1);
      setCardVisible(true);
    } catch (error) {
      console.error('Error fetching process balance data:', error);
    }
  };
  const renderItem = ({item}: {item: any}) => {
    console.log('checking item in flatlist', item);
    return <CalculateBalanceCard data={item} />;
  };

  const memoizedValue = useMemo(() => renderItem, []);
  return (
    <Container>
      <Header text={trans('Process Balance')} />
      <ScrollView
        // style={{ ...customPadding(0,10,0,10) }}
        contentContainerStyle={{...customPadding(0, 20, 20, 20)}}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <MonthYearInput
          label={trans('Period')}
          style={{marginTop: rs(7)}}
          defaultValue={period || new Date()}
          onChange={value => {
            if (value instanceof Date) {
              setPeriod(value);
            } else {
              console.error('Invalid date value:', value);
            }
          }}
        />


        <CustomSelect
          placeholder={trans('Share')}
          label={trans('Apply to Type Positions')}
          data={[
            trans('Share'),
            trans('Positive Balance'),
            trans('Surcharge'),
            trans('Penalty Fee'),
            trans('Card/Tag'),
            trans('Amenity'),
            trans('Extraordinary Fee'),
          ]}
          defaultValue={positionType}
          onChange={value => setPositionType(value)}
        />
        <CustomSelect
          placeholder={trans('Oldest')}
          label={trans('Apply balance in favor')}
          data={[
            trans('Recent'),
            trans('Oldest'),
            // trans('Greater amount'),
            // trans('Minor amount'),
          ]}
          defaultValue={favorType}
          onChange={value => setfavorType(value)}
        />
        <View style={globalStyles.flexRow}>
          <View style={[globalStyles.flexRow, globalStyles.flexGrow1]}>
            <CheckFill height={rs(16)} width={rs(16)} />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}>
              {trans('Balance in favor applied')}
            </Text>
          </View>
          <Badge
            onPress={handleCalculateBalancePress}
            classes="small"
            text={trans('Calculate Balance')}
          />
        </View>
        <View style={[globalStyles.flexRow, {marginTop: rs(6)}]}>
          <View style={[globalStyles.flexRow, globalStyles.flexGrow1]}>
            <CheckFill fill={colors.success1} height={rs(16)} width={rs(16)} />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.primary},
              ]}>
              {trans('Processable Document')}
            </Text>
          </View>
          {Response  && (
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {color: colors.gray3},
              ]}>
              $ {`${!Response?.totalBalance ? 0:Response?.totalBalance}`}
            </Text>
           )} 
        </View>

        {!isCardVisible && (
          <View style={[globalStyles.justifyAlignCenter, {marginTop: rs(40)}]}>
            <InfoIcon />
            <Text
              style={[
                typographies(colors).ralewayMedium12,
                {
                  color: colors.gray3,
                  lineHeight: rs(20),
                  textAlign: 'center',
                  marginTop: rs(15),
                },
              ]}>
              {trans(
                'Apply the credit balance that you have previously configured. Learn more here: See help',
              )}
            </Text>
          </View>
        )}
      </ScrollView>
      {isCardVisible && data ? (
        <FlatList
          horizontal
          keyboardShouldPersistTaps="always"
          stickyHeaderIndices={[0]}
          initialNumToRender={2}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={memoizedValue}
          keyExtractor={(_item, index) => index.toString()}
          keyboardDismissMode="on-drag"
          ListHeaderComponent={<View style={{backgroundColor: colors.white}} />}
          ListFooterComponent={
            !loading && totalPages > 1 ? (
              <Pagination
                PageNo={params.page}
                onNext={() => onNext()}
                onBack={() => onBack()}
              />
            ) : null
          }
          contentContainerStyle={{
            ...customPadding(0, 20, 10, 20),
            gap: rs(8),
          }}
          onEndReachedThreshold={0.25}
        />
      ) : null}
    </Container>
  );
};

export default ProcessBalance;
