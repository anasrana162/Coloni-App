import axios from 'axios';
import { rootApi } from '../rootApi';
import { s3EndPoint } from '../endpoint.api';
import { config } from '../../../../Config';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: "", 
  secretAccessKey: "",
  region: 'us-east-1'
});
// class S3Service {
  const uploadFileToS3 = async (bucketName: string, fileName: string, fileContent: Buffer | Blob, contentType: string): Promise<AWS.S3.ManagedUpload.SendData> => {
    const fileParams: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: contentType, 
      ACL: 'public-read',
    };
  
    try {
      const uploadResult = await s3.upload(fileParams).promise();
      return uploadResult;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

export default { uploadFileToS3};