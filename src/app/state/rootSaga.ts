import { customSagaAll } from '../packages/redux.package';
import AccessControlSaga from '../services/features/AccessControllers/AccessControl.saga';
import accessTagCardSaga from '../services/features/AccessTag-card/AccessTag-card.saga';
import AssistSaga from '../services/features/Assist/Assist.saga';
import QrReaderSaga from '../services/features/QrReader/QrReader.Saga';
import SirenSaga from '../services/features/Siren/Siren.saga';
import SmartDoorSaga from '../services/features/SmartDoor/smartDoor.saga';
import socialChannelSaga from '../services/features/SocialChannel/socialChannel.saga';
import colonySupeAdminSaga from '../services/features/SuperAdminColony/colonySuperAdminSaga';
import SurveillanceSaga from '../services/features/Surveillance/Surveillance.saga';
import VirtualPhoneSaga from '../services/features/VirtualPhone/Virtualphone.Saga';
import accountStatusSaga from '../services/features/accountStatus/accountStatus.saga';
import amenitiesSaga from '../services/features/amenities/amenities.saga';
import announcementsSaga from '../services/features/announcements/announcements.saga';
import AssistanceSaga from '../services/features/assistance/assistance.saga';
import blacklistSaga from '../services/features/blacklist/blacklist.saga';
import bookingSaga from '../services/features/booking/booking.saga';
import chatsSaga from '../services/features/chats/chats.saga';
import debtorsReportSaga from '../services/features/debtorsReport/debtorsReport.saga';
import documentsSaga from '../services/features/documents/documents.saga';
import emergencyNumberSaga from '../services/features/emergencyNumber/emergencyNumber.saga';
import EventualVisitSaga from '../services/features/eventualVisits/EventualVisit.saga';
import expenseTemplateSaga from '../services/features/expenseTemplate/expenseTemplate.saga';
import expenseSaga from '../services/features/expenses/expenses.saga';
import frequentVisitSaga from '../services/features/frequentVisit/frequentVisit.saga';
import incidentsSaga from '../services/features/incidents/incidents.saga';
import maintenanceSaga from '../services/features/maintenance/maintenance.saga';
import monthChargesSaga from '../services/features/monthCharges/monthCharges.saga';
import otherIncomeSaga from '../services/features/otherIncome/otherIncome.saga';
import saftyReportSaga from '../services/features/saftyReport/saftyReport.saga';
import paymentSaga from '../services/features/payment/payment.saga';
import petSaga from '../services/features/pets/pets.saga';
import rafflesSaga from '../services/features/raffles/raffles.saga';
import reportActivitySaga from '../services/features/reportActivity/reportActivity.saga';
import servicesSaga from '../services/features/services/services.saga';
import surveysSaga from '../services/features/surveys/surveys.saga';
import residentVigSaga from '../services/features/users/ResidentVig.saga';
import userSaga from '../services/features/users/user.saga';
import vehicleSaga from '../services/features/vehicles/vehicles.saga';
import visitsSaga from '../services/features/visits/visits.saga';

export default function* rootSaga() {
  yield customSagaAll([
    vehicleSaga(),
    expenseSaga(),
    petSaga(),
    emergencyNumberSaga(),
    amenitiesSaga(),
    incidentsSaga(),
    visitsSaga(),
    paymentSaga(),
    userSaga(),
    announcementsSaga(),
    documentsSaga(),
    blacklistSaga(),
    maintenanceSaga(),
    surveysSaga(),
    servicesSaga(),
    rafflesSaga(),
    monthChargesSaga(),
    otherIncomeSaga(),
    reportActivitySaga(),
    saftyReportSaga(),
    expenseTemplateSaga(),
    frequentVisitSaga(),
    chatsSaga(),
    accountStatusSaga(),
    debtorsReportSaga(),
    bookingSaga(),
    AssistanceSaga(),
    colonySupeAdminSaga(),
    AccessControlSaga(),
    accessTagCardSaga(),
    QrReaderSaga(),
    SmartDoorSaga(),
    VirtualPhoneSaga(),
    SurveillanceSaga(),
    socialChannelSaga(),
    SirenSaga(),
    residentVigSaga(),
    AssistSaga(),
    EventualVisitSaga(),

  ]);
}
