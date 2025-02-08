import AWS from 'aws-sdk';

const config = {
  activityHeight: 0,
  localStorageDay: '',
  currencySymbol: '$',
  apiTimeout: 5000,
  // baseUrl: 'http://192.168.18.200:3000',
  baseUrl: 'https://backend.coloniapp.com',
  token: '',
  role: '',
  serverKey:
    '',
  title: 'ColoniApp',
  fcmtoken: '',
};

const s3 = new AWS.S3({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1',
});
export {config, s3};
