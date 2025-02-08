import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { fonts } from '../../../assets/global-styles/fonts.style.asset';
import { useTheme } from '@react-navigation/native';

const RevenueByCategory: React.FC<{
    size?: number;
    showPercentage?: boolean;
    middleText?: string;
    bottomText?: string;
    data?: any;
    onCategorySelect?: (categoryDetails: any) => void; 
}> = ({ size = rs(207), showPercentage = false, middleText = '', data = {}, onCategorySelect }) => {
    const totalIncome = data?.totalIncome || 0;
    const totalExpense = data?.totalExpense || 0;
    const finalBalance = data?.finalBalance || 0;
    const [selectedCategory, setSelectedCategory] = useState<any>(null);


    const paymentTypes = data?.paymentTypeTotals || {};

    const { colors } = useTheme() as any;
    const colorPalette = [
        colors.primary,
        "red",
        colors.yellow,
        "green",
        "orange",
        "purple",
    ];


    const pieChartData = Object.keys(paymentTypes).map((type, index) => {
        return {
            color: colorPalette[index % colorPalette.length],
            value: paymentTypes[type].percentage,
            label: type,
        };
    });

    const handleSlicePress = (label: string) => {
        const typeDetails = paymentTypes[label];
    

        if (typeDetails && onCategorySelect) {
            onCategorySelect({ label, typeDetails });
            setSelectedCategory({ label, ...typeDetails });

        }
    };



    const isDataEmpty = Object.keys(paymentTypes).length === 0;

    return (
        <View
            style={{
                width: '100%',
                height: size / 2 + 50,
                marginVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {isDataEmpty ? (
                <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: 5,
                        borderColor: colors.gray,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                </View>
            ) : (
                <PieChart
                    data={pieChartData}
                    donut
                    radius={size / 2}
                    innerRadius={75}
                    innerCircleBorderColor="lightgray"
                    shadow
                    onPress={(item: any) => handleSlicePress(item.label)}
                />
            )}
            <View style={{ position: 'absolute', zIndex: 100, alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: rs(18),
                        fontFamily: fonts.raleway600,
                        color: colors.active,
                    }}>
                    {selectedCategory ? `$${selectedCategory.percentage.toFixed(2)}%` : ''}
                </Text>

                <Text
                    style={{
                        fontSize: rs(16),
                        fontFamily: fonts.raleway600,
                        color: colors.primary,
                    }}>
                    {selectedCategory ? `$${selectedCategory.total}` : ''}
                </Text>
                <Text
                    style={{
                        fontSize: rs(12),
                        fontFamily: fonts.raleway600,
                        color: colors.black,
                    }}>
                    {selectedCategory?.label || middleText}
                </Text>

            </View>
        </View>
    );
};

export default RevenueByCategory;
