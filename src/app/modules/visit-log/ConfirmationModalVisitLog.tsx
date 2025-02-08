import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';

const {width, height} = Dimensions.get('screen');

interface ConfirmationModalVisitLogsProps {
  title: string;
  para: string;
  button1Text: string;
  button2Text: string;
  onButton1Press: any;
  onButton2Press: any;
  onDismiss: any;
}

const ConfirmationModalVisitLog: React.FC<ConfirmationModalVisitLogsProps> = ({
  title,
  para,
  button1Text,
  button2Text,
  onButton1Press,
  onButton2Press,
  onDismiss,
}) => {
  return (
    <View
      style={[
        styles.modalOverlay,
        {
          zIndex: Platform.OS === 'ios' ? 1000 : 100,
        },
      ]}>
      <Pressable onPress={() => onDismiss()} style={styles.backGrounCont} />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.para}>{para}</Text>
        <View style={styles.flex_row}>
          <TouchableOpacity
            onPress={() => onButton1Press()}
            style={styles.button1}>
            <Text style={[styles.button, {color: colors.black}]}>
              {button1Text}
            </Text>
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

export default ConfirmationModalVisitLog;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGrounCont: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  container: {
    width: width - 80,
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  title: {
    ...typographies(colors).montserratSemibold16,
    fontSize: 18,
    marginBottom: 10,
    color: colors.primary,
  },
  para: {
    ...typographies(colors).montserratNormal12,
    fontSize: 16,
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  flex_row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button1: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 30,
  },
  button2: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray1,
    borderRadius: 30,
  },
  button: {
    ...typographies(colors).ralewayBold15,
    color: colors.black,
    marginVertical: 5,
  },
});
