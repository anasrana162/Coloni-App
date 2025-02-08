import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { colors } from '../../assets/global-styles/color.assets';
import { formatDate } from '../../utilities/helper';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { customPadding, customMargin } from '../../assets/global-styles/global.style.asset';

interface CalculateBalanceCardProps {
    data: any;
}

const CalculateBalanceCard: React.FC<CalculateBalanceCardProps> = ({ data }) => {
    const paidMonthCharges = data?.paidMonthCharges || [];
    console.log("checking data.......",data);
    const home = data?.resident?.home;
    const street = data?.resident?.street?.name;
    const date = data?.createdAt;
    const createdAt = data?.createdAt;
    const name = data?.resident?.name;
    const amount = data?.amount;
    console.log("cecking amount.........",amount);
    const paymentType = data?.monthCharge?.paymentType?.name;
    const toDiscount = paidMonthCharges.map(charge => charge.amount);
    const amounts = paidMonthCharges.map(charge => charge.monthCharge?.amount || 0);

    const { colors } = useTheme() as any;
    const { t: trans } = useTranslation();

    return (
        <View style={styles.cardContainer}>
            <View style={customPadding(10, 10, 10, 10)}>
                <Text style={typographies(colors).ralewayNormal14}>
                    {`${street || ''} ${home || ''} ${name || ''}`}
                </Text>

                <Text style={typographies(colors).ralewayNormal14}>{formatDate(date, 'DD-MM-YYYY')} {paymentType}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>{formatDate(createdAt, 'DD-MM-YYYY')}</Text>
                <Text style={styles.summaryText}>${amount}</Text>
                <Text style={styles.summaryText}>-----</Text>
                <Text style={styles.summaryText}>${amount}</Text>
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableHeader}>{trans('Date')}</Text>
                    <Text style={styles.tableHeader}>{trans('Amount')}</Text>
                    <Text style={styles.tableHeader}>{trans('To Discount')}</Text>
                    <Text style={styles.tableHeader}>{trans('To Turn Off')}</Text>
                </View>

                {paidMonthCharges.length > 0 ? (
                    paidMonthCharges.map((charge, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.textStyle}>{formatDate(charge.monthCharge?.createdAt, 'YYYY-MM')}</Text>
                            <Text style={styles.textStyle}>${amounts[index]}</Text>
                            <Text style={styles.textStyle}>${toDiscount[index]}</Text>
                            <Text style={styles.textStyle}>${(amounts[index])}</Text>
                        </View>
                    ))
                ) : (
                    <>
                        <View style={styles.midTextContainer}>
                            <Text style={typographies(colors).ralewayBold12}>
                                {trans('No outstanding debt in ')}{formatDate(createdAt, 'YYYY-MM')}
                            </Text>
                        </View>
                        <View style={customPadding(0, 0, 6, 6)}>
                            <Text style={typographies(colors).ralewayNormal09}>
                                {trans('No "Installation" debit was found dated 2024-02, validate that you have not manually approved the charge or another credit balance has been used in this month.')}
                            </Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

export default CalculateBalanceCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.primary,
        ...customMargin(12),
        width: 350,
        borderRadius: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    summaryText: {
        ...typographies(colors).ralewayNormal12,
        color: colors.white,
        flex: 1,
        textAlign: 'center',
    },
    tableContainer: {
        ...customMargin(2, 2, 2, 2),
        borderColor: colors.white,
        borderRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: colors.white,
        ...customPadding(4, 10, 4, 10),
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
    },
    textStyle: {
        ...typographies(colors).ralewayNormal14,
        flex: 1,
        color: colors.white,
        textAlign: 'center',
    },
    midTextContainer: {
        ...customMargin(16, 0, 8, 0),
        ...customPadding(10, 13, 10, 13),
        backgroundColor: colors.gray4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
