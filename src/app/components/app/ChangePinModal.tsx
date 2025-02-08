import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TextProps,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import authService from '../../services/features/auth/auth.service';

const {width, height} = Dimensions.get('screen');


interface ChangePinModalProps {
  onDismiss: any;
  onChange: any;
  mainContStyle?: any;
  title: string;
  _id: string;
}
const ChangePinModal: React.FC<ChangePinModalProps> = ({
  title,
  onDismiss,
  onChange,
  mainContStyle,
  _id,
}) => {
  const {t: trans} = useTranslation();

  // states
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const generateClueAndPin = async () => {
    try {
      var fetchData = await authService.generatePinandUser();
      console.log('fetchData generateClueAndPin():', fetchData);
      if (fetchData == 'error') {
        return Alert.alert(trans('Error'), '#FUP');
      } else {
        setNewPin(fetchData?.pin);
        setConfirmPin(fetchData?.pin);
      }
    } catch (error) {
      console.log('error generateClueAndPin: ', error);
    }
  };

  const handleSubmit = async () => {
    try {
      let obj = {
        userId: _id,
        confirmPin: confirmPin,
        pin: newPin,
      };
      let result = await authService.changePin(obj);
      console.log('Result from change user pin Modal:', result);
      var {message, status} = result;
      if (status) {
        Alert.alert(trans('Success'), message);
        onDismiss();
      } else {
        Alert.alert(trans('Error'), trans('Cannot change Pin'));
      }
    } catch (error) {
      console.log(trans('Error! changing user pin!'), error);
      Alert.alert(trans('Error'), trans('Cannot change Pin'));
    }
  };

  useEffect(() => {
    generateClueAndPin();
  }, []);

  return (
    <View
      style={{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
      }}>
      <Pressable
        onPress={() => onDismiss()}
        style={styles.backGrounCont}></Pressable>
      <View style={[styles.container, mainContStyle]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.title, {fontSize: 16, alignSelf: 'flex-start'}]}>
          {trans('New Pin')}
        </Text>
        <TextInput style={styles.txtInp} value={newPin} editable={false} />
        <Text style={[styles.title, {fontSize: 16, alignSelf: 'flex-start'}]}>
          {trans('Confirm Pin')}
        </Text>
        <TextInput style={styles.txtInp} value={confirmPin} editable={false} />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonTxt}>{trans('Change Pin')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePinModal;

const styles = StyleSheet.create({
  container: {
    width: width - 80,
    position: 'absolute',
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  } as ViewStyle,
  backGrounCont: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 100,
  },
  title: {
    ...typographies(colors).montserratSemibold16,
    fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: colors.primary,
    marginTop: 10,
  } as TextStyle,
  button: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonTxt: {
    ...typographies(colors).ralewayBold15,
    color: colors.black,
  } as TextStyle,
  txtInp: {
    width: '90%',
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.graySoft,
    marginVertical: 10,
    alignSelf: 'flex-start',
    ...typographies(colors).ralewayBold15,
    paddingLeft: 10,
  },
});
