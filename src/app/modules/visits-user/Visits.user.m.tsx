import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PermissionsAndroid,
    Platform,
    Alert,
    ToastAndroid,
    Image,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import {
    gettingMoreAction,
    refreshingAction,
    isGettingAction,
    searchingAction,
} from '../../state/features/visits/visits.slice';
import { useIsFocused, useTheme } from '@react-navigation/native';
import {
    customUseDispatch,
    customUseSelector,
} from '../../packages/redux.package';
import { userStates, visitsStates } from '../../state/allSelector.state';
import { useCustomNavigation } from '../../packages/navigation.package';
import ShowDate from '../../components/app/ShowDate.app';
import Badge from '../../components/app/Badge.app';
import useFrequentVisit from '../frequent-visits/hooks/useFrequentVisit.hook';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { debounceHandler, formatDate } from '../../utilities/helper';
import DownArrow from '../..//assets/images/svg/downArrow.svg';
import { userRoles } from '../../assets/ts/core.data';
import { screens } from '../../routes/routeName.route';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';
import Pagination from '../../components/core/Pagination.core.component';
import eventualVisitsService from '../../services/features/eventualVisits/eventualVisits.visitlogs.service';
import { config } from '../../../Config';
import SelectMonth from '../../components/app/SelectMonth.app';
import { showMessage } from 'react-native-flash-message';
import frequentVisitService from '../../services/features/frequentVisit/frequentVisit.service';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
interface RadioButtonProps {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
    options,
    selectedValue,
    onSelect,
}) => {
    return (
        <View style={styles.radioGroup}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.optionContainer,
                        selectedValue === option && styles.selectedOptionContainer,
                    ]}
                    onPress={() => onSelect(option)}>
                    <View style={styles.radioCircleContainer}>
                        <View
                            style={[
                                styles.radioCircle,
                                {
                                    borderColor:
                                        selectedValue === option ? colors.white : colors.primary,
                                },
                            ]}>
                            {selectedValue === option && (
                                <View
                                    style={[
                                        styles.radioInnerCircle,
                                        { backgroundColor: colors.white },
                                    ]}
                                />
                            )}
                        </View>
                    </View>
                    <Text
                        style={[
                            styles.optionText,
                            {
                                color: selectedValue === option ? colors.white : colors.primary,
                            },
                        ]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
const VistsUsers = () => {
    const { t: trans } = useTranslation();
    const navigation = useCustomNavigation<any>();
    const { userInfo } = customUseSelector(userStates);
    const isFocused = useIsFocused();
    const dispatch = customUseDispatch();
    const { colors } = useTheme() as any;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('Date');
    const [status, setStatus] = useState('Records');
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [params, setParams] = useState({
        page: 1,
        perPage: 8,
        period: "",    //moment(new Date()).format('YYYY-MM-DD'),
        search: '',
        status: 'Entrance',
        type: 'record',
        dateType: 'month',
        resident: userInfo?._id,
        button: "Frequent",
    });
    const [paginationInfo, setPaginationInfo] = useState<any>({});
    const [list, setlist] = useState(null);

    //code for dowloading data in excel starts from here
    useEffect(() => {

        if (isFocused) {
            fetchVists(params);
        }
    }, [isFocused]);

    const fetchVists = async (params: any) => {
        setLoading(true);
        let logs: any = {}
        if (params?.button == "Eventual") {
            logs = await eventualVisitsService.list(params);
            var {
                data: { list, page, perPage, results, total, totalPages, totalCount },
                success,
            } = logs;
            if (success) {
                setPaginationInfo({
                    page,
                    perPage,
                    results,
                    total,
                    totalPages,
                    totalCount,
                });
                setlist(list);
                setLoading(false);
                setRefreshing(false);
                return;
            } else {
                Alert.alert(trans('Error'), trans('Unable to fetch logs!'));
                setLoading(false);
                setRefreshing(false);
            }
        } else {
            logs = await frequentVisitService.list(params)
            // console.log("Logs Frequent:",logs?.body)
            var {
                body: { list, page, perPage, results, totalPages, },
                status,
            } = logs;
            if (status) {
                setPaginationInfo({
                    page,
                    perPage,
                    results,
                    totalPages,
                });
                setlist(list);
                setLoading(false);
                setRefreshing(false);
                return;
            } else {
                Alert.alert(trans('Error'), trans('Unable to fetch logs!'));
                setLoading(false);
                setRefreshing(false);
            }
        }
        // console.log('logs Fetched:', logs, '  Token: ', config.token);


    };



    const handleChange = (name: string, value: any) => {
        console.log('Name: ', name, ' value: ', value);
        setParams((prev: any) => ({ ...prev, [name]: value }));
        console.log('Params', params);
        fetchVists({ ...params, [name]: value });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchVists(params);
    };

    const onNextPage = () => {
        if (params.page >= paginationInfo?.totalPages) {
            return;
        }
        setParams({
            ...params,
            page: params?.page + 1,
        });
        fetchVists({
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
        fetchVists({
            ...params,
            page: params?.page - 1,
        });
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const { note, visitorName, authorizes, name, status } = item || {};
        console.log('Itm', item);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    // if (params?.button == "Eventual") {

                    //     navigation.navigate(screens.VisitLogDetails as never, {
                    //         //edit: true,
                    //         index,
                    //         id: item?._id,
                    //         item: item,
                    //     })
                    // } else {
                    //     navigation.navigate(screens.addFrequentVisits as never, {
                    //         index,
                    //         residentId: userInfo?.id,
                    //         id: item?._id,
                    //         edit: true,
                    //         item: item,
                    //     });
                    // }

                }}
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.gray,
                        borderRadius: 12,
                        width: '90%',
                        alignSelf: 'center',
                        gap: 10,
                        padding: 10
                    },

                ]}>
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.primary,
                    overflow: "hidden"
                }}>
                    <Image
                        source={{ uri: !item?.images[0] ? "https://coloniapp.com/assets/income/income-profile.png" : item?.images[0] }}
                        style={{ width: "90%", height: "90%", borderRadius: 40 }}

                    />
                </View>
                <View style={[styles.ListContainer, {
                    width: params?.button == "Eventual" ? "80%" : "55%"
                }]}>
                    {params?.button == "Eventual" && <Text style={styles.ListContentTextInBlue}>🙋‍♂️ {visitorName}</Text>}
                    {params?.button == "Frequent" && <Text style={styles.ListContentTextInBlue}>🙋‍♂️ {!name ? visitorName : name}</Text>}

                    {params?.button == "Eventual" && <Text style={styles.ListContentText}>{note} </Text>}
                    {params?.button == "Frequent" && <Text style={styles.ListContentText}>📁 {item?.visitType?.name} </Text>}

                    {params?.button == "Eventual" && item.enterDate && <View style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <View style={{ width: 80, height: 25, backgroundColor: colors.gray3, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.ListContentText, { ...customPadding(0, 0, 0, 0), color: "black" }]}>{moment(item?.enterDate).format("LT")} </Text>
                        </View>
                        <View style={{ width: 80, height: 25, backgroundColor: colors.primary, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.ListContentText, { ...customPadding(0, 0, 0, 0), color: "white" }]}>{moment(item?.updatedAt).format("LT")} </Text>
                        </View>
                    </View>}
                    {params?.button == "Eventual" && <Text style={[styles.ListContentText, { fontSize: 8 }]}>This visit was registered directly by the 👮Vigilante for your home </Text>}

                </View>
                {params?.button == "Frequent" && item?.asset && <View
                    style={{
                        // width: "30%",
                        padding: 10,
                        backgroundColor: colors.brightGreen,
                        borderRadius: 20,
                    }}>
                    <Text style={[styles.ListContentText, { ...customPadding(0, 0, 0, 0), }]}>{trans("Active")}</Text>
                </View>}
            </TouchableOpacity>
        );
    };

    const memoizedValue = useMemo(() => renderItem, []);

    return (
        <Container>
            <Header text={trans('Visits')} rightIcon={
                (<ImagePreview source={imageLink.addIcon} />)
            }
                rightControl={() => {
                    if (params?.button == "Frequent") {

                        navigation.navigate(screens.addFrequentVisits as never, {
                            residentId: userInfo?._id,
                        })
                    } else {
                        navigation.navigate(screens.addVisits as never, {
                            // edit: true,
                            // index,
                            id: userInfo?._id,
                            name: `${userInfo?.street.name} ${userInfo?.home}`,
                        })
                    }

                }}
            />

            <FlatList
                keyboardShouldPersistTaps="always"
                stickyHeaderIndices={[0]}
                initialNumToRender={2}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={list}
                renderItem={renderItem}
                keyboardDismissMode="on-drag"
                keyExtractor={(_item, index) => index.toString()}
                ListHeaderComponent={
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                        <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-around", alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={() => handleChange("button", "Frequent")}
                                style={[styles.touchableCont, { backgroundColor: params?.button == "Frequent" ? colors.primary : colors.gray3 }]}>
                                <Text style={[styles.touchableText, { color: params?.button == "Frequent" ? "white" : "black" }]}>{trans("Frequent")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChange("button", "Eventual")}
                                style={[styles.touchableCont, { backgroundColor: params?.button == "Eventual" ? colors.primary : colors.gray3 }]}>
                                <Text style={[styles.touchableText, { color: params?.button == "Eventual" ? "white" : "black" }]}>{trans("Eventual")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <>
                        {loading ? (
                            <ActivityIndicator size={'large'} color={colors.primary} />
                        ) : (
                            <EmptyContent text={trans('There is no data!')} />
                        )}
                    </>
                }
                contentContainerStyle={{ gap: rs(5) }}
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

const styles = StyleSheet.create({
    touchableCont: {
        width: "45%",
        height: 45,
        backgroundColor: colors.gray3,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    touchableText: {
        ...typographies(colors).montserratMedium13
    },
    container: {
        ...globalStyles.flexRow,
        justifyContent: 'space-between',
        ...customMargin(2, 20, 10, 2),
    },
    ListContainer: {
        width: "55%",
        rowGap: 5
    },
    ListContentText: {
        ...typographies(colors).ralewayMedium12,
        color: colors?.gray,
        ...customPadding(0, 26, 0, 0),
    },
    ListContentTextInBlue: {
        ...typographies(colors).ralewayBold15,
        color: colors.primary,
        ...customPadding(0, 26, 0, 0),
    },
    generateFiletext: {
        ...typographies(colors).ralewayMedium14,
        color: colors.white,
        // ...customMargin(10, 20, 2, 20),
    },
    headerText: {
        ...typographies(colors).ralewayMedium14,
        color: colors.primary,
        ...customPadding(2, 20, 2, 2),
    },
    textInRow: {
        ...globalStyles.flexRow,
        ...customPadding(0, 10, 2, 10),
    },
    box1: {
        height: 15,
        width: 18,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: colors.gray1,
    },
    box2: {
        height: 15,
        width: 18,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: colors.gray1,
    },
    containeForRadio: {
        backgroundColor: colors.tertiary,
    },
    radioGroup: {
        width: '90%',
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: colors.tertiary,
        paddingHorizontal: 20,
    },
    optionContainer: {
        ...globalStyles.flexRow,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    selectedOptionContainer: {
        backgroundColor: colors.tertiary,
    },
    radioCircleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInnerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    optionText: {
        ...typographies(colors).ralewayMedium10,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default VistsUsers;
