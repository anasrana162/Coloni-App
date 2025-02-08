import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, TextProps, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { colors } from '../../assets/global-styles/color.assets';
import { typographies } from '../../assets/global-styles/typography.style.asset';
const { width, height } = Dimensions.get("screen")
interface ConfirmationModalProps {
    title: string;
    para: string;
    button1Text: string;
    button2Text: string;
    mainContStyle?: ViewStyle; // Optional prop with default type of ViewStyle
    onButton1Press: any,
    onButton2Press: any,
    onDismiss: any
}
// Component definition with typed props
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    para,
    button1Text,
    button2Text,
    mainContStyle,
    onButton1Press,
    onButton2Press,
    onDismiss,
}) => {
    return (
        <View style={{ width: width, height: height, justifyContent: "center", alignItems: "center" }}>
            <Pressable
                onPress={() => onDismiss()}
                style={styles.backGrounCont}>

            </Pressable>
            <View style={[styles.container, mainContStyle]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.para,{width:"90%"}]}>{para}</Text>
                <View style={styles.flex_row}>
                    <TouchableOpacity
                        onPress={() => onButton1Press()}
                        style={styles.button1}>
                        <Text style={[styles.button, { color: colors.black }]}>{button1Text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onButton2Press()}
                        style={styles.button2}>
                        <Text style={styles.button}>{button2Text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
    container: {
        // Define your container styles here
        width: width - 80,
        position: "absolute",
        zIndex: 200,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    } as ViewStyle,
    backGrounCont: {
        width: width,
        height: height,
        backgroundColor: "rgba(52,52,52,0.4)",
        position: "absolute",
        zIndex: 100,
    },
    title: {
        // Define your title styles here
        ...typographies(colors).montserratSemibold16,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.primary,
        marginTop: 10,
    } as TextStyle,
    para: {
        // Define your paragraph styles here
        ...typographies(colors).montserratSemibold16,
        fontSize: 16,
        marginBottom: 20,
        color: colors.primary
    } as TextStyle,
    button: {
        // Define your button styles here
        // fontSize: 16,
        ...typographies(colors).ralewayBold15,
        color: colors.black,
        marginVertical: 5,
    } as TextStyle,
    flex_row: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    button1: {
        width: 120,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 30,
    },
    button2: {
        width: 120,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.gray1,
        borderRadius: 30,
    },
});
