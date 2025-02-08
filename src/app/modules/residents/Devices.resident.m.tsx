import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import DevicesIcon from '../../assets/images/svg/devicesIcon.svg';
import CalenderIcon from '../../assets/icons/Calender.icon';
import DeleteIcon from '../../assets/images/svg/deleteIcon.svg';
import {momentTimezone} from '../../packages/momentTimezone.package';
import CustomSwitch from '../../components/core/CustomSwitch.core.component';
import {
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {ActiveDevicesSates} from '../../state/allSelector.state';
import {useCustomNavigation} from '../../packages/navigation.package';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ActiveDevicesService from '../../services/features/ActiveDevices/ActiveDevices.Service';
import {
  deleteAction,
  gettingMoreAction,
  refreshingAction,
  searchingAction,
} from '../../state/features/ActiveDevices/ActiveDevice.slice';
import {CloudFormation} from 'aws-sdk';
import EmptyContent from '../../components/core/EmptyContent.core.component';
import Pagination from '../../components/core/Pagination.core.component';
import LoadingComp from '../optional-configuration/Components/LoadingComp';

const DevicesResident: React.FC<{
  route: {
    params?: {
      resident_Id: string;
    };
  };
}> = ({
  route: {
    params: {resident_Id} = {
      resident_Id: '',
    },
  },
}) => {
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState(false);

  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const [params, setParams] = useState<any>({
    search: '',
    page: 1,
    perPage: 10,
  });

  const getDataHandler = async (params: any) => {
    const result = await ActiveDevicesService.listResident(resident_Id, params);
    var {
      body: {existingDevice, page, perPage, totalCount, totalPages},
    } = result;
    console.log('checking results', result);
    setDeviceData(existingDevice);
    setPaginationInfo({page, perPage, totalCount, totalPages});
    setLoading(false);
    return result?.message;
  };
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, []),
  );
  const onRefresh = () => {
    getDataHandler(params);
  };
  useEffect(() => {
    getDataHandler(params);
  }, []);

  const deleteDevices = async (id: string) => {
    console.log('resssadfasfda');

    return;
  };

  const onNextPage = () => {
    if (params.page >= paginationInfo?.totalPages) {
      return;
    }
    setParams({
      ...params,
      page: params?.page + 1,
    });
    getDataHandler({
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
    getDataHandler({
      ...params,
      page: params?.page - 1,
    });
  };

  const {width, height} = Dimensions.get('screen');
  return (
    <>
      {loadings && <LoadingComp />}
      <Container>
        <Header
          text={trans('Devices')}
          rightIcon={<ImagePreview source={imageLink.saveIcon} />}
        />

        <FlatList
          data={deviceData}
          contentContainerStyle={{...customPadding(0, 20, 0, 20)}}
          renderItem={({item, index}: any) => {
            return (
              <View
                style={[
                  globalStyles.rowBetween,
                  globalStyles.shadow,
                  {
                    borderRadius: rs(10),
                    backgroundColor: colors.white,
                    marginBottom: rs(10),
                    ...customPadding(14, 14, 14, 14),
                  },
                ]}>
                <View style={{gap: rs(10)}}>
                  <View style={globalStyles.flexRow}>
                    <DevicesIcon />
                    <Text
                      style={[
                        typographies(colors).ralewayMedium12,
                        {color: colors.primary},
                      ]}>
                      {item?.deviceId}
                    </Text>
                  </View>
                  <View style={globalStyles.flexRow}>
                    <CalenderIcon />
                    <Text style={typographies(colors).ralewayMedium12}>
                      {momentTimezone(item?.lastLogin).format(
                        'DD/MM/YYYY HH:mm',
                      )}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteDevices(item?._id)}>
                  <DeleteIcon />
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<EmptyContent text={trans('No data to show')} />}
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
    </>
  );
};

export default DevicesResident;
