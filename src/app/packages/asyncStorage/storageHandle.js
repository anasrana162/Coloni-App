import {config} from '../../../Config';
import {
  getData as getDataHelper,
  getObjectData,
  removeFields,
  storeData,
  storeObjectData,
} from './asyncStorage.package';
import {
  IS_LOGGED_IN,
  IS_STORE_GCM_TOKEN,
  LOGIN_CREDENTIALS,
  TEAM_USERS,
  USER_LANGUAGE,
  USER_THEME,
  USER_TIMEZONE,
  USER_TOKEN,
  COMPLETE_ONBOARDING,
} from './variables';

class getLocalClass {
  apiToken(token: any) {
    throw new Error('Method not implemented.');
  }
  async isLoggedIn() {
    const flag = await getDataHelper(IS_LOGGED_IN);
    if (flag) {
      return flag === 'true' ? true : false;
    }
    return false;
  }
  async getApiToken() {
    const token = await getDataHelper(USER_TOKEN);
    return token;
  }
  async userCredential() {
    const creds = await getObjectData(LOGIN_CREDENTIALS);
    return creds;
  }
  async onboardingFlag() {
    const flag = await getDataHelper(COMPLETE_ONBOARDING);
    if (flag) {
      return flag === 'true' ? true : false;
    }
    return false;
  }
  async gcmFlag() {
    const flag = await getDataHelper(IS_STORE_GCM_TOKEN);
    if (flag) {
      return flag === 'true' ? true : false;
    }
    return false;
  }
  async getTeamUser() {
    const jsonString = await getObjectData(TEAM_USERS);
    if (jsonString) {
      const {value, expirationDate} = jsonString;
      if (new Date().getTime() < expirationDate) {
        return value;
      } else {
        return null;
      }
    }
    return null;
  }
  async getUserTheme() {
    const theme = await getDataHelper(USER_THEME);
    if (theme) {
      return theme;
    }
    return false;
  }
  async getUserLanguage() {
    const language = await getDataHelper(USER_LANGUAGE);
    if (language) {
      return language;
    }
    return 'en';
  }
  async getUserTimezone() {
    const value = await getDataHelper(USER_TIMEZONE);
    if (value) {
      return value;
    } else {
      return null;
    }
  }
}
class storeLocalClass {
  loggedInFlag(value) {
    storeData(IS_LOGGED_IN, value);
  }
  apiToken(value) {
    storeData(USER_TOKEN, value);
  }
  userLanguage(value) {
    storeData(USER_LANGUAGE, value);
  }
  userTheme(value) {
    storeData(USER_THEME, value);
  }
  onboardingFlag(value) {
    storeData(COMPLETE_ONBOARDING, value);
  }
  timezone(value) {
    storeData(USER_TIMEZONE, value);
  }
  userCredential(value) {
    storeObjectData(LOGIN_CREDENTIALS, value);
  }
  storeGcmFlag(value) {
    storeData(IS_STORE_GCM_TOKEN, value);
  }
  storeTeamUser(value) {
    const expirationDate =
      new Date().getTime() + config.localStorageDay * 24 * 60 * 60 * 1000;
    const dataToStore = {value, expirationDate};
    storeObjectData(TEAM_USERS, dataToStore);
  }
}
class removeLocalStorage {
  async removeCacheForLogout() {
    await removeFields([
      IS_LOGGED_IN,
      IS_STORE_GCM_TOKEN,
      USER_TIMEZONE,
      USER_TOKEN,
    ]);
  }
  async removeCache(field) {
    await removeFields([field]);
  }
}
const getLocalData = new getLocalClass();
const storeLocalData = new storeLocalClass();
const removeLocalData = new removeLocalStorage();

export {getLocalData, storeLocalData, removeLocalData};
