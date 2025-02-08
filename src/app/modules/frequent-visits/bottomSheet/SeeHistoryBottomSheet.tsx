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
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utilities/helper';


interface SeeHistorytProps {
    data: any;
    onClose: () => void;
}

const SeeHistory: React.FC<SeeHistorytProps> = ({ data, onClose }) => {
    const { t: trans } = useTranslation();
    console.log("checking data", data);
    const { colors } = useTheme() as any;

    return (
        <View style={{ ...customPadding(5, 15, 15, 15) }}>
            <Text
                style={styles.LogHeader}>
                {trans('Access History')}
            </Text>
            <View style={styles.container}>

                <Text
                    style={[styles.logText, { marginVertical: 20 }]}>
                    {trans('There is no data!')}
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
        borderBottomWidth: 1, borderBottomColor: colors.gray5,
    },
    logText: {
        ...typographies(colors).ralewayMedium14,

        lineHeight: rs(20),
        ...customPadding(2, 2, 2, 2),
        // marginBottom: rs(12),

    },
    container: {
        ...globalStyles.justifyAlignCenter,
    }

});
export default SeeHistory;
