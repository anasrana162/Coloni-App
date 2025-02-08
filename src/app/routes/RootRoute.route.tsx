import React, {useState} from 'react';
import {customCreateStackNavigator} from '../packages/navigation.package';
import {screens} from './routeName.route';
import Onboarding from '../modules/onboarding/Onboarding.m';
import Step1 from '../modules/onboarding/Step1.onboarding.m';
import Step2 from '../modules/onboarding/Step2.onboarding.m';
import Login from '../modules/auth/Login.auth.m';
import ForgetPassword from '../modules/auth/ForgetPassword.auth';
import VerifyPassword from '../modules/auth/VerifyPassword.auth';
import Home from '../modules/splash/Home.splash.m';
import CallPreview from '../modules/dashboard/CallPreview.dashboard';
import MyPrivate from '../modules/my-private/MyPrivate.m';
import Residents from '../modules/residents/Residents.m';
import GenerateMassiveCharge from '../modules/generate-massive-charge/GenerateMassiveCharge.m';
import MonthCharge from '../modules/month-charge/MonthCharge.m';
import OtherIncome from '../modules/other-income/OtherIncome.m';
import ProcessBalance from '../modules/process-balance/ProcessBalance.m';
import PaymentFile from '../modules/payment-file/PaymentFile.m';
import AccountStatus from '../modules/account-status/AccountStatus.m';
import DebtorsReport from '../modules/debtors-report/DebtorsReport.m';
import Documents from '../modules/documents/Documents.m';
import Surveys from '../modules/surveys/Surveys.m';
import ReportedIncidents from '../modules/reported-incidents/ReportedIncidents.m';
import Amenities from '../modules/amenities/Amenities.m';
import Bookings from '../modules/bookings/Bookings.m';
import Assistance from '../modules/assistance/Assistance.m';
import VisitLog from '../modules/visit-log/VisitLog.m';
import VisitsByLogin from '../modules/visits-by-login/VisitsByLogin.m';
import Maintenance from '../modules/maintenance/Maintenance.m';
import SaftyReports from '../modules/safty-reports/SaftyReports.m';
import BlackList from '../modules/black-list/BlackList.m';
import Vehicles from '../modules/vehicles/Vehicles.m';
import ConsultPlates from '../modules/consult-plates/ConsultPlates.m';
import DownloadReports from '../modules/download-reports/DownloadReports.m';
import OptionalConfiguration from '../modules/optional-configuration/OptionalConfiguration.m';
import MyBills from '../modules/my-bills/MyBills.m';
import ActiveDevices from '../modules/active-devices/ActiveDevices.m';
import ChangePin from '../modules/change-pin/ChangePin.m';
import ExpenseTemplate from '../modules/expense-template/ExpenseTemplate.m';
import FrequentVisits from '../modules/frequent-visits/FrequentVisits.m';
import Services from '../modules/services/Services.m';
import Announcements from '../modules/announcements/Announcements.m';
import Pets from '../modules/pets/Pets.m';
import Raffles from '../modules/raffles/Raffles.m';
import AddUpdateResident from '../modules/residents/AddUpdate.resident.m';
import ResidentDocuments from '../modules/residents/Documents.resident.m';
import ResidentAddUpdateDocument from '../modules/residents/AddUpdateDocument.resident.m';
import ResidentCharges from '../modules/residents/Charges.resident.m';
import AddUpdateMassiveCharge from '../modules/generate-massive-charge/AddUpdate.massiveCharge.m';
import AddUpdateMonthCharge from '../modules/month-charge/AddUpdate.monthCharge.m';
import AddUpdateOtherIncome from '../modules/other-income/AddUpdate.otherIncome.m';
import DetailsAccountStatus from '../modules/account-status/Details.accountStatus.m';
import AddUpdateAccountStatus from '../modules/account-status/AddUpdate.accountStatus.m';
import DetailsDebtorsReport from '../modules/debtors-report/Details.debtorsReport.m';
import AddUpdateDebtorsReport from '../modules/debtors-report/AddUpdate.debtorsReport.m';
import AddAnnouncement from '../modules/announcements/Add.announcement.m';
import AddUpdateDocuments from '../modules/documents/AddUpdate.documents.m';
import AddUpdateReportIncident from '../modules/reported-incidents/AddUpdate.reportIncident.m';
import AddUpdateSurveys from '../modules/surveys/AddUpdate.surveys.m';
import DetailsSurveys from '../modules/surveys/Details.surveys.m';
import AddUpdateAmenities from '../modules/amenities/AddUpdate.amenities.m';
import AddUpdateExpenseTemplate from '../modules/expense-template/AddUpdate.expenseTemplate.m';
import AddUpdateMaintenance from '../modules/maintenance/Add.maintenance.m';
import AddUpdateVehicles from '../modules/vehicles/AddUpdate.vehicles.m';
import AddUpdateBlackList from '../modules/black-list/AddUpdate.blackList.m';
import AddUpdateRaffles from '../modules/raffles/AddUpdate.raffles.m';
import PendingChargesReports from '../modules/download-reports/PendingCharges.reports.m';
import IncomeReports from '../modules/download-reports/Income.reports.m';
import AnnualExpensesReports from '../modules/download-reports/AnnualExpenses.reports.m';
import MonthlyExpensesReports from '../modules/download-reports/MonthlyExpenses.reports.m';
import AnnualIncomeReports from '../modules/download-reports/AnnualIncome.reports.m';
import AdvancesSFReports from '../modules/download-reports/AdvancesSF.reports.m';
import CanceledChargesReports from '../modules/download-reports/CanceledCharges.reports.m';
import ResidentsReports from '../modules/download-reports/Residents.reports.m';
import RecordVisitsReports from '../modules/download-reports/RecordVisits.reports.m';
import FrequentVisitsReports from '../modules/download-reports/FrequentVisits.reports.m';
import RondinesReports from '../modules/download-reports/Rondines.reports.m';
import AssistsReports from '../modules/download-reports/Assists.reports.m';
import IncidentsReports from '../modules/download-reports/Incidents.reports.m';
import QuotaConfigurationOptional from '../modules/optional-configuration/QuotaConfiguration.optional.m';
import ClassificationExpensesOptional from '../modules/optional-configuration/ClassificationExpenses.optional.m';
import IncomeClassificationOptional from '../modules/optional-configuration/IncomeClassification.optional.m';
import AcceptCardOptional from '../modules/optional-configuration/AcceptCard.optional.m';
import AccessControllersOptional from '../modules/optional-configuration/AccessControllers.optional.m';
import AccessCardOptional from '../modules/optional-configuration/AccessCard.optional.m';
import SirenOptional from '../modules/optional-configuration/Siren.optional.m';
import QrReadersOptional from '../modules/optional-configuration/QrReaders.optional.m';
import SmartDoorsOptional from '../modules/optional-configuration/SmartDoors.optional.m';
import VirtualInterComOptional from '../modules/optional-configuration/VirtualInterCom.optional.m';
import SurveillanceCamerasOptional from '../modules/optional-configuration/SurveillanceCameras.optional.m';
import SaftyButtonOptional from '../modules/optional-configuration/SaftyButton.optional.m';
import SocialChannelsOptional from '../modules/optional-configuration/SocialChannels.optional.m';
import UpdateByExcelOptional from '../modules/optional-configuration/UpdateByExcel.optional.m';
import AddAccessControllersOptional from '../modules/optional-configuration/AddAccessControllers.optional.m';
import AddUpdateByExcelOptional from '../modules/optional-configuration/AddUpdateByExcel.optional.m';
import AddSurveillanceCameraOptional from '../modules/optional-configuration/AddSurveillanceCamera.optional.m';
import AddSocialChannelOptional from '../modules/optional-configuration/AddSocialChannel.optional.m';
import AddVirtualInterphoneOptional from '../modules/optional-configuration/AddVirtualInterphone.optional.m';
import AddSmartDoorOptional from '../modules/optional-configuration/AddSmartDoor.optional.m';
import AddQRReadersOptional from '../modules/optional-configuration/AddQRReaders.optional.m';
import AddAccessCardOptional from '../modules/optional-configuration/AddAccessCard.optional.m';
import Splash from '../modules/splash/Splash.splash.m';
import Language from '../modules/onboarding/Language.m';
import DevicesResident from '../modules/residents/Devices.resident.m';
import EmergencyNumber from '../modules/dashboard/EmergencyNumber.dashboard.m';
import Contacts from '../modules/dashboard/Contacts.dashboard';
import Chat from '../modules/dashboard/Chat.dashboard';
import ApprovePayment from '../modules/bills/ApprovePayment.bill.m';
import BlockingOfDefaulters from '../modules/outstanding-balance/BlockingOfDefaulters.ob';
import RejectPayment from '../modules/bills/RejectPayment.bill.m';
import RegistrationExpense from '../modules/bills/RegistrationExpense.bill.m';
import AddPets from '../modules/pets/AddPets.m';
import AddUpdateEmergencyNumber from '../modules/dashboard/AddUpdateEmergencyNumber.dashboard';
import AddVisits from '../modules/visits-by-login/AddVisits.m';
import CustomMap from '../components/app/CustomMap.app';
import AddServices from '../modules/services/AddServices.m';
import ReportActivity from '../modules/report-activity/ReportActivity.m';
import AddReportActivity from '../modules/report-activity/Add.ReportActivity.m';
import AddFrequentVisits from '../modules/frequent-visits/Add.FrequentVisits.m';
import ChargesMonthCharge from '../modules/month-charge/components/Charges.monthCharge';
import AddUpdateColoniessuperAdmin from '../modules/Super-adminScreens/AddUpdateColonies.superAdmin';
import DetailsReportedIncident from '../modules/reported-incidents/DetailsReportedIncidents';
import ReservationDate from '../modules/bookings/ReservationDate.m';
import Rondines from '../modules/assistance/Rondines.m';
import AmenityReservation from '../modules/bookings/AmenityReservation.m';
import paymentFileTwo from '../modules/payment-file/PaymentFileTwo.m';
import RondinesMap from '../modules/assistance/RondiesMap.m';
import ResidentVisitByLogin from '../modules/visits-by-login/ResidentVisitByLogin';
import FrequentVisitList from '../modules/frequent-visits/FrequentVisitList.m';
import VisitLogDetails from '../modules/visit-log/VisitLogDetails';
import SurveyResidentScreen from '../modules/surveys/SurveyResidentScreen.m';
import EditScreenColony from '../modules/Super-adminScreens/EditScreenColony';
import ApprovePaymentResident from '../modules/residents/ApprovePayments.residents.m';
import RejectPaymentResident from '../modules/residents/RejectPayment.resident.m';

import ApprovePaymentIncome from '../modules/income/ApprovePayment.income';
import RejectPaymentIncome from '../modules/income/RejectPayment.income';

import UpdateAddIncome from '../modules/income/UpdateAdd.income.m';
import AddUpdateByExcel2Optional from '../modules/optional-configuration/AddUpdateByExcel2.optional';

import AddUpdateResidentCharge from '../modules/residents/AddUpdate.Charges.resident.m';
import AddOutstandingCharges from '../modules/outstanding-balance/Add.outstanding.m';
import SurchargeMassiveCharge from '../modules/generate-massive-charge/Surcharge.massiveCharge.m';
import AffectedMassiveCharge from '../modules/generate-massive-charge/Affected.massiveCharges.m';
import AddSurchargeMassiveCharges from '../modules/generate-massive-charge/Add.Surcharge.massiveCharges.m';
import ResidentIncident from '../modules/reported-incidents/Resident.Incident.m';
import OutstandingBalanceCharges from '../modules/outstanding-balance/outstandingBalance.charges.m';

import UpdateMaintenance from '../modules/maintenance/CalenderUpdate.maintenance.m';
import NotificationDashboard from '../modules/dashboard/Notification.dashboard';
import SafetyAlert from '../modules/safety-alert/safetyAlert.m';
import ResidentVig from '../modules/VigilantFlow/Resident.vig';
import AddUpdateEventsVig from '../modules/VigilantFlow/AddEvents.vig';
import AssistsVig from '../modules/VigilantFlow/Assists/Assists.vig';
import AddUpdateAssistVig from '../modules/VigilantFlow/Assists/AddUpdateAssists';
import VisitHomeScreenVig from '../modules/VigilantFlow/HomeScreenVig/VisitHomeScreen.vig';
import AccessAlertVig from '../modules/VigilantFlow/ReportedActivity/AccessAlertVig';
import AddVisitHomeScreenVig from '../modules/VigilantFlow/HomeScreenVig/AddVisitHomeScreenVig';
import CameraSetting from '../modules/VigilantFlow/CameraSettings/CameraSettings';

import ViewDocuments from '../modules/documents/View.document';
import MyCard from '../modules/my-card/MyCard.m';
import DismissVisitFireVig from '../modules/VigilantFlow/DismissFire';
import PrivateDocuments from '../modules/documents/PrivateDocuments.m';
import VistsUsers from '../modules/visits-user/Visits.user.m';
declare global {
  var changeState: (name: string) => void;
}

const RouterIndex = () => {
  const Stack = customCreateStackNavigator();
  const [state, setState] = useState<string>(screens.splash);
  global.changeState = (name: string) => {
    setState(name);
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: 'pop',
      }}
      initialRouteName={screens.splash}>
      {state === screens.splash ? (
        <Stack.Screen name={screens.splash} component={Splash} />
      ) : state === screens.onboarding ? (
        <Stack.Group>
          <Stack.Screen name={screens.language} component={Language} />
          <Stack.Screen name={screens.onboarding} component={Onboarding} />
          <Stack.Screen name={screens.step1} component={Step1} />
          <Stack.Screen name={screens.step2} component={Step2} />
        </Stack.Group>
      ) : state === screens.login ? (
        <Stack.Group>
          <Stack.Screen name={screens.login} component={Login} />
          <Stack.Screen ///
            name={screens.forgetPassword}
            component={ForgetPassword} //   Forget Password
          />
          <Stack.Screen
            name={screens.verifyPassword}
            component={VerifyPassword}
          />
        </Stack.Group>
      ) : state === screens.home ? (
        <Stack.Group>
          <Stack.Screen name={screens.home} component={Home} />
          <Stack.Screen
            name={screens.emergencyNumber}
            component={EmergencyNumber}
          />
          <Stack.Screen
            name={screens.EditScreenColony}
            component={EditScreenColony}
          />
          <Stack.Screen
            name={screens.ResidentIncident}
            component={ResidentIncident}
          />
          <Stack.Screen
            name={screens.AddUpdateColoniesSuperAdmin}
            component={AddUpdateColoniessuperAdmin}
          />
          <Stack.Screen name={screens.contacts} component={Contacts} />
          <Stack.Screen name={screens.chat} component={Chat} />
          <Stack.Screen name={screens.callPreview} component={CallPreview} />
          <Stack.Screen name={screens.myPrivate} component={MyPrivate} />
          <Stack.Screen name={screens.myCard} component={MyCard} />
          <Stack.Screen name={screens.RondiesMap} component={RondinesMap} />
          <Stack.Screen
            name={screens.FrequentVisitList}
            component={FrequentVisitList}
          />
          <Stack.Screen
            name={screens.processBalances}
            component={ProcessBalance}
          />
          <Stack.Screen
            name={screens.ResidentVisitByLogin}
            component={ResidentVisitByLogin}
          />
          <Stack.Screen
            name={screens.paymentFileTwo}
            component={paymentFileTwo}
          />
          <Stack.Screen name={screens.paymentFile} component={PaymentFile} />
          <Stack.Screen name={screens.bookings} component={Bookings} />
          <Stack.Screen name={screens.assistance} component={Assistance} />
          <Stack.Screen name={screens.visitLog} component={VisitLog} />
          <Stack.Screen
            name={screens.NotificationDashboard}
            component={NotificationDashboard}
          />
          <Stack.Screen
            name={screens.VisitLogDetails}
            component={VisitLogDetails}
          />
          <Stack.Screen name={screens.visitByLogin} component={VisitsByLogin} />
          <Stack.Screen name={screens.vistsUser} component={VistsUsers} />
          <Stack.Screen
            name={screens.frequentVisits}
            component={FrequentVisits}
          />
          <Stack.Screen name={screens.services} component={Services} />
          <Stack.Screen name={screens.saftyReports} component={SaftyReports} />
          <Stack.Screen name={screens.safetyAlert} component={SafetyAlert} />
          <Stack.Screen name={screens.pets} component={Pets} />
          <Stack.Screen name={screens.addPets} component={AddPets} />
          <Stack.Screen
            name={screens.consultPlates}
            component={ConsultPlates}
          />
          <Stack.Screen name={screens.myBills} component={MyBills} />
          <Stack.Screen
            name={screens.AddUpdateByExcel}
            component={AddUpdateByExcel2Optional}
          />
          <Stack.Screen
            name={screens.activeDevices}
            component={ActiveDevices}
          />
          <Stack.Screen name={screens.changePin} component={ChangePin} />
          <Stack.Screen name={screens.residents} component={Residents} />
          <Stack.Screen
            name={screens.addUpdateResident}
            component={AddUpdateResident}
          />
          <Stack.Screen
            name={screens.residentDevices}
            component={DevicesResident}
          />
          <Stack.Screen
            name={screens.chargesResident}
            component={ResidentCharges}
          />
          <Stack.Screen
            name={screens.addUpdateResidentCharge}
            component={AddUpdateResidentCharge}
          />
          <Stack.Screen
            name={screens.documentsResident}
            component={ResidentDocuments}
          />
          <Stack.Screen
            name={screens.addUpdateDocumentsResident}
            component={ResidentAddUpdateDocument}
          />
          <Stack.Screen
            name={screens.approvePayment}
            component={ApprovePayment}
          />
          <Stack.Screen
            name={screens.approvePaymentResident}
            component={ApprovePaymentResident}
          />
          <Stack.Screen
            name={screens.approvePaymentIncome}
            component={ApprovePaymentIncome}
          />
          <Stack.Screen
            name={screens.blockingOfDefaulters}
            component={BlockingOfDefaulters}
          />
          <Stack.Screen
            name={screens.outstandingBalanceCharges}
            component={OutstandingBalanceCharges}
          />
          <Stack.Screen
            name={screens.addOutstandingCharges}
            component={AddOutstandingCharges}
          />
          <Stack.Screen
            name={screens.rejectPayment}
            component={RejectPayment}
          />
          <Stack.Screen
            name={screens.rejectPaymentResident}
            component={RejectPaymentResident}
          />
          <Stack.Screen
            name={screens.rejectPaymentIncome}
            component={RejectPaymentIncome}
          />
          <Stack.Screen
            name={screens.registrationExpense}
            component={RegistrationExpense}
          />
          <Stack.Screen
            name={screens.generateMassiveCharge}
            component={GenerateMassiveCharge}
          />
          <Stack.Screen
            name={screens.surchargesMassiveCharges}
            component={SurchargeMassiveCharge}
          />
          <Stack.Screen
            name={screens.affectedMassiveCharges}
            component={AffectedMassiveCharge}
          />
          <Stack.Screen
            name={screens.addUpdateMassiveCharges}
            component={AddUpdateMassiveCharge}
          />
          <Stack.Screen name={screens.monthCharge} component={MonthCharge} />
          <Stack.Screen
            name={screens.addUpdateMonthCharge}
            component={AddUpdateMonthCharge}
          />
          <Stack.Screen
            name={screens.addSurchargeMassiveCharges}
            component={AddSurchargeMassiveCharges}
          />
          <Stack.Screen
            name={screens.ChargesMonthCharge}
            component={ChargesMonthCharge}
          />
          <Stack.Screen name={screens.otherIncome} component={OtherIncome} />
          <Stack.Screen
            name={screens.addUpdateOtherIncome}
            component={AddUpdateOtherIncome}
          />
          <Stack.Screen
            name={screens.accountStatus}
            component={AccountStatus}
          />
          <Stack.Screen
            name={screens.detailsAccountStatus}
            component={DetailsAccountStatus}
          />
          <Stack.Screen
            name={screens.addUpdateAccountStatus}
            component={AddUpdateAccountStatus}
          />
          <Stack.Screen
            name={screens.debtorsReport}
            component={DebtorsReport}
          />
          <Stack.Screen
            name={screens.detailsDebtorsReport}
            component={DetailsDebtorsReport}
          />
          <Stack.Screen
            name={screens.addUpdateDebtorsReport}
            component={AddUpdateDebtorsReport}
          />
          <Stack.Screen
            name={screens.announcements}
            component={Announcements}
          />
          <Stack.Screen
            name={screens.addAnnouncement}
            component={AddAnnouncement}
          />
          <Stack.Screen name={screens.documents} component={Documents} />
          <Stack.Screen
            name={screens.privateDocuments}
            component={PrivateDocuments}
          />
          <Stack.Screen name={screens.viewDocument} component={ViewDocuments} />
          <Stack.Screen
            name={screens.addDocuments}
            component={AddUpdateDocuments}
          />
          <Stack.Screen
            name={screens.reportedIncidents}
            component={ReportedIncidents}
          />
          <Stack.Screen
            name={screens.addUpdateReportIncident}
            component={AddUpdateReportIncident}
          />
          <Stack.Screen
            name={screens.DetailsReportedIncidents}
            component={DetailsReportedIncident}
          />
          <Stack.Screen name={screens.surveys} component={Surveys} />
          <Stack.Screen
            name={screens.detailsSurveys}
            component={DetailsSurveys}
          />
          <Stack.Screen
            name={screens.SurveyResident}
            component={SurveyResidentScreen}
          />
          <Stack.Screen
            name={screens.addUpdateSurveys}
            component={AddUpdateSurveys}
          />
          <Stack.Screen name={screens.amenities} component={Amenities} />
          <Stack.Screen
            name={screens.addUpdateAmenities}
            component={AddUpdateAmenities}
          />
          <Stack.Screen
            name={screens.expenseTemplate}
            component={ExpenseTemplate}
          />
          <Stack.Screen
            name={screens.addUpdateExpenseTemplate}
            component={AddUpdateExpenseTemplate}
          />
          <Stack.Screen name={screens.maintenance} component={Maintenance} />
          <Stack.Screen
            name={screens.addUpdateMaintenance}
            component={AddUpdateMaintenance}
          />
          <Stack.Screen
            name={screens.UpdateMaintenance}
            component={UpdateMaintenance}
          />
          <Stack.Screen name={screens.vehicles} component={Vehicles} />
          <Stack.Screen
            name={screens.addUpdateVehicles}
            component={AddUpdateVehicles}
          />
          <Stack.Screen name={screens.blackList} component={BlackList} />
          <Stack.Screen
            name={screens.addUpdateBlackList}
            component={AddUpdateBlackList}
          />
          <Stack.Screen name={screens.raffles} component={Raffles} />
          <Stack.Screen
            name={screens.addUpdateRaffles}
            component={AddUpdateRaffles}
          />
          <Stack.Screen
            name={screens.downloadReports}
            component={DownloadReports}
          />
          <Stack.Screen
            name={screens.pendingChargesReports}
            component={PendingChargesReports}
          />
          <Stack.Screen
            name={screens.incomeReports}
            component={IncomeReports}
          />
          <Stack.Screen
            name={screens.annualIncomeReports}
            component={AnnualIncomeReports}
          />
          <Stack.Screen
            name={screens.monthlyExpensesReports}
            component={MonthlyExpensesReports}
          />
          <Stack.Screen
            name={screens.annualExpenseReports}
            component={AnnualExpensesReports}
          />
          <Stack.Screen
            name={screens.advancesSFReports}
            component={AdvancesSFReports}
          />
          <Stack.Screen
            name={screens.canceledChargesReports}
            component={CanceledChargesReports}
          />
          <Stack.Screen
            name={screens.residentReports}
            component={ResidentsReports}
          />
          <Stack.Screen
            name={screens.recordOfVisitsReports}
            component={RecordVisitsReports}
          />
          <Stack.Screen
            name={screens.frequentVisitsReports}
            component={FrequentVisitsReports}
          />
          <Stack.Screen
            name={screens.rondinesReports}
            component={RondinesReports}
          />
          <Stack.Screen
            name={screens.assistsReports}
            component={AssistsReports}
          />
          <Stack.Screen
            name={screens.incidentsReports}
            component={IncidentsReports}
          />
          <Stack.Screen
            name={screens.optionalConfiguration}
            component={OptionalConfiguration}
          />
          <Stack.Screen
            name={screens.quotaConfigurationOptional}
            component={QuotaConfigurationOptional}
          />
          <Stack.Screen
            name={screens.classificationExpensesOptional}
            component={ClassificationExpensesOptional}
          />
          <Stack.Screen
            name={screens.incomeClassificationOptional}
            component={IncomeClassificationOptional}
          />
          <Stack.Screen
            name={screens.addUpdateIncome}
            component={UpdateAddIncome}
          />
          <Stack.Screen
            name={screens.acceptCardOptional}
            component={AcceptCardOptional}
          />
          <Stack.Screen
            name={screens.accessControllersOptional}
            component={AccessControllersOptional}
          />
          <Stack.Screen
            name={screens.accessCardsOptional}
            component={AccessCardOptional}
          />
          <Stack.Screen
            name={screens.sirenOptional}
            component={SirenOptional}
          />
          <Stack.Screen
            name={screens.addAccessControllerOptional}
            component={AddAccessControllersOptional}
          />
          <Stack.Screen
            name={screens.qrReadersOptional}
            component={QrReadersOptional}
          />
          <Stack.Screen
            name={screens.smartDoorsOptional}
            component={SmartDoorsOptional}
          />
          <Stack.Screen
            name={screens.virtualIntercomOptional}
            component={VirtualInterComOptional}
          />
          <Stack.Screen
            name={screens.surveillanceCameras}
            component={SurveillanceCamerasOptional}
          />
          <Stack.Screen
            name={screens.saftyButtonCameras}
            component={SaftyButtonOptional}
          />
          <Stack.Screen
            name={screens.socialChannelsButton}
            component={SocialChannelsOptional}
          />
          <Stack.Screen
            name={screens.updateByExcelOptional}
            component={UpdateByExcelOptional}
          />
          <Stack.Screen
            name={screens.addUpdateByExcel}
            component={AddUpdateByExcelOptional}
          />
          <Stack.Screen
            name={screens.addSurveillanceCameraOptional}
            component={AddSurveillanceCameraOptional}
          />
          <Stack.Screen
            name={screens.addSocialChannelOptional}
            component={AddSocialChannelOptional}
          />
          <Stack.Screen
            name={screens.addVirtualInterphoneOptional}
            component={AddVirtualInterphoneOptional}
          />
          <Stack.Screen
            name={screens.addSmartDoorOptional}
            component={AddSmartDoorOptional}
          />
          <Stack.Screen
            name={screens.addQRReadersOptional}
            component={AddQRReadersOptional}
          />
          <Stack.Screen
            name={screens.addAccessCardOptional}
            component={AddAccessCardOptional}
          />
          <Stack.Screen
            name={screens.addUpdateEmergencyNumber}
            component={AddUpdateEmergencyNumber}
          />
          <Stack.Screen name={screens.addVisits} component={AddVisits} />
          <Stack.Screen name={screens.customMap} component={CustomMap} />
          <Stack.Screen name={screens.addServices} component={AddServices} />
          <Stack.Screen
            name={screens.reportActivity}
            component={ReportActivity}
          />
          <Stack.Screen
            name={screens.ReservationDate}
            component={ReservationDate}
          />
          <Stack.Screen name={screens.Rondines} component={Rondines} />
          <Stack.Screen
            name={screens.AmenityReservation}
            component={AmenityReservation}
          />
          <Stack.Screen
            name={screens.addReportActivity}
            component={AddReportActivity}
          />
          <Stack.Screen
            name={screens.addFrequentVisits}
            component={AddFrequentVisits}
          />
          <Stack.Screen
            name={screens.AddUpdateEventVig}
            component={AddUpdateEventsVig}
            // options={{ tabBarVisible: true }}
          />
          <Stack.Screen
            name={screens.DismissVisitFire}
            component={DismissVisitFireVig}
          />
          <Stack.Screen name={screens.AssistsVig} component={AssistsVig} />
          <Stack.Screen
            name={screens.AddUpdateAssistsVig}
            component={AddUpdateAssistVig}
          />
          <Stack.Screen
            name={screens.VisitsHomeScreenVig}
            component={VisitHomeScreenVig}
          />
          <Stack.Screen
            name={screens.AccessAlertVig}
            component={AccessAlertVig}
          />
          <Stack.Screen
            name={screens.AddVisitsHomeScreenVig}
            component={AddVisitHomeScreenVig}
          />
          <Stack.Screen
            name={screens.CameraSettings}
            component={CameraSetting}
          />
        </Stack.Group>
      ) : (
        <></>
      )}
    </Stack.Navigator>
  );
};
export default RouterIndex;
