import {
    GarbageArrivedEndPoint,
  } from '../endpoint.api';
  import {rootApi} from '../rootApi';
  
  class GarbageArrivedServices {
    async create(payload: any) {
      return rootApi('POST', GarbageArrivedEndPoint.create, payload);
    }

 
  }
  export default new GarbageArrivedServices();
  