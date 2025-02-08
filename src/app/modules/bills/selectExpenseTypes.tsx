/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
    customPadding,
    globalStyles,
} from '../../assets/global-styles/global.style.asset';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import DownArrow from '../../assets/images/svg/downArrow.svg';
import { typographies } from '../../assets/global-styles/typography.style.asset';

const { width, height } = Dimensions.get("screen")

const SelectExpenseTypes: React.FC<{
    data: any,
    onSelect: any,
    placeholder: string,
    defaultValue: any
}> = ({

    data = { data: {} },
    onSelect = { onSelect: () => { } },
    placeholder = { placeholder: "" },
    defaultValue = { defaultValue: null }

}) => {
        const { colors } = useTheme() as any;
        const { t: trans } = useTranslation();
        const [openDropDown, setDropDown] = useState(false)
        const [value, setValue] = useState("")
        const styles = StyleSheet.create({
            container: {
                width: width - 20,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginVertical: 10
            },
            touchable: {
                width: "95%",
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
            dropDownCont: {
                width: "95%",
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginVertical: 5,
                borderWidth: 1
            },
            dropDownItemCont: {
                width: "95%",
                padding: 5,
                alignItems: "flex-start"
            }
        })
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => setDropDown(!openDropDown)}
                    style={styles.touchable}>
                    <Text
                        style={[
                            typographies(colors).ralewayMedium12,
                            globalStyles.flexShrink1,
                            globalStyles.flexGrow1,
                            // { color: !value ? colors.gray3 : colors.grayDark },
                        ]}
                        numberOfLines={1}>
                        {value ? trans(value) : defaultValue ? defaultValue?.expenseType :  placeholder}
                    </Text>
                    <DownArrow />
                </TouchableOpacity>
                {openDropDown && <View style={styles.dropDownCont}>

                    {
                        Array.isArray(data) && data.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item)
                                        setValue(item?.expenseType)
                                        setDropDown(!openDropDown)
                                    }}
                                    style={styles.dropDownItemCont}>
                                    <Text style={typographies(colors).ralewayMedium12}>{item?.expenseType}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>}
            </View>
        );
    };


export default SelectExpenseTypes;
