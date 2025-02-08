import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getLocalData,
  removeLocalData,
} from '../packages/asyncStorage/storageHandle';
import { getUniqueId } from 'react-native-device-info';
import {screens} from '../routes/routeName.route';
import {customUseDispatch} from '../packages/redux.package';
import {
  View,
  useColorScheme,
  Modal,
  Dimensions,
  Pressable,
  TextStyle,
  ViewStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {globalStyles} from '../assets/global-styles/global.style.asset';
import {updateTheme} from '../state/features/themeSlice';
import '../language/translator';
import {updateLanguage} from '../state/features/languageSlice';
import {useTranslation} from 'react-i18next';
import {clearAction as vehicleClearAction} from '../state/features/vehicles/vehicle.slice';
import {clearAction as expenseClearAction} from '../state/features/expenses/expense.slice';
import ConfirmationModal from '../components/app/ConfrimationModal';
import {colors} from '../assets/global-styles/color.assets';
import {typographies} from '../assets/global-styles/typography.style.asset';
import userService from '../services/features/users/user.service';
const {width, height} = Dimensions.get('screen');
const AppContext = createContext({});
declare global {
  var logout: () => void;
  var deleteAccount: () => void;
}
export let latestColors = {};
const AppProvider: React.FC<{children: any}> = ({children}) => {
  const dispatch = customUseDispatch();
  const {t: trans} = useTranslation();
  const scheme = useColorScheme();
  const {i18n} = useTranslation();
  const [confModal, setConfModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [payload, setPayload] = useState<any>({
    password: '',
    clue: '',
  });

  global.logout = async () => {
    userService.logoutUserAccount({deviceId: await getUniqueId()});
    global.changeState(screens.login);
    dispatch(vehicleClearAction());
    dispatch(expenseClearAction());
    removeLocalData.removeCacheForLogout();
  };

  global.deleteAccount = () => {
    setConfModal(true);
  };

  useEffect(() => {
    async function check() {
      const theme = await getLocalData.getUserTheme();
      const language = await getLocalData.getUserLanguage();
      dispatch(updateTheme(theme || scheme || ''));
      dispatch(updateLanguage(language || 'en'));
      i18n.changeLanguage(language || 'en');
    }
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (val: string, name: string) => {
    setPayload((prev: any) => ({...prev, [name]: val}));
  };

  const handleSubmit = async () => {
    try {
      var result: any = await userService.deleteUserAccount(payload);
      console.log('result', result);
      var {status, message} = result;
      if (status) {
        setShowDeleteModal(false);
        setConfModal(false);
        global.logout();
      } else {
        Alert.alert(trans('Error', trans('Something went wrong! ')));
      }
    } catch (error) {}
  };
  return (
    <AppContext.Provider value={{}}>
      <View style={globalStyles.flex1}>{children}</View>
      {confModal && (
        <ConfirmationModal
          title={'Confirmation'}
          para={'Are you sure you want to delete your account?'}
          button1Text={'Yes'}
          button2Text={'No'}
          onButton1Press={() => {
            setConfModal(false);
            setShowDeleteModal(true);
          }}
          onButton2Press={() => setConfModal(false)}
          onDismiss={() => setConfModal(false)}
        />
      )}
      <Modal visible={showDeleteModal}>
        <View
          style={{
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => setShowDeleteModal(false)}
            style={styles.backGrounCont}></Pressable>
          <View style={styles.container}>
            <Text
              style={{
                ...typographies(colors).montserratMedium17,
                marginBottom: 15,
              }}>
              {trans('Enter Credentials')}
            </Text>
            <Text
              style={{
                ...typographies(colors).montserratMedium13,
                alignSelf: 'flex-start',
                marginLeft: 5,
              }}>
              {trans('Clue')}
            </Text>
            <TextInput
              style={styles.txtinp}
              onChangeText={txt => handleChange(txt, 'clue')}
            />
            <Text
              style={{
                ...typographies(colors).montserratMedium13,
                alignSelf: 'flex-start',
                marginLeft: 5,
                marginTop: 10,
              }}>
              {trans('Pin')}
            </Text>
            <TextInput
              style={styles.txtinp}
              onChangeText={txt => handleChange(txt, 'password')}
            />
            <View style={styles.flex_row}>
              <TouchableOpacity onPress={handleSubmit} style={styles.button1}>
                <Text style={[styles.button, {color: colors.white}]}>
                  {trans('Confirm')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  setConfModal(false);
                }}
                style={styles.button2}>
                <Text style={styles.button}>{trans('Cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppContext.Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    // Define your container styles here
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
  txtinp: {
    width: '95%',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    ...typographies(colors).montserratMedium13,
    marginTop: 5,
  },
  backGrounCont: {
    width: width,
    height: height,
    backgroundColor: 'rgba(52,52,52,0.4)',
    position: 'absolute',
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
    color: colors.primary,
  } as TextStyle,
  button: {
    // Define your button styles here
    // fontSize: 16,
    ...typographies(colors).ralewayBold15,
    color: colors.black,
    marginVertical: 5,
  } as TextStyle,
  flex_row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 15,
  },
  button1: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
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
});
const useAppProvider = () => {
  return useContext(AppContext);
};

export {AppProvider, useAppProvider};
