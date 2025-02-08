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
    'AAAAgpfUtt8:APA91bGmvn82kY1wuyO4wDX89067P81XnQ0XXUvwUR3Jwidh4_uLAMZCMHBzdGm3dgtomBLqXhaLFfHhHhJx_rkH0o-qzbvM942cHGnCnqCHTI0mvtPBWNFLVl5ywLQqEon6F8ZU2c3b',
  title: 'ColoniApp',
  fcmtoken: '',
};

const s3 = new AWS.S3({
  accessKeyId: 'AKIAQ3EGPNDZLJABVN7C',
  secretAccessKey: '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',
  region: 'us-east-1',
});
export {config, s3};
