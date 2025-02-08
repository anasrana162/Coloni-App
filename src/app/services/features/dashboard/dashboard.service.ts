import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { dashboardEndPoint } from "../endpoint.api";
import { rootApi } from "../rootApi";

class dashboardService{
    async list(){
        return await rootApi('GET', dashboardEndPoint.list)
    }

}

export default new dashboardService();