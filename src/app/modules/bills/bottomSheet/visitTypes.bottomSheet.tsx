import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import {
    customPadding,
    globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import DownArrow from '../../../assets/images/svg/downArrow.svg';
import BottomSheetSelect from '../../../components/core/BottomSheetSelect.app.component';
import AddPayment from './AddPayment.bottomSheet';
import { userRoles } from '../../../assets/ts/core.data';
import { useSelector } from 'react-redux';
import { userStates } from '../../../state/allSelector.state';
import paymentService from '../../../services/features/payment/payment.service';
import visitsTypesService from '../../../services/features/visitTypes/visitsTypes.service';
const VisitType: React.FC<{
    defaultValue?: string;
    onChange?: (value: any, name: string) => void;
    label?: string;
    disabled?: boolean;
    ScreenName?: string;
    style?: any;
}> = ({ defaultValue, onChange, label, ScreenName, style, disabled = false }) => {
    const { t: trans } = useTranslation();
    const { colors } = useTheme() as any;
    const styles = customSelectStyles(colors);
    const [value, setValue] = useState<any>(defaultValue || '');
    const { userInfo } = useSelector(userStates);

    const handleChange = (item: any) => {
        onChange && onChange(item, 'visitType');
        console.log('item', item);
        setValue(item);
    };
    const handleOpenAddExpense = () => {
        global.showBottomSheet({
            flag: true,
            component: AddPayment,
            componentProps: { onChange: handleChange },
        });
    };

    const getDataHandler = async (query: any, success: any) => {
        const result = await visitsTypesService.listEventual();
        console.log('getDataHandler VisitType.bottomsheet:', result);
        success({ ...result, body: { list: result?.body } });
    };

    const onPress = () => {
        global.showBottomSheet({
            flag: true,
            component: BottomSheetSelect,
            componentProps: {
                selectedValue: value?.name,
                title: trans('Visit Type'),
                onChange: handleChange,
                titleField: 'name',
                rightComponent: userInfo?.role === userRoles.SUPER_ADMIN && (
                    <TouchableOpacity activeOpacity={0.7} onPress={handleOpenAddExpense}>
                        <Text style={typographies(colors).ralewayMedium14}>
                            {trans('Add Type')}
                        </Text>
                    </TouchableOpacity>
                ),
                getDataHandler,
            },
        });
    };
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return (
        <View style={[{ marginBottom: rs(13) }, style]}>
            {label && (
                <Text
                    style={[
                        typographies(colors).ralewayMedium14,
                        { color: colors.primary, marginBottom: rs(6), marginLeft: rs(12) },
                    ]}>
                    {label}
                </Text>
            )}
            <TouchableOpacity
                style={styles.textContainer}
                disabled={disabled}
                onPress={onPress}
                activeOpacity={0.6}>
                <Text
                    style={[
                        typographies(colors).ralewayMedium12,
                        globalStyles.flexShrink1,
                        globalStyles.flexGrow1,
                        {
                            color: !value?.name ? colors.gray3 : colors.grayDark,
                        },
                    ]}
                    numberOfLines={1}>
                    {value?.name || trans('Visit Type')}
                </Text>
                <DownArrow />
            </TouchableOpacity>
        </View>
    );
};

export default VisitType;

const customSelectStyles = (colors: any) =>
    StyleSheet.create({
        textContainer: {
            height: rs(42),
            backgroundColor: colors.gray8,
            flexDirection: 'row',
            gap: 8,
            ...customPadding(0, 16, 0, 16),
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },
    });
