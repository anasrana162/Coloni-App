import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
const { width, height } = Dimensions.get("screen")
import FillCheckIcon from '../../assets/icons/FillCheck.icon';
import { typographies } from '../../assets/global-styles/typography.style.asset';
import { useTheme } from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


interface EmergencyTypeProps {
    onPress?: any;
    data?: any;
    onChangeText: any;
}

const EmergencyType: React.FC<EmergencyTypeProps> = ({
    onPress,
    data,
    onChangeText,
}) => {

    const [selected, setSelected] = useState("")
    const { colors } = useTheme() as any;
    const {t: trans} = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={{ ...styles.heading, ...typographies(colors).ralewayBold12black, }}>{trans('Emergency Types (Optional)')}</Text>
            {
                data.map((item: any, index: number) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                onPress(item?.name)
                                setSelected(item?.name)
                            }}
                            style={styles.touchable}
                            key={index}>
                            {selected !== item?.name ? <View style={{ ...styles.circleEmptyIcon, borderColor: colors.primary, }} />
                                : <FillCheckIcon width={30} height={30} fill={colors.primary} />}
                            <View style={styles.icon}>
                                <item.icon />
                            </View>
                            <Text style={{ ...styles.emergencyType, ...typographies(colors).ralewayBold12black, }}>{item?.name}</Text>
                        </TouchableOpacity>
                    )
                })
            }

            <Text style={{ ...styles.heading, ...typographies(colors).ralewayBold12black, }}>{trans('Details Of Emergency')}</Text>

            <TextInput
                style={{ ...styles.txtinp, backgroundColor: colors.gray, color: colors.black, }}
                onChangeText={(txt) => onChangeText(txt)}
            />

            <Text style={{ ...styles.heading, ...typographies(colors).ralewayBold12black, }}>{trans('There are no emergency telephone numbers registered in the private')}</Text>

        </View>
    );
}

export default EmergencyType;

const styles = StyleSheet.create({
    container: {
        width: width - 20,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "wh",
        padding: 10
    },
    touchable: {
        width: "100%",
        marginVertical: 15,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    circleEmptyIcon: { width: 25, height: 25, borderWidth: 2, borderRadius: 30 },
    icon: {
        marginLeft: 40,
    },
    heading: {

        fontSize: 16,
        marginVertical: 10,
        textAlign: "center",
    },
    emergencyType: {

        marginLeft: 60,
        fontSize: 18
    },
    txtinp: {
        width: width - 80,
        height: 40,
        borderRadius: 10,
        borderWidth: 0.5,
    }
});
