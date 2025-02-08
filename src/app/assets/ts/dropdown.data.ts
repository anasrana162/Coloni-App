import IndexBills from '../../modules/bills/Index.bills.m';
import IndexDashboard from '../../modules/dashboard/Index.dashboard.m';
import IndexIncome from '../../modules/income/Index.income.m';
import IndexOutstandingBalance from '../../modules/outstanding-balance/Index.outstandingBalance.m';
import {screens} from '../../routes/routeName.route';
import AccountStatusIcon from '../icons/AcountStatus.icon';
import AmountIcon from '../icons/Amount.icon';
import BillsIcon from '../icons/Bills.icon';
import CashWithdrawIcon from '../icons/CashWithdraw.icon';
import ChargeMonthIcon from '../icons/ChargeMonth.icon';
import ExtraAddIcon from '../icons/ExtraAdd.icon';
import GenerateChargeIcon from '../icons/GenerateCharge.icon';
import HomeIcon from '../icons/Home.icon';
import PaymentFileIcon from '../icons/PaymentFile.icon';
import ProcessBalanceIcon from '../icons/ProcessBalance.icon';
import ResidentsIcon from '../icons/Residents.icon';
import UserProfileIcon from '../icons/UserProfile.icon';
import DebtorsReportIcon from '../../assets/images/svg/DebtorsReport.svg';
import AnnouncementsIcon from '../../assets/images/svg/announcements.svg';
import DocumentsIcon from '../../assets/images/svg/documents.svg';
import ReportedInCidentsIcon from '../../assets/images/svg/reportedIncidents.svg';
import SurveysIcon from '../../assets/images/svg/surveys.svg';
import AmenitiesIcon from '../../assets/images/svg/amenities.svg';
import BookingsIcon from '../../assets/images/svg/bokings.svg';
import AssistanceIcon from '../../assets/images/svg/assistance.svg';
import VisitLogIcon from '../../assets/images/svg/visitLog.svg';
import VisitsByLoginIcon from '../../assets/images/svg/visitByLogin.svg';
import FrequentVisitsIcon from '../../assets/images/svg/frequentVisits.svg';
import ServicesIcon from '../../assets/images/svg/sevices.svg';
import ExpenseTemplateIcon from '../../assets/images/svg/expensTemplate.svg';
import MaintenanceIcon from '../../assets/images/svg/maintenance.svg';
import EmergencyNumbersIcon from '../../assets/images/svg/emergencyNumbers.svg';
import SaftyReportsIcon from '../../assets/images/svg/saftyReports.svg';
import SosSaftyBtn from '../../assets/images/svg/sos.svg';
import VehiclesIcon from '../../assets/images/svg/vehicles.svg';
import BlackListIcon from '../../assets/images/svg/blackList.svg';
import PetsIcon from '../../assets/images/svg/pets.svg';
import RafflesIcon from '../../assets/images/svg/reffles.svg';
import ConsultPlatesIcon from '../../assets/images/svg/consultPlates.svg';
import DownloadReportsIcon from '../../assets/images/svg/downloadReports.svg';
import OptionalConfigurationIcon from '../../assets/images/svg/optionalConfiguration.svg';
import MyBillsIcon from '../../assets/images/svg/myBills.svg';
import ActiveDevicesIcon from '../../assets/images/svg/activeDevices.svg';
import DarkModeIcon from '../../assets/images/svg/darkMode.svg';
import ChangePinIcon from '../../assets/images/svg/changePin.svg';
import LanguageIcon from '../../assets/images/svg/language.svg';
import LogoutIcon from '../../assets/images/svg/Logout.svg';
import Camera from '../../assets/images/svg/CameraExtra.svg';
import ReportedActivityIcon from '../../assets/images/svg/ReportedActivity.svg';
import CustomDrawer from '../../routes/custom-drawer/CustomDrawer.core.component';
import DarkToLight from '../../components/app/DarkToLight.app';
import LanguagePicker from '../../components/app/LanguagePicker.app';
import BottomSheetSelect from '../../components/core/BottomSheetSelect.app.component';
import OtherIncomeIcon from '../icons/OtherIncome.icon';
import ColoniessuperAdmin from '../../modules/Super-adminScreens/Colonies.superAdmin';
import AddHomeIcon from '../icons/AddHomeIcon';
import MonthCharge from '../../modules/month-charge/MonthCharge.m';
import Residents from '../../modules/residents/Residents.m';
import Chat from '../../modules/dashboard/Chat.dashboard';
import Contacts from '../../modules/dashboard/Contacts.dashboard';
import ResidentVig from '../../modules/VigilantFlow/Resident.vig';
import EventsVig from '../../modules/VigilantFlow/Events.vig';
import DismissVisitsVig from '../../modules/VigilantFlow/DismissVisitsVig';
import EventIcon from '../icons/Event.Icon';
import DismissVisitIcon from '../icons/DismissVisit.Icon';
import ChatIcon from '../icons/ChatIcon';
import DeleteIcon from '../icons/Delete.icon.asset';
import ExpenseTemplate from '../../modules/frequent-visits/FrequentVisits.m';
import FrequentVisitList from '../../modules/frequent-visits/FrequentVisitList.m';
import VistsUsers from '../../modules/visits-user/Visits.user.m';

//  added show to show names in Tabbar
const tabOptions: {name: string; Component: any; Icon?: any; show?: string}[] =
  [
    {
      name: screens.dashboard,
      show: 'Home',
      Component: IndexDashboard,
      Icon: HomeIcon,
    },
    {
      name: screens.ColoniesSuperAdmin,
      show: 'Colonies',
      Component: ColoniessuperAdmin,
      Icon: HomeIcon,
      // Icon: AddHomeIcon,
    },
    {
      name: screens.bills,
      show: 'Bills',
      Component: IndexBills,
      Icon: BillsIcon,
    },
    {
      name: screens.income,
      show: 'Income',
      Component: IndexIncome,
      Icon: CashWithdrawIcon,
    },
    {
      name: screens.extraBalance,
      show: 'Outstanding',
      Component: IndexOutstandingBalance,
      Icon: AmountIcon,
    },
    {
      name: screens.drawer,
      show: 'Extras',
      Component: CustomDrawer,
      Icon: ExtraAddIcon,
    },
  ];
const tabOptionsRes: {
  name: string;
  Component: any;
  Icon?: any;
  show?: string;
}[] = [
  {
    name: screens.dashboard,
    Component: IndexDashboard,
    show: 'Home',
    Icon: HomeIcon,
  },

  {
    name: screens.monthCharge,
    Component: MonthCharge,
    show: 'Payment',
    Icon: ChargeMonthIcon,
  },
  {
    name: screens.vistsUser,
    Component: VistsUsers,
    show: 'Visits',
    Icon: FrequentVisitsIcon,
  },
  {
    name: screens.bills,
    Component: IndexBills,
    show: 'Expenses',
    Icon: BillsIcon,
  },
  {
    name: screens.drawer,
    Component: CustomDrawer,
    show: 'More',
    Icon: ExtraAddIcon,
  },
];
const tabOptionResList: {name: string; Icon?: any}[] = [
  {
    name: screens.dashboard,
    Icon: HomeIcon,
  },

  {
    name: screens.monthCharge,
    Icon: ChargeMonthIcon,
  },
  {
    name: screens.frequentVisits,
    Icon: FrequentVisitsIcon,
  },

  {
    name: screens.bills,
    Icon: BillsIcon,
  },
  {
    name: screens.drawer,
    Icon: ExtraAddIcon,
  },
];

const tabOptionsList: {name: string; Icon?: any}[] = [
  {
    name: screens.dashboard,
    Icon: HomeIcon,
  },
  // {
  //   name: screens.ColoniesSuperAdmin,
  //   Icon: AddHomeIcon,
  // },
  {
    name: screens.bills,
    Icon: BillsIcon,
  },
  {
    name: screens.income,
    Icon: CashWithdrawIcon,
  },
  {
    name: screens.extraBalance,
    Icon: AmountIcon,
  },
  {
    name: screens.drawer,
    Icon: ExtraAddIcon,
  },
];
const drawerList = [
  {
    name: screens.myPrivate,
    Icon: UserProfileIcon,
    title: 'My Private',
    function: false,
  },
  {
    name: screens.residents,
    title: 'Residents',
    Icon: ResidentsIcon,
    function: false,
  },
  {
    name: screens.generateMassiveCharge,
    title: 'Generate Massive Charges',
    Icon: GenerateChargeIcon,
    function: false,
  },
  {
    name: screens.monthCharge,
    title: 'See Charges of the Month',
    Icon: ChargeMonthIcon,
    function: false,
  },
  {
    name: screens.otherIncome,
    title: 'Other Income',
    Icon: OtherIncomeIcon,
    function: false,
  },
  {
    name: screens.processBalances,
    title: 'Process Balances in Favor',
    Icon: ProcessBalanceIcon,
    function: false,
  },
  {
    name: screens.paymentFile,
    title: 'Payment File',
    Icon: PaymentFileIcon,
    function: false,
  },
  {
    name: screens.accountStatus,
    title: 'Account Status',
    Icon: AccountStatusIcon,
    function: false,
  },
  {
    name: screens.debtorsReport,
    title: 'Debtors Report',
    Icon: DebtorsReportIcon,
    function: false,
  },
  {
    name: screens.announcements,
    title: 'Announcements',
    Icon: AnnouncementsIcon,
    function: false,
  },
  {
    name: screens.documents,
    title: 'Documents',
    Icon: DocumentsIcon,
    function: false,
  },
  {
    name: screens.reportedIncidents,
    title: 'Reported Incidents',
    Icon: ReportedInCidentsIcon,
    function: false,
  },
  {
    name: screens.surveys,
    title: 'Surveys',
    Icon: SurveysIcon,
    function: false,
  },
  {
    name: screens.amenities,
    title: 'Amenities',
    Icon: AmenitiesIcon,
    function: false,
  },
  {
    name: screens.bookings,
    title: 'Bookings',
    Icon: BookingsIcon,
    function: false,
  },
  {
    name: screens.assistance,
    title: 'Tours / Assistance',
    Icon: AssistanceIcon,
    function: false,
  },
  {
    name: screens.visitLog,
    title: 'Visit Log',
    Icon: VisitLogIcon,
    function: false,
  },
  {
    name: screens.visitByLogin,
    title: 'Visit By Login',
    Icon: VisitsByLoginIcon,
    function: false,
  },
  {
    name: screens.frequentVisits,
    title: 'Frequent Visits',
    Icon: FrequentVisitsIcon,
    function: false,
  },
  {
    name: screens.services,
    title: 'Services',
    Icon: ServicesIcon,
    function: false,
  },
  {
    name: screens.expenseTemplate,
    title: 'Expense Template',
    Icon: ExpenseTemplateIcon,
    function: false,
  },
  {
    name: screens.maintenance,
    title: 'Maintenance',
    Icon: MaintenanceIcon,
    function: false,
  },
  {
    name: screens.emergencyNumber,
    title: 'Emergency Numbers',
    Icon: EmergencyNumbersIcon,
    function: false,
  },
  {
    name: screens.saftyReports,
    title: 'Safety Alert',
    Icon: SaftyReportsIcon,
    function: false,
  },
  {
    name: screens.vehicles,
    title: 'Vehicles',
    Icon: VehiclesIcon,
    function: false,
  },
  {
    name: screens.blackList,
    title: 'Restricted List',
    Icon: BlackListIcon,
    function: false,
  },
  {
    name: screens.pets,
    title: 'Pets',
    Icon: PetsIcon,
    function: false,
  },
  {
    name: screens.raffles,
    title: 'Raffles',
    Icon: RafflesIcon,
    function: false,
  },
  {
    name: screens.consultPlates,
    title: 'Consult Plates',
    Icon: ConsultPlatesIcon,
    function: false,
  },
  {
    name: screens.downloadReports,
    title: 'Download Reports',
    Icon: DownloadReportsIcon,
    function: false,
  },
  {
    name: screens.optionalConfiguration,
    title: 'Optional Configuration',
    Icon: OptionalConfigurationIcon,
    function: false,
  },
  {
    name: screens.activeDevices,
    title: 'Active Devices',
    Icon: ActiveDevicesIcon,
    function: false,
  },
  {
    name: '',
    title: 'Dark Mode',
    Icon: DarkModeIcon,
    component: DarkToLight,
    function: () => {},
  },
  {
    name: screens.changePin,
    title: 'Change Pin',
    Icon: ChangePinIcon,
    function: false,
  },
  {
    name: screens.language,
    title: 'Language',
    Icon: LanguageIcon,
    component: LanguagePicker,
    function: () => {
      global.showBottomSheet({
        flag: true,
        component: BottomSheetSelect,
        componentProps: {
          data: languageOptions,
          title: 'Select Language',
          titleField: 'name',
        },
      });
    },
  },
  {
    name: '',
    title: 'Logout',
    Icon: LogoutIcon,
    function: () => global.logout(),
  },
  {
    name: '',
    title: 'Delete Account',
    Icon: DeleteIcon,
    function: () => global.deleteAccount(),
  },
];

const drawerListResident = [
  {
    name: screens.myCard,
    Icon: UserProfileIcon,
    title: 'My Card',
    function: false,
  },

  {
    name: screens.accountStatus,
    title: 'Account Statement',
    Icon: AccountStatusIcon,
    function: false,
  },
  {
    name: screens.debtorsReport,
    title: 'Debtors Report',
    Icon: DebtorsReportIcon,
    function: false,
  },
  {
    name: screens.announcements,
    title: 'Announcements',
    Icon: AnnouncementsIcon,
    function: false,
  },
  {
    name: screens.documents,
    title: 'General Documents',
    Icon: DocumentsIcon,
    function: false,
  },

  {
    name: screens.visitLog,
    title: 'Visit Log',
    Icon: VisitLogIcon,
    function: false,
  },
  {
    name: screens.reportedIncidents,
    title: 'Reported Incidents',
    Icon: ReportedInCidentsIcon,
    function: false,
  },
  {
    name: screens.surveys,
    title: 'Surveys',
    Icon: SurveysIcon,
    function: false,
  },

  {
    name: screens.bookings,
    title: 'Reservations',
    Icon: BookingsIcon,
    function: false,
  },
  {
    name: screens.privateDocuments,
    title: 'Private Documents',
    Icon: DocumentsIcon,
    function: false,
  },
  {
    name: screens.safetyAlert,
    title: 'Safety Button',
    Icon: SosSaftyBtn,
    function: false,
  },
  {
    name: screens.saftyReports,
    title: 'Safety Alert',
    Icon: SaftyReportsIcon,
    function: false,
  },
  {
    name: screens.vehicles,
    title: 'Vehicles',
    Icon: VehiclesIcon,
    function: false,
  },
  {
    name: screens.pets,
    title: 'Pets',
    Icon: PetsIcon,
    function: false,
  },

  {
    name: screens.activeDevices,
    title: 'Active Devices',
    Icon: ActiveDevicesIcon,
    function: false,
  },
  {
    name: '',
    title: 'Dark Mode',
    Icon: DarkModeIcon,
    component: DarkToLight,
    function: () => {},
  },
  {
    name: screens.changePin,
    title: 'Change Pin',
    Icon: ChangePinIcon,
    function: false,
  },
  {
    name: screens.language,
    title: 'Language',
    Icon: LanguageIcon,
    component: LanguagePicker,
    function: () => {
      global.showBottomSheet({
        flag: true,
        component: BottomSheetSelect,
        componentProps: {
          data: languageOptions,
          title: 'Select Language',
          titleField: 'name',
        },
      });
    },
  },
  {
    name: '',
    title: 'Logout',
    Icon: LogoutIcon,
    function: () => global.logout(),
  },
  {
    name: '',
    title: 'Delete Account',
    Icon: DeleteIcon,
    function: () => global.deleteAccount(),
  },
];

const tabOptionsVigilant: {
  name: string;
  Component: any;
  Icon?: any;
  show?: string;
}[] = [
  {
    name: screens.ResidentVigilant,
    Component: ResidentVig,
    Icon: HomeIcon,
    show: 'Receive',
  },

  {
    name: screens.EventVig,
    Component: EventsVig,
    Icon: EventIcon,
    show: 'Eventual',
  },
  {
    name: screens.DismissVisitsVig,
    Component: DismissVisitsVig,
    Icon: DismissVisitIcon,
    show: 'Dismiss Visits',
  },
  {
    name: screens.contacts,
    Component: Contacts,
    Icon: ChatIcon,
    show: 'Chat',
  },
  {
    name: screens.drawer,
    Component: CustomDrawer,
    Icon: ExtraAddIcon,
    show: 'Extra',
  },
];
const tabOptionVigList: {name: string; Icon?: any}[] = [
  {
    name: screens.ResidentVigilant,
    Icon: HomeIcon,
  },

  {
    name: screens.EventVig,
    Icon: EventIcon,
  },
  {
    name: screens.DismissVisitsVig,
    Icon: DismissVisitIcon,
  },
  {
    name: screens.contacts,
    Icon: ChatIcon,
  },
  {
    name: screens.drawer,
    Icon: ExtraAddIcon,
  },
];

//vigilant flow
const drawerListViglant = [
  {
    name: screens.assistance,
    title: 'Rondies',
    Icon: VisitLogIcon, //done
    function: false,
  },

  {
    name: screens.AssistsVig,
    title: 'Assists',
    Icon: ResidentsIcon,
    function: false,
  },
  {
    name: screens.reportedIncidents,
    title: 'Incidents Report',
    Icon: ReportedInCidentsIcon,
    function: false,
  },
  {
    name: screens.reportActivity,
    title: 'Reported Activity',
    Icon: ReportedActivityIcon,
    function: false,
  },
  {
    name: screens.AccessAlertVig,
    title: 'Access Alerts',
    Icon: AnnouncementsIcon,
    function: false,
  },
  {
    name: screens.activeDevices,
    title: 'Active Devices',
    Icon: ActiveDevicesIcon, //done
    function: false,
  },
  {
    name: screens.safetyAlert,
    title: 'Safty Button', // done
    Icon: SosSaftyBtn,
    function: false,
  },
  {
    name: screens.saftyReports,
    title: 'Safety Alert',
    Icon: SaftyReportsIcon,
    function: false,
  },
  {
    name: screens.consultPlates,
    title: 'Consult Plates',
    Icon: ConsultPlatesIcon, //done
    function: false,
  },
  {
    name: screens.blackList,
    title: 'Restricted List',
    Icon: BlackListIcon,
    function: false,
  },

  {
    name: screens.bookings,
    title: 'Paid Reservations',
    Icon: BookingsIcon,
    function: false,
  },
  {
    name: screens.pets,
    title: 'Lost Pets',
    Icon: PetsIcon,
    function: false,
  },
  {
    name: screens.CameraSettings,
    title: 'Camera Settings',
    Icon: Camera,
    function: false,
  },
  {
    name: '',
    title: 'Dark Mode',
    Icon: DarkModeIcon,
    component: DarkToLight,
    function: () => {},
  },
  {
    name: screens.changePin,
    title: 'Change Pin',
    Icon: ChangePinIcon,
    function: false,
  },
  {
    name: screens.language,
    title: 'Language',
    Icon: LanguageIcon,
    component: LanguagePicker,
    function: () => {
      global.showBottomSheet({
        flag: true,
        component: BottomSheetSelect,
        componentProps: {
          data: languageOptions,
          title: 'Select Language',
          titleField: 'name',
        },
      });
    },
  },
  {
    name: '',
    title: 'Logout',
    Icon: LogoutIcon,
    function: () => global.logout(),
  },
  {
    name: '',
    title: 'Delete Account',
    Icon: DeleteIcon,
    function: () => global.deleteAccount(),
  },
];
const downloadReportsList = [
  {
    title: 'Pending Charges',
    description:
      "Download reports of Residents' outstanding debts, accumulated by resident or detailed.",
    name: screens.pendingChargesReports,
  },
  {
    title: 'Monthly Income',
    description:
      'Download the detailed list by month of payments made by residents',
    name: screens.incomeReports,
  },
  {
    title: 'Annual Income Summary',
    description:
      "Download an annual summary of residents' outstanding payments and debts.",
    name: screens.annualIncomeReports,
  },
  {
    title: 'Monthly Expenses',
    description: 'Download the detailed list of captured expenses per month',
    name: screens.monthlyExpensesReports,
  },
  {
    title: 'Annual Expense Summary',
    description:
      'Download an annual summary of expenses recorded in the application.',
    name: screens.annualExpenseReports,
  },
  {
    title: 'Advances/SF to be Processed',
    description:
      'Download the information about the active advances of each resident, that is, their credit balances.',
    name: screens.advancesSFReports,
  },
  {
    title: 'Canceled Charges',
    description: 'Download information about canceled charges',
    name: screens.canceledChargesReports,
  },
  {
    title: 'Residents',
    description:
      'Download the list of existing residents in the application along with their general information.',
    name: screens.residentReports,
  },
  {
    title: 'Frequent Visits',
    description:
      'Download the list of frequent visits discharged by residents.',
    name: screens.frequentVisitsReports,
  },
  {
    title: 'Rondines',
    description:
      'Download the list of the patrols carried out by the security guards.',
    name: screens.rondinesReports,
  },
  {
    title: 'Record of visits',
    description:
      'Download the details of the visits that have accessed the private',
    name: screens.recordOfVisitsReports,
  },
  {
    title: 'Assists',
    description: 'Download the list of assistance made by the security guards.',
    name: screens.assistsReports,
  },
  {
    title: 'Incidents',
    description: 'Download reports of incidents reported by Residents',
    name: screens.incidentsReports,
  },
];
const optionalConfigurationList = [
  {title: 'Quota Configuration', name: screens.quotaConfigurationOptional},
  {
    title: 'Classification of Expenses',
    name: screens.classificationExpensesOptional,
  },
  {title: 'Income Classification', name: screens.incomeClassificationOptional},
  {title: 'Accept Card Payments', name: screens.acceptCardOptional},
  {title: 'Access Controllers', name: screens.accessControllersOptional},
  {title: 'Access Cards/Tag', name: screens.accessCardsOptional},
  {title: 'Siren', name: screens.sirenOptional},
  {title: 'QR Readers', name: screens.qrReadersOptional},
  {title: 'Smart Doors', name: screens.smartDoorsOptional},
  {title: 'Virtual Intercom', name: screens.virtualIntercomOptional},
  {title: 'Surveillance Cameras', name: screens.surveillanceCameras},
  {title: 'Safty Button', name: screens.saftyButtonCameras},
  {title: 'Social Channels', name: screens.socialChannelsButton},
];
const languageOptions = [
  {name: 'English', shortName: 'en'},
  {name: 'Español', shortName: 'es'},
];
const colorsArray = [
  '#000000',
  '#FFFFFF',
  '#C0C0C0',
  '#808080',
  '#A52A2A',
  '#FFD700',
  '#FF0000',
  '#FFFF00',
  '#A42571',
  '#0000FF',
  '#D2B48C',
  '#008000',
];
const userRoles = [
  'Super Administrator',
  'Administrator',
  'Vigilant',
  'Resident',
];
export {
  tabOptions,
  tabOptionsRes,
  drawerList,
  downloadReportsList,
  optionalConfigurationList,
  languageOptions,
  colorsArray,
  userRoles,
  tabOptionsVigilant,
  tabOptionVigList, //vigilant flow
  tabOptionsList, //vigilant flow
  drawerListViglant, //for vigilant flow
  drawerListResident,
  tabOptionResList,
};
