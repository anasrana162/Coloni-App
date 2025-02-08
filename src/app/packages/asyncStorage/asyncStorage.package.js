import AsyncStorage from '@react-native-async-storage/async-storage';
import {ErrorLog} from '../../services/error/errorHandler.service';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (e) {
    ErrorLog({
      from: 'store data into local storage',
      key: key,
      value: value,
      error: e,
    });
  }
};
const storeObjectData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    storeData(key, jsonValue);
  } catch (e) {
    ErrorLog({
      from: 'store object data into local storage',
      key: key,
      value: value,
      error: e,
    });
  }
};
const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    ErrorLog({
      from: 'reading data from local storage',
      key: key,
      error: e,
    });
    return null;
  }
};
const getObjectData = async key => {
  try {
    let jsonValue = await getData(key);
    if (typeof jsonValue === 'string' && jsonValue === '[object Object]') {
      return null;
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    ErrorLog({
      from: 'reading object data from local storage',
      key: key,
      error: e,
    });
    return null;
  }
};
const removeFields = async items => {
  try {
    await AsyncStorage.multiRemove(items);
  } catch (e) {}
};

export {AsyncStorage as CustomAsyncStorage};
export {storeData, storeObjectData, getData, getObjectData, removeFields};
