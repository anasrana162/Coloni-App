import {
  View,
  Text,
  Modal,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useLayoutEffect, useRef, useState} from 'react';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import ActiveOrDisActive from '../../components/app/ActiveOrDisactive.app';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import imageLink from '../../assets/images/imageLink';
import {
  customMargin,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import Badge from '../../components/app/Badge.app';
import DateTimeInput from '../../components/app/DateTimeInput.app';
import ApproveBottomSheet from '../bills/bottomSheet/Approve.bottomSheet';
import {useTranslation} from 'react-i18next';
import {
  customUseDispatch,
  customUseSelector,
} from '../../packages/redux.package';
import {useCustomNavigation} from '../../packages/navigation.package';
import debtorsReportService from '../../services/features/debtorsReport/debtorsReport.service';
import DeleteBottomSheet from '../month-charge/components/DeleteBottomSheet';
import {
  deleteAction,
  updateAction,
} from '../../state/features/debtorsReport/debtorsReport.slice';
import {screens} from '../../routes/routeName.route';
import {formatDate, showAlertWithOneAction} from '../../utilities/helper';
import {apiResponse} from '../../services/features/api.interface';
import {userRoles} from '../../assets/ts/core.data';
import SelectMonth from '../../components/app/SelectMonth.app';
import MonthYearInput from './components/Month&yearInputField';
import {userStates} from '../../state/allSelector.state';
const DetailsDebtorsReport: React.FC<{
  route: {params: {index: number; item: any; status: string}};
}> = ({
  route: {
    params: {item, index, status},
  },
}) => {
  const [fetching, setFetching] = useState(false);
  const [Debtors, setDebtors] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [image, setImage] = useState([]);
  const [updateData, setUpdateData] = useState<{period: any; asset: boolean}>({
    period: '',
    asset: false,
  });
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const {t: trans} = useTranslation();
  const dispatch = customUseDispatch();
  const navigation = useCustomNavigation<any>();
  const {userInfo} = customUseSelector(userStates);

  useLayoutEffect(() => {
    (async () => {
      setFetching(true);
      setUpdateData({
        period: item?.period,
        asset: item?.asset,
      });
      const result = await debtorsReportService.detailsByDate(item?.period);
      const {status, message, body} = result as apiResponse;
      if (status) {
        setDebtors(body?.list?.debReport);
        setTotalAmount(body?.list?.totalAmount);
        setImage(body?.list?.image);
        setFetching(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name: string, val: any) => {
    setUpdateData(prev => ({...prev, [name]: val}));
  };

  const handleUpdate = async () => {
    setLoader(true);
    const payload = {
      ...updateData,
      resident: userInfo?._id,
    };
    console.log('Payload:', payload);
    const result = await debtorsReportService.update(payload, item?._id);

    const {status, body, message} = result as apiResponse;
    console.log(
      'API RESPONSE ....STATUS..>',
      status,
      '..body..>',
      body,
      '...message..>',
      message,
    );
    if (status) {
      dispatch(updateAction({item: body, index, id: item?._id}));
      // navigation.goBack();
      setLoader(false);
      setUpdateModal(false);
    } else {
      setLoader(false);
      setUpdateModal(false);
      showAlertWithOneAction({
        title: trans('Debtors report'),
        body: message,
      });
    }
  };
  const isAdmin =
    userInfo?.role == userRoles.ADMIN ||
    userInfo?.role == userRoles.SUPER_ADMIN;
  return (
    <Container>
      <Header text="Debtors Report" />
      <ScrollView style={{...customMargin(5, 20, 20, 20)}}>
        {isAdmin && (
          <>
            <MonthYearInput
              label={trans('Period')}
              defaultValue={updateData.period}
              disabled={true}
              onChange={(date, name) => handleChange('period', date)}
            />
            <ActiveOrDisActive
              disabled={userInfo?.role == userRoles.RESIDENT}
              label="Asset"
              defaultValue={updateData?.asset}
              onChange={(val, name) => handleChange(name, val)}
              name="asset"
            />
          </>
        )}

        <View
          style={{
            ...customPadding(14, 12, 17, 12),
            borderTopRightRadius: rs(20),
            borderTopLeftRadius: rs(20),
            backgroundColor: colors.primary,
            alignItems: `${'center'}`,
            marginTop: rs(20),
          }}>
          <ImagePreview
            source={image ? {uri: image?.[0]} : imageLink.profileImage}
            styles={{
              width: rs(57),
              height: rs(57),
              borderRadius: rs(50),
              borderWidth: rs(5),
              borderColor: colors.white,
            }}
          />
          <Text
            style={[
              typographies(colors).ralewayMedium14,
              {color: colors.white, marginTop: rs(8)},
            ]}>
            {formatDate(item?.period, 'MMM YYYY')}
          </Text>
          <Text
            style={[
              typographies(colors).ralewayMedium10,
              {color: colors.white, marginTop: rs(5)},
            ]}>
            {trans('Details of Debts')}
          </Text>
          <View
            style={[
              globalStyles.rowBetween,
              {
                backgroundColor: colors.white,
                ...customPadding(7, 9, 7, 9),
                borderRadius: rs(10),
                width: `${'100%'}`,
                marginTop: rs(20),
              },
            ]}>
            <Text style={[typographies(colors).ralewayBold10]}>
              {trans('Total Receivable')}
            </Text>
            <Text style={[typographies(colors).ralewayBold10]}>
              ${totalAmount}
            </Text>
          </View>
          {Debtors.length > 0 ? (
            Debtors.map((debtor: any, index: number) => {
              return (
                <View
                  key={index}
                  style={[
                    globalStyles.rowBetween,
                    {
                      width: '95%',
                      marginTop: rs(5),
                      borderBottomWidth: rs(1),
                      paddingBottom: rs(8),
                      borderBottomColor: colors.white,
                    },
                  ]}>
                  {debtor?.resident?.name ? (
                    <>
                      <View>
                        <Text
                          style={[
                            typographies(colors).ralewayMedium10,
                            {color: colors.white},
                          ]}>
                          {`${debtor?.resident?.street?.name} ${debtor?.resident?.home}`}
                        </Text>
                        <Text
                          style={[
                            typographies(colors).ralewayMedium08,
                            {color: colors.gray1},
                          ]}>
                          {debtor?.paymentType?.name}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            typographies(colors).ralewayMedium10,
                            {color: colors.white},
                          ]}>
                          ${debtor?.amount}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text
                      style={[
                        typographies(colors).ralewayMedium10,
                        {color: colors.white},
                      ]}>
                      {trans('No details found!')}
                    </Text>
                  )}
                </View>
              );
            })
          ) : (
            <Text
              style={[
                typographies(colors).ralewayMedium10,
                {color: colors.white},
              ]}>
              {trans('No details found!')}
            </Text>
          )}
        </View>
        {userInfo?.role !== userRoles.RESIDENT && (
          <View style={[globalStyles.flexRow, {marginTop: rs(15)}]}>
            <Badge
              text="Eliminate"
              bgColor={colors.gray3}
              textColor={colors.white}
              style={{
                width: `${'48.5%'}`,
                borderRadius: rs(10),
                backgroundColor: colors.eliminateBtn,
              }}
              onPress={() =>
                global.showBottomSheet({
                  flag: true,
                  component: DeleteBottomSheet,
                  componentProps: {
                    onConfirm: async () => {
                      await dispatch(deleteAction({index, id: item?._id}));
                      navigation.goBack();
                      await debtorsReportService.delete(item?._id);
                    },
                    onCancel: () => {},
                  },
                })
              }
            />
            <Badge
              text="Update"
              bgColor={colors.light}
              textColor={colors.black}
              style={{width: `${'48.5%'}`, borderRadius: rs(10)}}
              onPress={() => {
                setUpdateModal(true);
                // navigation.navigate(screens.addUpdateDebtorsReport, {
                //   edit: true,
                //   index,
                //   id: item?._id,
                // })
              }}
            />
          </View>
        )}
      </ScrollView>

      <Modal
        visible={updateModal}
        transparent={true}
        animationType="slide"
        onDismiss={() => setUpdateModal(false)}>
        <View style={styles.modalMainCont}>
          <TouchableOpacity
            onPress={() => setUpdateModal(false)}
            style={styles.modalDismissBack}></TouchableOpacity>
          <View style={styles.modalContentCont}>
            <Text
              style={{
                ...typographies(colors).ralewayBold,
                color: colors.primary,
                fontSize: 18,
              }}>
              {trans("Debtor's Report")}
            </Text>
            <Text
              style={{
                ...typographies(colors).ralewayMedium14,
                color: colors.primary,
                fontSize: 16,
                marginTop: 10,
              }}>
              {trans('Update Debtor Report')}
            </Text>
            <TouchableOpacity
              disabled={loader}
              style={styles.modalConfirmBtn}
              onPress={handleUpdate}>
              {loader ? (
                <ActivityIndicator size={'small'} color={colors.white} />
              ) : (
                <Text
                  style={{
                    ...typographies(colors).ralewayMedium14,
                    color: colors.white,
                    fontSize: 16,
                  }}>
                  {trans('Confirm')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default DetailsDebtorsReport;

const styles = StyleSheet.create({
  modalMainCont: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDismissBack: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColorDark,
    position: 'absolute',
    zIndex: 100,
  },
  modalContentCont: {
    width: Dimensions.get('window').width - 60,
    height: 200,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 150,
  },
  modalConfirmBtn: {
    width: '80%',
    height: 45,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
