import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../layouts/Container.layout';
import {
    customMargin,
    customPadding,
    globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import Header from '../../components/core/header/Header.core';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import IconCircle from '../../components/app/IconCircle.app';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { userRoles } from '../../assets/ts/core.data';
import documentsService from '../../services/features/documents/documents.service';
import { useTranslation } from 'react-i18next';
import {
    customUseSelector,
} from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import {
    formatDate,
} from '../../utilities/helper';

import { colors } from '../../assets/global-styles/color.assets';


const ViewDocuments = (props: any) => {
    const { t: trans } = useTranslation();
    const navigation = useCustomNavigation<any>();
    const { userInfo } = customUseSelector(userStates);
    // const isFocused = useIsFocused();

    var { item } = props?.route?.params

    // useEffect(() => {
    //     if (isFocused) {

    //     }
    // }, [isFocused]);


    const renderItem = () => {
        const { document, qualification, date, note, _id, uploadfile } = item || {};
        console.log('checking undefined values', uploadfile);
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                    navigation.navigate(screens.addDocuments as never, {
                        edit: true,
                        id: item?._id,
                    })
                }
                style={[
                    globalStyles.flexRow,
                    {
                        padding: 15,
                        margin: 15,
                        backgroundColor: colors.graySoft,
                        borderRadius: rs(25),
                        marginTop: rs(15),
                        gap: rs(20),

                    },
                ]}>

                <View>
                    <View
                        style={[
                            globalStyles.flexShrink1,
                            globalStyles.rowBetween,
                            { width: '100%' },
                        ]}>
                        <View style={globalStyles.flexShrink1}>
                            <Text
                                style={[
                                    typographies(colors).ralewayBold15,
                                    { color: colors.primary },
                                ]}>
                                {document?.name}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View
                                style={[
                                    globalStyles.flexRow,
                                    globalStyles.flexShrink1,
                                    { gap: rs(5) },
                                ]}>
                                <Text
                                    style={[
                                        typographies(colors).montserratNormal8,
                                        globalStyles.flexShrink1,
                                        { color: colors.gray3, lineHeight: rs(17), fontSize: 14 },
                                    ]}>
                                    {formatDate(date, 'DD/MM/YYYY')}
                                </Text>
                                <DownArrow style={{ transform: [{ rotate: '-90deg' }] }} />
                            </View>
                        </View>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={[
                            typographies(colors).montserratNormal8,
                            { color: colors.gray3, lineHeight: rs(17), fontSize: 12 },
                        ]}>
                        {note}
                    </Text>
                    <TouchableOpacity
                        onPress={async () => await Linking.openURL(item?.uploadfile.toString())}
                        style={{ flexDirection: "row", alignItems: "center" }}>

                        <IconCircle
                            icon={
                                <ImagePreview
                                    source={item?.uploadfile?.[0] ? imageLink.pdfIcon : imageLink}
                                    styles={{ height: rs(40), width: rs(40), borderRadius: 500 }}
                                    borderRadius={500}
                                />
                            }
                            style={{ height: rs(40), width: rs(40), marginTop: 20 }}
                        />
                        <Text
                            style={[
                                typographies(colors).ralewayMedium14,
                                {
                                    color: colors.primary,
                                    marginTop: 20,
                                    marginLeft: 10
                                },
                            ]}>
                            {trans("See File")}
                        </Text>

                    </TouchableOpacity>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Container>
            <Header
                text={trans('Documents')}
            />
            {renderItem()}

        </Container>
    );
};

export default ViewDocuments;
