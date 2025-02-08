import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Badge from '../../../components/app/Badge.app';
import {
    customPadding,
    globalStyles,
} from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import { colors } from '../../../assets/global-styles/color.assets';
import {useTranslation} from 'react-i18next';


interface LogBottomSheetProps {
    data: any;
    onClose: () => void;
}

const LogBottomSheet: React.FC<LogBottomSheetProps> = ({ data, onClose }) => {
    console.log("checking data", data);
    console.log("checking values",data?.current?.createdAt)
    const { colors } = useTheme() as any;
    const {t: trans} = useTranslation();

    return (
        <View style={{ ...customPadding(5, 15, 15, 15) }}>
            <Text
                style={styles.LogHeader}>
                {trans('Logs')}
            </Text>
            <View>
           
                <Text
                    style={styles.logText}>
                    {trans('Time at which Log created:')}{' '}{data?.current?.createdAt}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Status:')}{' '}{data?.current?.status}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Name:')}{' '} {data?.current?.paymentType?.name}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Amount:')}{' '}$ {data?.current?.amount}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Note:')}{' '} {data?.current?.note}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Payment Date:')}{' '}{data?.current?.paymentDate}
                </Text>
                <Text
                    style={styles.logText}>
                    {trans('Expire Date:')}{' '}{data?.current?.expireDate}
                </Text>
            </View>
            <View style={globalStyles.flexRow}>
                <Badge
                    text="Close"
                    style={{ width: '100%', borderRadius: rs(10) }}
                    textColor={colors.black}
                    bgColor={colors.gray3}
                    onPress={() => {
                        onClose();
                        global.showBottomSheet({ flag: false });
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    LogHeader: {
        ...typographies(colors).montserratSemibold16,
        color: colors.primary,
        textAlign: 'center',
        lineHeight: rs(40),
    },
    logText: {
        ...typographies(colors).ralewayMedium14,
        
        lineHeight: rs(20),
        ...customPadding(2,2,2,2),
        // marginBottom: rs(12),

    }

});
export default LogBottomSheet;
