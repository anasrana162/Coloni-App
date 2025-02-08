import {customCombineReducers} from '../packages/redux.package';
import accountStatusSlice from './features/accountStatus/accountStatus.slice';
import amenitiesSlice from './features/amenities/amenities.slice';
import announcementsSlice from './features/announcements/announcements.slice';
import authSlice from './features/auth/authSlice';
import blacklistSlice from './features/blacklist/blacklist.slice';
import bookingSlice from './features/booking/booking.slice';
import chatsSlice from './features/chats/chats.slice';
import debtorsReportSlice from './features/debtorsReport/debtorsReport.slice';
import documentsSlice from './features/documents/documents.slice';
import emergencyNumberSlice from './features/emergencyNumber/emergencyNumber.slice';
import expenseTemplateSlice from './features/expenseTemplate/expenseTemplate.slice';
import expenseSlice from './features/expenses/expense.slice';
import frequentVisitSlice from './features/frequentVisit/frequentVisit.slice';
import incidentsSlice from './features/incidents/incidents.slice';
import languageSlice from './features/languageSlice';
import maintenanceSlice from './features/maintenance/maintenance.slice';
import monthChargesSlice from './features/monthCharges/monthCharges.slice';
import otherIncomeSlice from './features/otherIncome/otherIncome.slice';
import saftyReportSlice from './features/saftyReport/saftyReport.slice';
import paymentsSlice from './features/payments/payments.slice';
import petSlice from './features/pets/pet.slice';
import rafflesSlice from './features/raffles/raffles.slice';
import reportActivitySlice from './features/reportActivity/reportActivity.slice';
import servicesSlice from './features/services/services.slice';
import surveysSlice from './features/surveys/surveys.slice';
import themeSlice from './features/themeSlice';
import userSlice from './features/user/user.slice';
import vehicleSlice from './features/vehicles/vehicle.slice';
import visitsSlice from './features/visits/visits.slice';
import {sliceName} from './sliceName.state';
import AssistanceSlice from './features/Assistance/Assistance.slice';
import { ColonySuperAdmin } from './allSelector.state';
import SuperAdminSlice from './features/SuperAdmin/SuperAdminSlice';
import ActiveDevicesSlice from './features/ActiveDevices/ActiveDevice.slice';
import AccessControlSlice from './features/AccessControl/AccessControl.slice';
import accessCardTagSlice from './features/AccessTagCard/AccessTagCardSlice';
import QrReaderSlice from './features/QrReader/QrReaderSlice';
import SmartDoorSlice from './features/SmartDoor/smartDoorSlice';
import VirtualPhoneSlice from './features/VirtualPhone/VirtualPhoneSlice';
import SurveillanceSlice from './features/Surveillance/Surveillance.slice';
import SocialChannelSlice from './features/SocialChannel/SocialChannel.slice';
import sirenSlice from './features/Siren/Siren.slice';
import ResidentVigSlice from './features/user/ResidentVig.slice';
import AssistsSlice from './features/Assist/AssistsSlice';
import EventualVisitSlice from './features/EventualVisit/EventualVisit.slice';
import DismissSlice from './features/DismissVisit/DismissVisitSlice';

const rootReducer = customCombineReducers({
  [sliceName.themeSlice]: themeSlice,
  [sliceName.languageSlice]: languageSlice,
  [sliceName.vehicleSlice]: vehicleSlice,
  [sliceName.expenseSlice]: expenseSlice,
  [sliceName.authSlice]: authSlice,
  [sliceName.petSlice]: petSlice,
  [sliceName.emergencyNumbers]: emergencyNumberSlice,
  [sliceName.amenitiesSlice]: amenitiesSlice,
  [sliceName.incidentsSlice]: incidentsSlice,
  [sliceName.visitsSlice]: visitsSlice,
  [sliceName.announcementsSlice]: announcementsSlice,
  [sliceName.documentsSlice]: documentsSlice,
  [sliceName.paymentsSlice]: paymentsSlice,
  [sliceName.blacklistSlice]: blacklistSlice,
  [sliceName.maintenanceSlice]: maintenanceSlice,
  [sliceName.surveysSlice]: surveysSlice,
  [sliceName.servicesSlice]: servicesSlice,
  [sliceName.rafflesSlice]: rafflesSlice,
  [sliceName.monthChargesSlice]: monthChargesSlice,
  [sliceName.otherIncomeSlice]: otherIncomeSlice,
  [sliceName.saftyReportSlice]: saftyReportSlice,
  [sliceName.reportActivitySlice]: reportActivitySlice,
  [sliceName.expenseTemplateSlice]: expenseTemplateSlice,
  [sliceName.frequentVisitSlice]: frequentVisitSlice,
  [sliceName.expenseTemplateSlice]: expenseTemplateSlice,
  [sliceName.userSlice]: userSlice,
  [sliceName.chatsSlice]: chatsSlice,
  [sliceName.accountStatusSlice]: accountStatusSlice,
  [sliceName.debtorsReportSlice]: debtorsReportSlice,
  [sliceName.bookingSlice]: bookingSlice,
  [sliceName.AssistanceSlice]: AssistanceSlice,
  [sliceName.Colonyslice]: SuperAdminSlice,
  [sliceName.DeviceSlice]: ActiveDevicesSlice,
  [sliceName.AccessControlSlice]: AccessControlSlice,
  [sliceName.AccessTagCardSlice]:accessCardTagSlice,
  [sliceName.QrReaderSlice]:QrReaderSlice,
  [sliceName.SmartDoorSlice]:SmartDoorSlice,
  [sliceName.VirtualPhoneSlice]:VirtualPhoneSlice,
  [sliceName.Surveillance]:SurveillanceSlice,
  [sliceName.SocialChannel]:SocialChannelSlice,
  [sliceName.Siren]:sirenSlice,
  [sliceName.residentVig]:ResidentVigSlice,
  [sliceName.AssistSlice]:AssistsSlice,
  [sliceName.EventualVisitSlice]:EventualVisitSlice,
  [sliceName.DismissVisitSlice]:DismissSlice,
});
export default rootReducer;
