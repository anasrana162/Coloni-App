import {showMessage} from 'react-native-flash-message';

const imageValidation = (image: any, trans: any) => {
  const supportedFormat = ['jpg', 'jpeg', 'png'];
  const res = Array.isArray(image) ? image[0] : image;
  let ext = res.mime?.split('/')[1];
  const isSupportedFormat = supportedFormat.indexOf(ext) > -1;
  if (res.size / 1000000 <= 5 && isSupportedFormat) {
    return Array.isArray(image) ? image[0] : image;
  } else {
    !isSupportedFormat
      ? showMessage({
          message: trans("Image allow extension 'jpg', 'jpeg', 'png'"),
        })
      : showMessage({
          message: 'Image size must be less than or equal to 5 MB',
        });
  }
};

const pdfValidation = (file: any, trans: any) => {
  const supportedFormat = ['pdf'];
  const res = Array.isArray(file) ? file[0] : file;
  let ext = res.type?.split('/')[1];
  const isSupportedFormat = supportedFormat.indexOf(ext) > -1;
  if (res.size / 1000000 <= 5 && isSupportedFormat) {
    return Array.isArray(file) ? file[0] : file;
  } else {
    !isSupportedFormat
      ? showMessage({
          message: trans("File allow extension 'pdf'"),
        })
      : showMessage({
          message: 'File size must be less than or equal to 5 MB',
        });
  }
};
export {imageValidation, pdfValidation};
