import {customGetUniqueId} from './deviceInfo.package';

const getUniqueIdHelper = async () => {
  const id = await customGetUniqueId();
  return id;
};

export {getUniqueIdHelper};
