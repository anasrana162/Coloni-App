import { userRoles } from '../../assets/ts/core.data';
import { config } from '../../../Config';

export const baseUrl = config.baseUrl;
export const adminUrl = config.baseUrl + '/admin';
export const userUrl = config.baseUrl + '/users';
export const superAdminUrl = config.baseUrl + '/super-admin';
export const chatsBaseUrl = 'https://api.ahle.chat/api/';
export const socketServerUrl = 'https://api.ahle.chat/';
export const moduleName = {
  auth: '/auth',
  vehicles: '/vehicles',
  users: '/users',
  admin: '/admin',
  expenses: '/expenses',
  expenseTemplates: '/expense-templates',
  expenseTypes: '/expense-type',
  pets: '/pets',
  emNumbers: '/emNumbers',
  profile: '/profile',
  paymentTypes: '/payment-types',
  amenities: '/amenities',
  incidents: '/incidents',
  generateMassiveCharges: '/massive-charges',
  street: '/street',
  colonies: '/colonies',
  uploads: '/uploads',
  visits: '/visits',
  eventualVisits: '/eventual-visits',
  visitsTypes: '/frequent-visitType',
  visitsTypesEventual: '/eventualType',
  payments: '/payments',
  income: '/income',
  partialIncome: '/income-partial',
  announcements: '/announcements',
  documents: '/documents',
  residentDocumentsTypes: '/resident-documentType',
  documentsTypes: '/document-type',
  blacklist: '/blacklist',
  maintenance: '/maintenance',
  surveys: '/surveys',
  services: '/services',
  raffles: '/raffles',
  consultPlates: '/consult-plates',
  monthCharges: '/month-charges',
  pendingCharges: '/download-reports/monthly-pcharge',
  monthlyIncome: '/download-reports/monthly-income',
  monthlyExpense: '/download-reports/monthly-expenses',
  annualIncome: '/download-reports/annual-income',
  annualExpense: '/download-reports/annual-expenses',
  advancedSF: '/download-reports//advance-SF',
  cancelCharges: '/download-reports/annual-cancelled-charges',
  assistsReport: '/download-reports/assist',
  incidentsReports: '/download-reports/incident',
  residentReport: '/download-reports/resident',
  rondinesReport: '/download-reports/rondines',
  recordVists: '/download-reports/visit-records',
  quotaConfig: '/optional-config/quota-config',
  saftyConfig: '/optional-config/safety-button',
  acceptCards: '/optional-config/accept-card',
  incomeClassification: '/optional-config/incomeClassfication',
  ExpenseClassification: '/optional-config/classification',
  otherIncome: '/other-income',
  outstandingBalance: '/outstanding',
  reportActivity: '/report-activity',
  saftyReport: '/panic-button',
  frequentVisit: '/frequent-visit',
  frequentVisitType: '/frequent-visitType',
  frequentVisitRecords: '/download-reports/visit-records',
  chats: '/chats',
  accountStatus: '/account-status',
  debtorsReport: '/debtor-report',
  booking: '/reservation',
  MassiveChargesItem: '/massive-charges/generate',
  dashboard: '/dashboard',
  myPrivate: '/my-private',
  myCard: '/card',
  tour: '/tour',
  processBalances: '/process-balances',
  Devices: '/devices',
  AccessControls: '/optional-config/control',
  AccessTagCard: '/optional-config/tag-card',
  QrReader: '/optional-config/qr-reader',
  SmartDoor: '/optional-config/smart-door',
  VirtualPhone: '/optional-config/virtual-phone',
  Surveillance: '/optional-config/surveillance',
  SocialChannel: '/optional-config/social-channel',
  notification: '/send-notification',
  Siren: '/optional-config/siren',
  GarbageArrived: '/garbage-arrived',
  Assistance: '/assistance',
  CameraSettings: '/camera-setting',
  DismissVisit: '/dismiss-visits',
};
const DismissVisitEndPoint = {
  list: adminUrl + moduleName.DismissVisit + '/',
  createEntry: adminUrl + moduleName.DismissVisit + '/entry',
  createExit: adminUrl + moduleName.DismissVisit + '/exit',
};
const NotificationEndPoint = {
  delete: adminUrl + moduleName.notification + '/',
};
const GarbageArrivedEndPoint = {
  create: adminUrl + moduleName.GarbageArrived,
};
const AccessControllersEndPoint = {
  create: adminUrl + moduleName.AccessControls,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.AccessControls,
  add: adminUrl + moduleName.AccessControls,
  delete: adminUrl + moduleName.AccessControls + '/',
  update: adminUrl + moduleName.AccessControls + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.AccessControls +
    '/',
};
const AccessTagCardEndPoint = {
  create: adminUrl + moduleName.AccessTagCard,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.AccessTagCard,
  add: adminUrl + moduleName.AccessTagCard,
  delete: adminUrl + moduleName.AccessTagCard + '/',
  update: adminUrl + moduleName.AccessTagCard + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.AccessTagCard +
    '/',
};
const SirenEndPoint = {
  list: adminUrl + moduleName.Siren,
};
const QrReaderEndpoint = {
  create: adminUrl + moduleName.QrReader,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.QrReader,
  add: adminUrl + moduleName.QrReader,
  delete: adminUrl + moduleName.QrReader + '/',
  update: adminUrl + moduleName.QrReader + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.QrReader +
    '/',
};

const DevicesEndPoint = {
  list: adminUrl + moduleName.Devices,
  listResident: adminUrl + moduleName.Devices + '/user',
  delete: adminUrl + moduleName.Devices + '/',
};
const ProcessBalaceInFavour = {
  list: adminUrl + moduleName.processBalances,
};

const SmartDoorEndpoints = {
  create: adminUrl + moduleName.SmartDoor,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.SmartDoor,
  add: adminUrl + moduleName.SmartDoor,
  delete: adminUrl + moduleName.SmartDoor + '/',
  update: adminUrl + moduleName.SmartDoor + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.SmartDoor +
    '/',
};
const VirtualphoneEndpoints = {
  create: adminUrl + moduleName.VirtualPhone,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.VirtualPhone,
  add: adminUrl + moduleName.VirtualPhone,
  delete: adminUrl + moduleName.VirtualPhone + '/',
  update: adminUrl + moduleName.VirtualPhone + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.VirtualPhone +
    '/',
};
const SurveillanceEndPoint = {
  create: adminUrl + moduleName.Surveillance,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.Surveillance,
  add: adminUrl + moduleName.Surveillance,
  delete: adminUrl + moduleName.Surveillance + '/',
  update: adminUrl + moduleName.Surveillance + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.Surveillance +
    '/',
};
const SocialChannelEndPoint = {
  create: adminUrl + moduleName.SocialChannel,
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.SocialChannel,
  add: adminUrl + moduleName.SocialChannel,
  delete: adminUrl + moduleName.SocialChannel + '/',
  update: adminUrl + moduleName.SocialChannel + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.SocialChannel +
    '/',
};
const coloniesSuperAdminEndPoint = {
  list: superAdminUrl + moduleName.colonies,
  create: superAdminUrl + moduleName.colonies,
  delete: superAdminUrl + moduleName.colonies + '/',
  update: superAdminUrl + moduleName.colonies + '/',
  details: superAdminUrl + moduleName.colonies + '/',
  resident: superAdminUrl + moduleName.colonies + '/residents',
  defaultResident:
    superAdminUrl + moduleName.colonies + '/residents/defaulters',
  residentDetails: superAdminUrl + moduleName.colonies + '/residents/',
  AdminList: superAdminUrl + moduleName.colonies + '/getAdmin/get',
  getAccessColony: superAdminUrl + moduleName.colonies + '/getAccess/',
};

const TourEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.tour,
  create: adminUrl + moduleName.tour,
  details: adminUrl + moduleName.tour + '/',
  update: adminUrl + moduleName.tour + '/',
  delete: adminUrl + moduleName.tour + '/',
};

const vehiclesEndPoint = {
  create: baseUrl + moduleName.vehicles,
  update: baseUrl + moduleName.vehicles + '/',
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.vehicles,
  delete: baseUrl + moduleName.vehicles + '/',
  details: baseUrl + moduleName.vehicles + '/',
};
const myPrivateEndPoints = {
  create: baseUrl + moduleName.myPrivate + '/upload',
  list: adminUrl + moduleName.myPrivate,
  update: adminUrl + moduleName.myPrivate + '/',
};

const myCardEndPoints = {
  create: baseUrl + moduleName.myCard,
  list: baseUrl + moduleName.myCard,
};
const dashboardEndPoint = {
  list: adminUrl + moduleName.dashboard,
};
const expensesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.expenses,
  add: adminUrl + moduleName.expenses,
  delete: adminUrl + moduleName.expenses + '/',
  update: adminUrl + moduleName.expenses + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.expenses +
    '/',
};
const expenseTypesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.expenseTemplates,
  add: adminUrl + moduleName.expenseTemplates,
  details: adminUrl + moduleName.expenseTemplates + '/',
  update: adminUrl + moduleName.expenseTemplates + '/',
  delete: adminUrl + moduleName.expenseTemplates + '/',
};
const expenseTypeEndPoint = {
  list: adminUrl + moduleName.expenseTypes,
  add: adminUrl + moduleName.expenseTypes,
  details: adminUrl + moduleName.expenseTypes + '/',
  update: adminUrl + moduleName.expenseTypes + '/',
  delete: adminUrl + moduleName.expenseTypes + '/',
};

const petEndPoint = {
  list:
    (config.role === userRoles.ADMIN ||
      config.role === userRoles.VIGILANT ||
      config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.pets,
  create:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.pets,
  update:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.pets +
    '/',
  delete:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.pets +
    '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.pets +
    '/',
};
const emergencyNumbers = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.emNumbers,
  create: adminUrl + moduleName.emNumbers,
  update: adminUrl + moduleName.emNumbers + '/',
  delete: adminUrl + moduleName.emNumbers + '/',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.emNumbers +
    '/',
};
const paymentTypes = {
  list: adminUrl + moduleName.paymentTypes,
  create: adminUrl + moduleName.paymentTypes,
  delete: adminUrl + moduleName.paymentTypes + '/',
};
const amenityEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.amenities,
  create: adminUrl + moduleName.amenities,
  delete: adminUrl + moduleName.amenities + '/',
  update: adminUrl + moduleName.amenities + '/',
  details: adminUrl + moduleName.amenities + '/',
};
const incidentEndPoint = {
  list: adminUrl + moduleName.incidents,
  // (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
  //   ? adminUrl
  //   : baseUrl) + moduleName.incidents,
  create: adminUrl + moduleName.incidents,
  delete: adminUrl + moduleName.incidents + '/',
  update: adminUrl + moduleName.incidents + '/',
  details: adminUrl + moduleName.incidents + '/',
};

const generateMassiveChargesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.generateMassiveCharges,
  surchargeList:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.generateMassiveCharges +
    '/fetchAffect',
  affectedChargeList:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.generateMassiveCharges +
    '/fetchAffectByID',
  createSurcharge:
    adminUrl + moduleName.generateMassiveCharges + '/createAffected',
  create: adminUrl + moduleName.MassiveChargesItem,
  update: adminUrl + moduleName.MassiveChargesItem + '/update/',
  delete: adminUrl + moduleName.generateMassiveCharges + '/',
};
const streetEndPoint = {
  list: adminUrl + moduleName.street,
  create: adminUrl + moduleName.street,
  delete: adminUrl + moduleName.street + '/',
};
const coloniesEndPoint = {
  list: adminUrl + moduleName.colonies,
  create: adminUrl + moduleName.colonies,
  delete: adminUrl + moduleName.colonies + '/',
  update: adminUrl + moduleName.colonies + '/',
  details: adminUrl + moduleName.colonies + '/',
  resident: adminUrl + moduleName.colonies + '/residents',
  defaultResident: adminUrl + moduleName.colonies + '/residents/defaulters',
  residentDetails: adminUrl + moduleName.colonies + '/residents/',
};
const s3EndPoint = {
  signedURL:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.uploads,
};
const visitsEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.visits,
  details: adminUrl + moduleName.visits + '/',
  delete: adminUrl + moduleName.visits + '/',
  update: adminUrl + moduleName.visits + '/',
  create: adminUrl + moduleName.visits,
};

const eventaulVisitsEndPoint = {
  list:
    (config.role === userRoles.ADMIN ||
      config.role === userRoles.VIGILANT ||
      config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.eventualVisits,
  details: adminUrl + moduleName.eventualVisits + '/',
  delete: adminUrl + moduleName.eventualVisits + '/',
  update: adminUrl + moduleName.eventualVisits + '/',
  create: adminUrl + moduleName.eventualVisits + '/',
};
const cameraSettingsEndPoint = {
  create: adminUrl + moduleName.CameraSettings,
  list: adminUrl + moduleName.CameraSettings,
  details: adminUrl + moduleName.CameraSettings,
};
const visitsTypeEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.visitsTypes,
  delete: adminUrl + moduleName.visitsTypes + '/',
  create: adminUrl + moduleName.visitsTypes,
  createEventual: adminUrl + moduleName.visitsTypesEventual,
  listEventual: adminUrl + moduleName.visitsTypesEventual,
  deleteEventual: adminUrl + moduleName.visitsTypesEventual + '/',
};
const otherIncomeEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.otherIncome,
  details: adminUrl + moduleName.otherIncome + '/',
  delete: adminUrl + moduleName.otherIncome + '/',
  update: adminUrl + moduleName.otherIncome + '/',
  create: adminUrl + moduleName.otherIncome,
  approve: adminUrl + moduleName.otherIncome + '/approve/',
  submitCharges:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.otherIncome +
    '/submit-mocharges/',
};
const outstandingBalanceEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.outstandingBalance,
  listCharges:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.outstandingBalance +
    '/getCharges/',
  downloadFile: adminUrl + moduleName.outstandingBalance + '/download-file',
  notify: adminUrl + moduleName.outstandingBalance + '/notify',
  details: adminUrl + moduleName.outstandingBalance + '/',
  delete: adminUrl + moduleName.outstandingBalance + '/',
  update: adminUrl + moduleName.outstandingBalance + '/',
  create: adminUrl + moduleName.outstandingBalance,
};
const monthChargesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.monthCharges,
  details: adminUrl + moduleName.monthCharges + '/',
  delete: adminUrl + moduleName.monthCharges + '/',
  update: adminUrl + moduleName.monthCharges + '/',
  updateCharges: adminUrl + moduleName.monthCharges + '/update-status',
  changeLog: adminUrl + moduleName.monthCharges + '/log/',
  balanceInFavor: adminUrl + moduleName.monthCharges + '/balance-infavor',
  create: adminUrl + moduleName.monthCharges,
  submitCharges: adminUrl + moduleName.monthCharges + '/submit-mocharges/',
  approve: adminUrl + moduleName.monthCharges + '/approve/',
  decline: adminUrl + moduleName.monthCharges + '/decline/',
  notify: adminUrl + moduleName.monthCharges + '/notify/',
};

const incomeEndPoint = {
  list: adminUrl + moduleName.income + '/',
  updateCharges: adminUrl + moduleName.income + '/approve',
  balanceInFavor: adminUrl + moduleName.income + '/balance-infavor',
  partial: adminUrl + moduleName.partialIncome + '/',
  delete: adminUrl + moduleName.income + '/',
  update: adminUrl + moduleName.income + '/',
  create: adminUrl + moduleName.income,
  changeLog: adminUrl + moduleName.partialIncome + '/changeLog/',
};

const pendingChargesEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.pendingCharges,
};
const monthlyIncomeEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.monthlyIncome,
};
const annualIncomeEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.annualIncome,
};
const annualExpenseEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.annualExpense,
};

const advancedSFEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.advancedSF,
};
const monthlyExpenseEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.monthlyExpense,
};
const cancelChargesEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.cancelCharges,
};
const assistsReportEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.assistsReport,
};
const incidentsReport = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.incidentsReports,
};
const residentReportEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.residentReport,
};
const rondinesReportEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.rondinesReport,
};
const recordVisitsEndPoint = {
  fetch:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.recordVists,
};
const acceptCardsEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.acceptCards,
  details: adminUrl + moduleName.acceptCards + '/',
  delete: adminUrl + moduleName.acceptCards + '/',
  update: adminUrl + moduleName.acceptCards + '/',
  create: adminUrl + moduleName.acceptCards,
};
const incomeClassificationEndpoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.incomeClassification,
  details: adminUrl + moduleName.incomeClassification + '/',
  delete: adminUrl + moduleName.incomeClassification + '/',
  update: adminUrl + moduleName.incomeClassification + '/',
  create: adminUrl + moduleName.incomeClassification,
};
const ExpenseClassificationEndpoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.ExpenseClassification,
  details: adminUrl + moduleName.ExpenseClassification + '/',
  delete: adminUrl + moduleName.ExpenseClassification + '/',
  update: adminUrl + moduleName.ExpenseClassification + '/',
  create: adminUrl + moduleName.ExpenseClassification,
};
const saftyConfigurtionEndpoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.saftyConfig,
  details: adminUrl + moduleName.saftyConfig + '/',
  delete: adminUrl + moduleName.saftyConfig + '/',
  update: adminUrl + moduleName.saftyConfig + '/',
  create: adminUrl + moduleName.saftyConfig,
};

const quotaConfigurtionEndpoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.quotaConfig,
  details: adminUrl + moduleName.quotaConfig + '/',
  delete: adminUrl + moduleName.quotaConfig + '/',
  update: adminUrl + moduleName.quotaConfig + '/',
  create: adminUrl + moduleName.quotaConfig,
};

const announcementsEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.announcements,
  details: adminUrl + moduleName.announcements + '/',
  delete: adminUrl + moduleName.announcements + '/',
  update: adminUrl + moduleName.announcements + '/',
  create: adminUrl + moduleName.announcements,
  createNotify: adminUrl + moduleName.announcements + '/notify',
};
const reportActivityEndPoint = {
  list: adminUrl + moduleName.reportActivity,
  details: adminUrl + moduleName.reportActivity + '/',
  delete: adminUrl + moduleName.reportActivity + '/',
  update: adminUrl + moduleName.reportActivity + '/',
  create: adminUrl + moduleName.reportActivity,
};
const saftyReportEndPoint = {
  list: adminUrl + moduleName.saftyReport,
  details: adminUrl + moduleName.saftyReport + '/',
  delete: adminUrl + moduleName.saftyReport + '/',
  update: adminUrl + moduleName.saftyReport + '/',
  create: baseUrl + moduleName.saftyReport,
};
const bookingEndPoint = {
  list: adminUrl + moduleName.booking,
  details: adminUrl + moduleName.booking + '/',
  delete: adminUrl + moduleName.booking + '/',
  update: adminUrl + moduleName.booking + '/',
  create: adminUrl + moduleName.booking,
};
const documentsEndPoint = {
  list: adminUrl + moduleName.documents,
  listResidents: userUrl + '/residents',
  listResident: adminUrl + moduleName.documents + '/',
  details: adminUrl + moduleName.documents + '/colony-documents/',
  delete: adminUrl + moduleName.documents + '/colony-documents/',
  update: adminUrl + moduleName.documents + '/',
  create: adminUrl + moduleName.documents,
  listResDocTypes:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.residentDocumentsTypes,
  resDocTypesCreate: adminUrl + moduleName.residentDocumentsTypes,
  resDocTypesDelete: adminUrl + moduleName.residentDocumentsTypes + '/',
  listDocTypes:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.documentsTypes,
  docTypesCreate: adminUrl + moduleName.documentsTypes,
  docTypesDelete: adminUrl + moduleName.documentsTypes + '/',
};
const servicesEndPoint = {
  list: adminUrl + moduleName.services,
  details: adminUrl + moduleName.services + '/',
  delete: adminUrl + moduleName.services + '/',
  update: adminUrl + moduleName.services + '/',
  create: adminUrl + moduleName.services,
};
const blacklistEndPoint = {
  list: adminUrl + moduleName.blacklist,
  details: adminUrl + moduleName.blacklist + '/',
  delete: adminUrl + moduleName.blacklist + '/',
  update: adminUrl + moduleName.blacklist + '/',
  create: adminUrl + moduleName.blacklist,
};
const maintenanceEndPoint = {
  list: adminUrl + moduleName.maintenance,
  details: adminUrl + moduleName.maintenance + '/',
  delete: adminUrl + moduleName.maintenance + '/',
  update: adminUrl + moduleName.maintenance + '/',
  create: adminUrl + moduleName.maintenance,
};

const rafflesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.raffles,
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.raffles +
    '/',
  delete:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.raffles +
    '/',
  update:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.raffles +
    '/',
  create:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.raffles,
};
const surveysEndPoint = {
  SurveyResidentList: baseUrl + moduleName.surveys + '/',
  list:
    config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl + moduleName.surveys
      : baseUrl + moduleName.surveys + '/',
  // list:adminUrl+moduleName.surveys,

  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.surveys +
    '/details/',
  download:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.surveys +
    '/download/',

  detailsbyId:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.surveys +
    '/',
  delete: adminUrl + moduleName.surveys + '/',
  update: adminUrl + moduleName.surveys + '/',
  create: adminUrl + moduleName.surveys,
  deactivate: adminUrl + moduleName.surveys + '/',
  activate: adminUrl + moduleName.surveys + '/',
  vote:
    // (config.role === (userRoles.ADMIN || userRoles.SUPER_ADMIN)
    //   ? adminUrl
    //   : baseUrl) +

    baseUrl + moduleName.surveys + '/',
};
const frequentVisitEndPoint = {
  list: adminUrl + moduleName.frequentVisit,
  details: adminUrl + moduleName.frequentVisit + '/',
  delete: adminUrl + moduleName.frequentVisit + '/',
  update: adminUrl + moduleName.frequentVisit + '/',
  create: adminUrl + moduleName.frequentVisit,
};
const accountStatusEndPoint = {
  list: adminUrl + moduleName.accountStatus,
  details: adminUrl + moduleName.accountStatus + '/',
  eliminate: adminUrl + moduleName.accountStatus + '/eliminate/',
  delete: adminUrl + moduleName.accountStatus + '/',
  update: adminUrl + moduleName.accountStatus + '/',
  create: adminUrl + moduleName.accountStatus,
  updateExpense: adminUrl + moduleName.accountStatus + '/expense-income/',
  reciptList: adminUrl + moduleName.accountStatus + '/receipt-list/',
  dischargeFileList: adminUrl + moduleName.accountStatus + '/download-receipt',
};

const devicesEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.Devices,
};

const debtorsReportEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.debtorsReport,
  details: adminUrl + moduleName.debtorsReport + '/details',
  eliminate: adminUrl + moduleName.debtorsReport + '/eliminate/',
  delete: adminUrl + moduleName.debtorsReport + '/',
  update: adminUrl + moduleName.debtorsReport + '/',
  create: adminUrl + moduleName.debtorsReport,
  updateExpense: adminUrl + moduleName.debtorsReport + '/expense-income/',
};
const frequentVisitTypeEndPoint = {
  list: adminUrl + moduleName.frequentVisitType,
  create: adminUrl + moduleName.frequentVisitType,
  visitRecords:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.frequentVisitRecords,
};
const chatsEndPoint = {
  listContacts: chatsBaseUrl + moduleName.chats + '/group',
  listMessages: chatsBaseUrl + moduleName.chats + '/getMessages',
  details:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.chats,
  send:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.chats +
    '/messages',
  delete:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.chats +
    '/messages/',
};
const paymentEndPoint = {
  list:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) + moduleName.payments,
  approve: adminUrl + moduleName.payments + '/approve/',
  disapprove: adminUrl + moduleName.payments + '/disapprove/',
  calculateBalance:
    (config.role === userRoles.ADMIN || config.role === userRoles.SUPER_ADMIN
      ? adminUrl
      : baseUrl) +
    moduleName.income +
    '/balances',
  update: adminUrl + moduleName.payments + '/',
  generatePayment: adminUrl + moduleName.payments + '/generate',
  massiveCharges: adminUrl + moduleName.payments + '/massive-charges',
  details: adminUrl + moduleName.payments + '/',
};
const assistEndPoint = {
  list: adminUrl + moduleName.Assistance,
  details: adminUrl + moduleName.Assistance + '/',
  delete: adminUrl + moduleName.Assistance + '/',
  update: adminUrl + moduleName.Assistance + '/',
  create: adminUrl + moduleName.Assistance,
};
export {
  coloniesSuperAdminEndPoint,
  myPrivateEndPoints,
  myCardEndPoints,
  dashboardEndPoint,
  vehiclesEndPoint,
  expensesEndPoint,
  expenseTypesEndPoint,
  expenseTypeEndPoint,
  petEndPoint,
  emergencyNumbers,
  paymentTypes,
  amenityEndPoint,
  incidentEndPoint,
  streetEndPoint,
  coloniesEndPoint,
  s3EndPoint,
  visitsEndPoint,
  eventaulVisitsEndPoint,
  paymentEndPoint,
  announcementsEndPoint,
  documentsEndPoint,
  blacklistEndPoint,
  maintenanceEndPoint,
  surveysEndPoint,
  servicesEndPoint,
  rafflesEndPoint,
  monthChargesEndPoint,
  pendingChargesEndPoint,
  visitsTypeEndPoint,
  monthlyIncomeEndPoint,
  monthlyExpenseEndPoint,
  advancedSFEndPoint,
  annualIncomeEndPoint,
  annualExpenseEndPoint,
  cancelChargesEndPoint,
  residentReportEndPoint,
  rondinesReportEndPoint,
  recordVisitsEndPoint,
  assistsReportEndPoint,
  incidentsReport,
  saftyConfigurtionEndpoint,
  quotaConfigurtionEndpoint,
  acceptCardsEndPoint,
  incomeClassificationEndpoint,
  ExpenseClassificationEndpoint,
  generateMassiveChargesEndPoint,
  devicesEndPoint,
  incomeEndPoint,
  outstandingBalanceEndPoint,
  otherIncomeEndPoint,
  reportActivityEndPoint,
  saftyReportEndPoint,
  frequentVisitTypeEndPoint,
  frequentVisitEndPoint,
  chatsEndPoint,
  accountStatusEndPoint,
  debtorsReportEndPoint,
  bookingEndPoint,
  TourEndPoint,
  ProcessBalaceInFavour,
  DevicesEndPoint,
  AccessControllersEndPoint,
  AccessTagCardEndPoint,
  QrReaderEndpoint,
  SmartDoorEndpoints,
  VirtualphoneEndpoints,
  SurveillanceEndPoint,
  SocialChannelEndPoint,
  NotificationEndPoint,
  SirenEndPoint,
  GarbageArrivedEndPoint,
  assistEndPoint,
  cameraSettingsEndPoint,
  DismissVisitEndPoint,
};
