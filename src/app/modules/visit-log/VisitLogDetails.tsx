import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import SearchInput from '../../components/app/SearchInput.app';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTranslation} from 'react-i18next';
import {
  gettingMoreAction,
  refreshingAction,
  isGettingAction,
  searchingAction,
} from '../../state/features/visits/visits.slice';
import {useTheme} from '@react-navigation/native';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {userStates, visitsStates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import ShowDate from '../../components/app/ShowDate.app';
import Badge from '../../components/app/Badge.app';
import useFrequentVisit from '../frequent-visits/hooks/useFrequentVisit.hook';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {formatDate} from '../../utilities/helper';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import moment from 'moment';
const VisitLogDetails: React.FC<{
  route: {params?: {item: any; index: number; id: string}};
}> = ({route: {params: {item = [], index = -1, id = ''} = {}}}) => {
  const data = Array.isArray(item) ? item : [item];
  const {isLoading, loadMore, hasMore, onRefresh, refreshing, trans, colors} =
    useFrequentVisit();

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const {visitorName, note, createdAt} = item || {};
    return (
      <View
        style={[
          {
            backgroundColor: colors.gray,
            borderRadius: 12,
            width: '90%',
            alignSelf: 'center',
          },
          globalStyles.rowBetween,
        ]}>
        <View style={styles.ListContainer}>
          <Text style={styles.ListContentTextInBlue}>
            🏠{item?.resident?.street?.name} {item?.resident?.home}
          </Text>
          <Text style={styles.ListContentText}>🙋‍♂️{visitorName} </Text>
          <Text style={styles.ListContentText}>
            {trans('Authorize: ') + item?.authorizes}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Max Work : ') + item?.marWork}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Entry Note: ')} {note}{' '}
          </Text>
          <Text style={styles.ListContentText}>
            {trans('Added Date: ✏️')}
            {formatDate(item?.createdAt, 'YYYY-MM-DD')}{' '}
            {moment(item?.createdAt).format('LT')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <Header text={trans('Visit Log')} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <View style={{width: '90%', alignSelf: 'center', marginBottom: 10}}>
            <View style={styles.FrequentTextContainer}>
              <Text style={styles.FrequentText}> {trans('Frequent')}</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>{item?.name}</Text>
              <Text style={styles.headerText}>{data[0]?.visitType?.name}</Text>
            </View>
            <View style={styles.contentInRow}>
              <Text style={styles.EntryDate}>
                {'🗓️ '}
                {trans('Entry Date')}
              </Text>
              <Text style={styles.EntryDate}>
                {formatDate(data[0]?.createdAt, 'DD/MM/YYYY, HH:MM:SS')}
              </Text>
            </View>
            <View style={styles.contentInRow}>
              <Text style={styles.EntryDate}>
                {'🗓️ '}
                {trans('Departure Date')}
              </Text>
              <Text style={styles.EntryDate}>
                {formatDate(data[0]?.date, 'DD/MM/YYYY, HH:MM:SS')}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no data!')}
            forLoading={isLoading}
          />
        }
        ListFooterComponent={
          hasMore ? (
            <View style={[{height: 40}, globalStyles.activityCenter]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        onEndReachedThreshold={0.25}
        onEndReached={hasMore ? loadMore : undefined}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
    ...customMargin(2, 2, 10, 2),
  },
  ListContainer: {
    ...customPadding(10, 20, 10, 10),
    flex: 1,
  },
  ListContentText: {
    ...typographies(colors).ralewayMedium12,
    ...customPadding(0, 26, 0, 0),
  },
  ListContentTextInBlue: {
    ...typographies(colors).ralewayBold15,
    color: colors.primary,
    ...customPadding(0, 26, 0, 0),
  },
  FrequentText: {
    ...typographies(colors).ralewayBold18,
    color: colors.white,
    ...customPadding(10, 20, 10, 20),
  },
  FrequentTextContainer: {
    backgroundColor: colors.primary,
    ...customMargin(20, 20, 10, 20),
    alignItems: 'center',
    borderRadius: 12,
  },
  headerText: {
    ...typographies(colors).ralewayMedium12,
  },
  headerTextContainer: {
    alignItems: 'center',
    ...customMargin(4, 20, 4, 20),
    ...customPadding(0, 10, 10, 10),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
  },
  contentInRow: {
    ...globalStyles.flexRow,
    justifyContent: 'space-between',
  },
  EntryDate: {
    ...typographies(colors).ralewayMediumD,
    ...customMargin(2, 6, 8, 6),
  },
});

export default VisitLogDetails;
