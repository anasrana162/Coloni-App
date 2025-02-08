import {useRef} from 'react';
import {screens} from '../../../routes/routeName.route';
import {customUseSafeAreaInsets} from '../../../packages/safeAreaContext.package';
import useDelay from '../../../utilities/hooks/useDelay.hook';
import {config} from '../../../../Config';
import {getLocalData} from '../../../packages/asyncStorage/storageHandle';
import {customUseDispatch} from '../../../packages/redux.package';
import userService from '../../../services/features/users/user.service';
import {apiResponse} from '../../../services/features/api.interface';
import {storeUserData} from '../../../state/features/auth/authSlice';

const useSplash = () => {
  const screenName = useRef(screens.onboarding);
  const {bottom} = customUseSafeAreaInsets();
  const dispatch = customUseDispatch();
  useDelay(() => {
    config.activityHeight = bottom;
    initApp();
  });
  const initApp = async () => {
    await handleLocalData();
  };
  const handleLocalData = async () => {
    const onboardingFlag = await getLocalData.onboardingFlag();
    if (onboardingFlag) {
      const loggedInFlag = await getLocalData.isLoggedIn();
      if (loggedInFlag) {
        const token = await getLocalData.getApiToken();
        config.token = token || '';
        const result = await userService.profile();
        const {body, status} = result as apiResponse;
        if (status) {
          config.role = body?.role;
          dispatch(storeUserData(body));

            screenName.current = screens.home;
            // screenName.current = screens.ColoniesSuperAdmin;
          // }
          handleAppReadyState();
          return;
        } else {
          screenName.current = screens.login;
          handleAppReadyState();
          return;
        }
      }
      screenName.current = screens.login;
      handleAppReadyState();
      return;
    } else {
      screenName.current = screens.onboarding;
      handleAppReadyState();
      return;
    }
  };
  const handleAppReadyState = () => {
    handleScreenChange();
  };
  const handleScreenChange = () => {
    global.changeState(screenName.current);
  };
  return {};
};

export default useSplash;
