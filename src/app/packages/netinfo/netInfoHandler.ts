import {CustomNetInfo} from './netinfo.package';

const netInfoEventListener = (callback: any) => {
  return CustomNetInfo.addEventListener((state: any) => callback(state));
};
const hasInternetConnection = async () => {
  let flag = false;
  const {isConnected, isInternetReachable, type} =
    (await CustomNetInfo.fetch()) as any;
  if (isConnected && isInternetReachable && type !== '' && type !== 'none') {
    flag = true;
  }
  return flag;
};
export {netInfoEventListener, hasInternetConnection};
