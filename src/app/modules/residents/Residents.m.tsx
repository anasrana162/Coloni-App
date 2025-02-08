import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import SearchInput from '../../components/app/SearchInput.app';
import Badge from '../../components/app/Badge.app';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import ResidentItem from '../../components/app/ResidentItem.app';
import {residentsStyles as styles} from './styles/residents.styles';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
import {showAlertWithOneAction} from '../../utilities/helper';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import Pagination from '../../components/core/Pagination.core.component';
import {customGetUniqueId} from '../../packages/device-info/deviceInfo.package';
import {config} from '../../../Config';
import {userRoles} from '../../assets/ts/core.data';
const {width, height} = Dimensions.get('screen');

// Debounce function
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Residents = () => {
  const navigation = useCustomNavigation<any>();
  const [show, setShow] = useState<string>('assets');
  const {colors}: any = useTheme();
  const {t: trans} = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [list, setList] = useState<any[]>([]);
  const [params, setParams] = useState<any>({
    asset: true,
    search: '',
    page: 1,
    perPage: 10,
    isAdmin: config.role == userRoles.ADMIN,
  });
  const debouncedSearchTerm = useDebounce(params?.search, 1000);

  // const [listDefaults setListDefaults] = useState<any[]>([]);

  useEffect(() => {
    if (isFocused) {
      console.log('Is Focused working');
      fetchResidents(params);
    }
    // fetchResidentsDefaulters(); // commented for now sep 19
  }, [isFocused]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchResidents({...params, search: debouncedSearchTerm});
    } else {
      fetchResidents({...params, search: ''});
    }
  }, [debouncedSearchTerm]);

  const fetchResidents = async (params: any) => {
    console.log('customGetUniqueId', await customGetUniqueId());
    setLoading(true);
    try {
      const result = await userService.ResidentScreen(params, true);
      console.log('API Response:', result); // Debugging line
      const {
        success,
        data: {list, page, perPage, results, total, totalPages},
        message,
      }: any = result as apiResponse;
      if (success) {
        console.log('body?.list', list);

        const keys = list.map((item: any) => item?.role);
        const uniqueArray = [...new Set(keys)];
        let arr: any[] = [];
        for (let i = 0; i < uniqueArray.length; i++) {
          var fetchMatchedRoleData = list?.filter(
            (item: any) => item?.role == uniqueArray[i],
          );
          arr.push({name: uniqueArray[i], data: fetchMatchedRoleData});
        }

        setList(arr);
        setPaginationInfo({page, perPage, results, total, totalPages});
        console.log('Succes fetching residents!');
      } else {
        showAlertWithOneAction({
          title: trans('Resident'),
          body: message,
        });
      }
    } catch (err) {
      console.error('Error while fetching residents:', err); // Debugging line
      showAlertWithOneAction({
        title: trans('Resident'),
        body: trans('An error occurred while fetching.'),
      });
    } finally {
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
    fetchResidents({
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
    fetchResidents({
      ...params,
      page: params?.page - 1,
    });
  };

  return (
    <Container>
      <Header
        text={trans('Residents')}
        rightIcon={<ImagePreview source={imageLink.addIcon} />}
        rightControl={() =>
          navigation.navigate(screens.addUpdateResident as never, {
            createNew: true,
          })
        }
      />

      <View
        style={{
          width: '99%',
          alignSelf: 'center',
          ...customPadding(20, 19, 20, 19),
        }}>
        <View style={styles.middleContainer}>
          <Badge
            text={trans('Assets')}
            style={{flexGrow: 1 / 2}}
            classes="small"
            bgColor={show == 'assets' ? '' : colors.gray5}
            textColor={show == 'assets' ? '' : colors.gray7}
            onPress={() => {
              setShow('assets');
              setParams({...params, asset: true});
              fetchResidents({...params, asset: true});
            }}
          />
          <Badge
            text={trans('Inactive')}
            bgColor={show == 'assets' ? colors.gray5 : ''}
            textColor={show == 'assets' ? colors.gray7 : ''}
            onPress={() => {
              setShow('inactive');
              setParams({...params, asset: false});
              fetchResidents({...params, asset: false});
            }}
            classes="small"
            style={{flexGrow: 1 / 2}}
          />
        </View>
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            ...styles.lowerContainer,
          }}>
          <Text style={[typographies(colors).ralewayBold18]}>
            {trans('Total')}
          </Text>
          <Text style={[typographies(colors).ralewayBold18]}>
            {paginationInfo?.results}
          </Text>
        </View>
      </View>
      <FlatList
        data={list}
        contentContainerStyle={{alignSelf: 'center'}}
        renderItem={({item, index}) => {
          let name = item?.name;
          return (
            <>
              {loading ? (
                <>
                  {index == 0 && (
                    <View style={{marginTop: '50%'}}>
                      <ActivityIndicator
                        size={'large'}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.listMainCont}>
                  <View style={styles.listHeader}>
                    <Text style={styles.listHeaderTitle}>{trans(name)}</Text>
                  </View>

                  <FlatList
                    data={item?.data}
                    scrollEnabled={false}
                    renderItem={({item, index}) => {
                      return (
                        <ResidentItem
                          style={{width: width - 45}}
                          item={item}
                          onPress={() =>
                            navigation.navigate(
                              screens.addUpdateResident as never,
                              {
                                from: true,
                                index: index,
                                id: item?._id,
                                active:
                                  name == 'Administrator' || name == 'Vigilant'
                                    ? true
                                    : false,
                                createNew: false,
                              },
                            )
                          }
                        />
                      );
                    }}
                  />
                </View>
              )}
            </>
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
      />
    </Container>
  );
};

export default Residents;
