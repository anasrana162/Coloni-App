import { myPrivateEndPoints } from "../endpoint.api";
import { rootApi } from "../rootApi";

class myPrivateService {
    async create(payload: any) {
        return rootApi('POST', myPrivateEndPoints.create, payload);
    }
    async list() {
        return rootApi('GET', myPrivateEndPoints.list)
    }
    async update(payload: any, id: string) {
        return rootApi('PUT', myPrivateEndPoints.update + id, payload);
    }
}

export default new myPrivateService();