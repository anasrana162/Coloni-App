import { useEffect, useRef, useState } from 'react';
import loginValidator from '../../../services/validators/login.validator';
import { showAlertWithOneAction } from '../../../utilities/helper';
import { useTranslation } from 'react-i18next';
import { customUseDispatch } from '../../../packages/redux.package';
import authService from '../../../services/features/auth/auth.service';
import { storeUserData } from '../../../state/features/auth/authSlice';
import {
  getLocalData,
  storeLocalData,
} from '../../../packages/asyncStorage/storageHandle';
import { config } from '../../../../Config';
import { screens } from '../../../routes/routeName.route';
import { Platform } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
const useLogin = () => {
  const { t: trans } = useTranslation();
  const [check, setCheck] = useState<boolean>(false);
  const inputRef = useRef<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const usernameInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);
  const dispatch = customUseDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async () => {
    var getDeviceUniqueID = await getUniqueId()
    const loginData = {
      username: inputRef.current.username,
      password: inputRef.current.password,
      deviceType: 'Android',
      fcmtoken: config.fcmtoken,
      deviceId: getDeviceUniqueID,
    };
    console.log("Login Data", loginData)
    let validate = loginValidator.isValidForLogin(loginData);
    if (!validate) {
      showAlertWithOneAction({
        title: trans('Try again !!!'),
        body: trans('Please fill up login form correctly !'),
        okButtonText: trans('Go It'),
      });
      return;
    }
    setIsLoading(true);
    try {
      const requestData = {
        ...loginData,
      };
      console.log('LoginData', loginData);
      const { status, body, message } = await authService.login(requestData);
      console.log('token .................:', body);
      setIsLoading(false);
      if (status) {
        dispatch(storeUserData(body.user));
        storeLocalData.loggedInFlag(true);
        check && storeLocalData.userCredential(loginData);
        storeLocalData.apiToken(body.token);
        config.token = body?.token;
        config.role = body?.user?.role;
        global.changeState(screens.home);
      } else {
        showAlertWithOneAction({
          title: trans('Oops !!!'),
          body: message,
        });
      }
    } catch (_) {
      setIsLoading(false);
      showAlertWithOneAction({
        title: trans('Oops !!!'),
        body: trans('Something went wrong !'),
      });
    }
  };
  const onChangeValue = (text: string, name: string) => {
    (inputRef.current as any)[name] = text;
  };
  useEffect(() => {
    const checkStore = async () => {
      const storeInfo = await getLocalData.userCredential();
      try {
        inputRef.current.username = storeInfo.username;
        inputRef.current.password = storeInfo.password;
        setCheck(inputRef.current?.username ? true : false);
        usernameInputRef.current?.setNativeProps({ text: storeInfo.username });
        passwordInputRef.current?.setNativeProps({ text: storeInfo.password });
      } catch (_) { }
    };
    checkStore();
  }, []);
  return {
    trans,
    usernameInputRef,
    passwordInputRef,
    handleLogin,
    isLoading,
    onChangeValue,
    check,
    setCheck,
  };
};

export default useLogin;
