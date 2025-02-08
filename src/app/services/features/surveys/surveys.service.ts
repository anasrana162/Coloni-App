import { formatDate } from '../../../utilities/helper';
import {surveysEndPoint} from '../endpoint.api';
import {rootApi} from '../rootApi';

class surveysService {
  async create(payload: any) {
    return rootApi('POST', surveysEndPoint.create, payload);
  }
  // async list(payload: any) {
  //   const {status = 'assets', page = 1, perPage = 10} = payload || {};
  //   const query = `?status=${status ||'assets'}&page=${page || 2}&perPage=${
  //     perPage || 20
  //   }`;
  //   const response=await rootApi('GET', surveysEndPoint.list ,query);
  //   console.log("chcking resposne",response);
  //   return response;
  // }
  async list(payload: any) {
    
    const {status = '',period='', page = 1, perPage = 10} = payload || {};
    const formattedPeriod = period ? formatDate(period, 'yyyy') : '';
    const query = `?status=${status ||'assets'}&period=${formattedPeriod||new Date()}&page=${page || 1}&perPage=${
      perPage || 20
    }`;
    return rootApi('GET', surveysEndPoint.list + query);
  }


  async Surveylist() {
    // const {status = '', page = 1, perPage = 10} = payload || {};
    // const query = `?status=${status || 'assets'}&page=${page || 1}&perPage=${
    //   perPage || 10
    // }`;
    const response=await rootApi('GET', surveysEndPoint.SurveyResidentList );
    console.log("chcking resposne resident surveys",response);
    return response;
  }
  async update(payload: any, id: string) {
    return rootApi('PUT', surveysEndPoint.update + id, payload);
  }
  async details(id: string) {
    return rootApi('GET', surveysEndPoint.details + id);
  }
  async detailByID(id: string) {
    return rootApi('GET', surveysEndPoint.detailsbyId + id);
  }
  async delete(id: string) {
    return rootApi('DELETE', surveysEndPoint.delete + id);
  }
  async deactivate(id: string) {
    return rootApi('POST', surveysEndPoint.deactivate + id + '/inactive');
  }
  async activate(id: string) {
    return rootApi('POST', surveysEndPoint.activate + id + '/active');
  }
  async addVote(payload: any, id: string) {
    return rootApi('POST', surveysEndPoint.vote + id + '/votes', payload);
  }
  async deleteVote(id: string) {
    return rootApi('DELETE', surveysEndPoint.vote + id + '/votes');
  }
  async updateComment(payload: any, id: string, commentId: string) {
    return rootApi(
      'DELETE',
      surveysEndPoint.delete + id + '/votes/comments/' + commentId,
      payload,
    );
  }
  async deleteComment(id: string, commentId: string) {
    return rootApi(
      'DELETE',
      surveysEndPoint.delete + id + '/votes/comments/' + commentId,
    );
  }
}
export default new surveysService();
