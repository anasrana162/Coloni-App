import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import { globalStyles, shadow } from '../../assets/global-styles/global.style.asset';
import Button from '../../components/core/button/Button.core';
import { useTheme } from '@react-navigation/native';
import LabelInput from '../../components/app/LabelInput.app';
import { customPadding } from '../../assets/global-styles/global.style.asset';
import { useTranslation } from 'react-i18next';
import RoudiesBottomsheet from './components/RoudiesBottomsheet';
import { useCustomNavigation } from '../../packages/navigation.package';
import { screens } from '../../routes/routeName.route';
import Badge from '../../components/app/Badge.app';
import assistanceService from '../../services/features/assistance/assistance.service';
import { apiResponse } from '../../services/features/api.interface';
import { showMessage } from 'react-native-flash-message';
import { customUseSelector } from '../../packages/redux.package';
import { userStates } from '../../state/allSelector.state';
import { userRoles } from '../../assets/ts/core.data';

const Rondines: React.FC<{
    route: { params?: { index?: number; edit?: boolean; id?: any } };
}> = ({
    route: {
        params: { index, id, edit } = {
            index: -1,
            id: '',
            edit: false,
        },
    },

}) => {
        const values = useRef<{ name: string }>({ name: '' });
        const [selectedType, setSelectedType] = useState('Rondines');
        const { colors } = useTheme() as any;
        const { t: trans } = useTranslation();
        const navigation = useCustomNavigation<any>();
        const {userInfo} = customUseSelector(userStates);
        const [fetching, setFetching] = useState(false);
        const handleChange = (value: string, name?: any) => {
            values.current = { ...values.current, [name]: value };
        };
        useLayoutEffect(() => {
            (async () => {
                if (edit) {
                    setFetching(true);
                    const result = await assistanceService.details(id);
                    const { status, message, body } = result as apiResponse;
                    console.log("checking body,", body);
                    if (status) {
                        values.current = {
                            name: body?.visitorName,
                            
                        };
                        setSelectedType(body?.toursType|| 'Rondines');
                    } else {
                        navigation.goBack();
                        showMessage({ message });
                    }
                    setFetching(false);
                }
            })();

        }, []);
        return (
            <Container>
                <Header text={trans("Rondines")} />
                <ScrollView
                    contentContainerStyle={[globalStyles.flexRow, styles.container]}>
                                   
                    <View style={{ ...customPadding(18, 2, 2, 2) }}>
                        <LabelInput
                            placeholder={trans("Write your name")}
                            name="name"
                            onChangeText={(value) => handleChange(value, 'name')}
                            defaultValue={values?.current?.name}
                        />
                    </View>
                                     
                    <Button
                        text={trans("Start")}
                        onPress={() =>
                            global.showBottomSheet({
                                flag: true,
                                component: RoudiesBottomsheet,
                                componentProps: {
                                    onConfirm: () => {
                                        navigation.navigate(screens.RondiesMap as never, {
                                            name: values.current.name,
                                            toursType: selectedType,
                                            edit: edit,
                                            index,
                                            id: id,
                                        });
                                    },
                                    onCancel: () => {
                                        console.log("action cancelled");
                                    },
                                },
                            })
                        }
                    />
                </ScrollView>
            </Container>
        );
    };

export default Rondines;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: rs(20),
        flexDirection: 'column',
        height: '100%',
        paddingBottom: rs(20),
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
});
