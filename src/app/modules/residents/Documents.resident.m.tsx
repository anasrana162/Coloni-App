import {
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import SearchInput from '../../components/app/SearchInput.app';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';

import {typographies} from '../../assets/global-styles/typography.style.asset';
import documentsService from '../../services/features/documents/documents.service';
import {
  customPadding,
  globalStyles,
  shadow,
} from '../../assets/global-styles/global.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import Pagination from '../../components/core/Pagination.core.component';
import {debounceHandler} from '../../utilities/helper';
const {width, height} = Dimensions.get('screen');

const ResidentDocuments = (props: any) => {
  var {
    route: {
      params: {resident_id},
    },
  } = props;
  const navigation = useCustomNavigation();
  const [list, setlist] = useState(null);
  const [params, setParams] = useState<any>({
    page: 1,
    perPage: 12,
    id: resident_id ?? '',
    search: '',
    formatJson: true,
  });
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {t: trans} = useTranslation();
  useLayoutEffect(() => {
    if (isFocused) {
      fetchDocuments(params);
      setParams((prevParams: any) => ({
        ...prevParams,
        search: '', // Reset the search
      }));
    }
  }, [isFocused]);

  const handleSearch = debounceHandler((txt: string) => {
    setParams((prevParams: any) => ({...prevParams, search: txt}));
    fetchDocuments({...params, search: txt});
  }, 200);

  const fetchDocuments = async (params: any) => {
    setLoading(true);
    let documents = await documentsService.listResidentDoc(params);
    var {
      data: {list, page, perPage, results, total, totalPages},
      success,
    } = documents;
    // 66e812edacebd0b19779987b
    // https://backend.coloniapp.com/admin/documents/66e812edacebd0b19779987b?search=&page=1&perPage=12&period=
    console.log('Documents Fetched:', documents);
    if (success) {
      setPaginationInfo({page, perPage, results, total, totalPages});
      setlist(list);
      setLoading(false);
      return;
    } else {
      Alert.alert(trans('Error'), trans('Unable to fetch documents!'));
      setLoading(false);
    }
  };

  const onNextPage = () => {
    if (params.page >= paginationInfo?.totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params?.page + 1,
    });
    fetchDocuments({
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
    fetchDocuments({
      ...params,
      page: params?.page - 1,
    });
  };

  var {
    route: {
      params: {ResidentName},
    },
  } = props;
  return (
    <Container>
      <Header
        text={ResidentName || ''}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateDocumentsResident as never, {
            ResidentName,
            update: false,
            resident_id,
          })
        }
      />

      <FlatList
        data={list}
        contentContainerStyle={{...customPadding(20, 20, 0, 20)}}
        ListHeaderComponent={() => {
          return (
            <SearchInput
              onChangeText={handleSearch}
              defaultValue={params.search}
            />
          );
        }}
        ListFooterComponent={
          <>
            {!loading && paginationInfo?.totalPages > 1 && (
              <Pagination
                PageNo={params?.page}
                onNext={() => onNextPage()}
                onBack={() => onPrevPage()}
              />
            )}
          </>
        }
        ListEmptyComponent={() => (
          <EmptyContent text={trans('There is no data to display')} />
        )}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  screens.addUpdateDocumentsResident as never,
                  {
                    ResidentName,
                    item,
                    index,
                    update: true,
                    resident_id,
                  },
                )
              }
              style={styles.listCont}>
              <View style={styles.imageCont}>
                <Image
                  source={imageLink.pdfIcon}
                  style={{width: '70%', height: '70%'}}
                  resizeMode="contain"
                />
              </View>
              <View style={{marginLeft: 10, rowGap: 5, width: '45%'}}>
                <Text
                  style={[
                    typographies(colors).ralewayBold15,
                    {color: colors.primary},
                  ]}>
                  {trans(item?.document?.name)}
                </Text>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {color: colors.primary, marginBottom: -5},
                  ]}>
                  {item?.qualification}
                </Text>
                <Text
                  style={[
                    typographies(colors).ralewayMedium12,
                    {color: colors.gray1},
                  ]}>
                  {item?.note}
                </Text>
              </View>
              <Text
                style={[
                  typographies(colors).ralewayBold12,
                  {color: colors.gray1, position: 'absolute', right: 15},
                ]}>
                {moment(item?.date).format('MM-DD-YYYY')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  listCont: {
    width: width - 60,
    alignSelf: 'center',
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.graySoft,
    // borderWidth: 1,
    shadowColor: colors.gray5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageCont: {
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: 'hidden',
    marginLeft: 10,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResidentDocuments;
