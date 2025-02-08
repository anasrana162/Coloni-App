import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import {momentTimezone} from '../../packages/momentTimezone.package';
// import ViewShot from "react-native-view-shot";
const {width, height} = Dimensions.get('screen');
import RNFS from 'react-native-fs';
// import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

interface VoucherCompProps {
  data?: any; // Consider specifying a more precise type if possible
  onDismiss?: () => void;
  titleHeader?: string;
}

const VoucherComp: React.FC<VoucherCompProps> = ({
  data = [],
  onDismiss,
  titleHeader,
}) => {
  const {t: trans} = useTranslation();
  const ref = useRef();

  const printPDF = async () => {
    const imageBase64Data =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABAAAAAEABAAEAAAABAAAAAAAAAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCAEsASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2WiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKQkDGTTJZVhjLucAVhXV7JczBgSqqcqB/nrWFavGktdzOdRQOhorPsL/zwI5CBIB+daFaU6imrouMlJXQUUUVYwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAJxUcsqwxlnOAKJpVhjLOcAVgXl411Jk8ID8ornr11TXmZ1KiggvLx7qTJ4QfdFV6KK8eUnJtt6nDKTk7sUEoQQSCDkEdq2rC/E6iOQgSD9axKUEqQQSCDkEdq1o1nSd+nYunUcGdVRWfYX/ngRyECQD860K9inUU1dHdGSkroKKKKsYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUABOKjllWGMs5wBRNKsMZZzgCsC8vHupMnhB90Vz166przM6lRQQt5ePcyZPCD7oqtRRXjyk5NtvU4ZScndhRRRUiCiiimAoJQggkEHII7VtWGoJPiKQgS/z96wZZRGPfsKq+Y3mBwxDA5BHBFb0KrpvyNac3BncUVl6Vqou1EUpAmA/76rUr14TU1dHbFpq6CiiirGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAE4qOWVYYyznAFE0qwxlnOAKwby8e5kyeEH3RXPXrqmvMzqVFBCXl411Jk8ID8oqvRRXjyk5NtvU4ZScndhRRRUiCiiimAUySURj3PQUSSiMe/YVUdy5JPWmlcaQO5cknqaSiiqGKjsjhlJDKcgjjFb9vq1y0CE2ryHH3h3qjpWlNduJZQRCD/31/8AWrpUjVFCqAAOgFd2GpzSbTsdFKErb2H0UUV6B0hRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAE4qOWVYYyznAFE0qwxlnOAKwby8a5kyeEB+UVz166przM6lRQQl5eNdSZPCD7oqvRRXjyk5NtvU4ZScndhRRRUiCiiimAUyWURj3PQUSyCMe56CqjuXJJ600rjSB3Lkk9TSUUVQwrS0rSmu2EsoIhH/j3/1qNK0o3biSUEQj/wAe/wDrV0qIqIFUYUdhXZh8Pze9I3p076sVVVECqAFHAA7U6iivSOoKKKKACiiigAqvPdxW2BI3J6AU29vFtI8nlj0FYUsrzSF3OWNclfEqnotWY1KvJotzpVYMoIOQe9OrCsb425EchJjP/jtbisGUEEEGtaNVVFdblwmpq6FooorYsKKKKACiiigAooooAKKKKACiiigAJxUcsqwxlnOAKJpVhjLOcAVgXl411Jk8IPuiuevXVJeZnUqKCFvLx7mTJ4QdFqtRRXjyk5NtvU4ZScndhRRRUiCiiimAUySURj37CiWQRj3PQVUdy5JPU00rjSB3Lkk9aSiiqGFaWlaU124llBEI/Dd/9ajStKN2wklBEI/8e/8ArV0qIqKFUYUcACuzD4fm96RvTp31ewqoqIFUAKBgAU6iivSOoKKKKACiiigAqreXq2seTgsegovbxbWPJ5Y9BWFLK80hdzljXHiMQqa5Y7mNWry6LcSWVppC7nLGmUUV5Tbbuzjbvqwq9Y3xtyI5DmM/+O1Roq6dRwd0OMnF3R1SsGUFSCDS1g2N8bchJCTGf/Ha3VYMoIIIPpXsUayqK6O6E1NXQtFFFbFhRRRQAUUUUAFFFFAATio5ZVhjLOcAUTSrDGWc4ArBvLx7mTJ4QfdFc9euqS8zOpUUEF5eNcyZPCD7oqtRRXjyk5Nt7nDKTk7sKKKKkQUUUUwCmSSCMe56CiSURj37CqjuXJJ6mmlcaQO5cknrSUUVQwrS0rSmu3EsoIhH4bv/AK1GlaUbtxJKCIR/49/9aulRFRAqgADsK7MPh+b3pG9OnfV7CqiogVQAoGAB2p1FFekdQUUUUAFFFFABVW9vVtI8nlj0FF7eLax5OCx6CsKWVppC7nLGuPEYhU1yx3MatXl0W4ksrzSF3OWNMoorym23dnG3fVhRRRQIKKKKACr1jfG3ISQkxn/x2qNFXTqODuioycXdHVKwZQQcg0tYVjfG3IjkOY//AEGtxWDqGUgg969ijWVRXR3Qmpq6FooorYsKKKKAAnFRyyrDGWc4AomlWGMs5wBWBeXjXUmTwg+6K569dU15mdSooILy8a6kyeEH3RVeiivHlJybbepwyk5O7CiiikIKKKKACmSyCMe56CiSURj37CqjuXJJ600rjSB3Lkk9TSUUVQwrS0rSmuyJZQRCP/Hv/rUaVpRu3EkoIhH/AI9/9aulRFRAqjCjsK7MPh+b3pG9OnfViqiooVQAoGAB2p1FFekdQUUUUAFFFFABRRRQBz99BLDJulYuD/FVSunliWaMo4yDWBeWbWsmDyh+63+e9eVicO4PmWqOOrTcXdbFeiiiuMwCiiigAooooAKKKKACr1jfG3ISQ5jP/jtUaKunUcHdFRk4u6OqVgwyDkGlrCsb427BJCTGf/Ha3FYMoKkEGvYo1lUV0d0JqauhScVHLKsMZZzgCiaVIYyznAFYF5eNdSZPCD7oqa9dU15iqVFBC3l49zJk8IOi1Woorx5Scm23qcMpOTuwoooqRBRRRTAKZJKIx79hRJIIx79hVR3Lkk9TTSuNIHcuST1NJRRVDCtLStKa7cSygiEfhu/+tRpWlG7YSSgiEf8Aj3/1q6VEVFCqMKOABXZh8Pze9I3p076sVUVECqAFAwAKdRRXpHUFFFFABRRRQAUUUUAFFFFABUcsSzRlWGQakFFJpNWYNXOdvLNrSTByUPRqrV08sSTRlHGQawbyza0kweUJ+Vq8rE4Z03zR2OOrS5dVsVqKKK5DAKKKKACiiigAooooAKliuZoRiOQgenWoqKcZNO6dhptaoklnkmOZHLY6egqOiihycndg23qwooopCCiiigApkkojHv2FEsgjHv2FVHcuST1NNK40gdy5JPWkooqhhWlpWlNduJZQRCPw3f8A1qNK0o3biSUEQj/x7/61dKiKihVGAOwrsw+H5vekb06d9XsKiKiBVACgYAFOoor0jqCiiigAooooAKKKKACiiigAooooAKKKKACo5YlmjKsMg1JRSaTVmDVznbyza0kweUP3W/z3qtXTyxJNGUcZBrBvLNrSTByUPRq8rE4Z03zR2OOrS5dVsVqKKK5DAKKKKACiiigAooooAKKKKACiiigApkkgjHv2FEkojHv2FVHcuST1NNK40gdy5JPWkooqhhWlpWlNduJZQRCPw3f/AFqNK0o3biSUEQj/AMe/+tXSoiogVRhRwAK7MPh+b3pG9OnfViqiogVQAoGAB2p1FFekdQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABUcsSzRlXGQakopNJqzB6nO3lm1pJg8oT8rVWrp5YkmjKOMg1g3lm1pJg8oejf5715WJwzpvmjscdWly6rYrUUUVyGAUUUUAFFFFABRRRQAUySQRj37CiSURj37CqjuXJJ600rjSB3Lkk9aSiiqGFaWlaU124llBEI/Dd/8AWo0rSjduJJRiEf8Aj3/1q6VEVECqMKOwrsw+H5vekb06d9WKqKiBVACgYAFOoor0jqCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqOWJZoyrjINSUUmk1Zg9Tnbyza1kwclD0aq1dPLEk0ZRxkGsG8s2tJMHlCflavKxOGdN80djjq0uXVbFaiiiuQwCiiigApkkojHv2FEkgjHv2FVHcuST1ppXGkDuXJJ6mkooqhhWlpWlNduJZQRCPw3f/Wo0rSjduJJQRCP/AB7/AOtXSoiogVQAo4wK7MPh+b3pG9OnfVioiogVQAoGABTqKK9I6gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqOWJZoyrDINSUUmk1Zg1c528s2tJMHlD0aq1dPLEk0ZVxkGsG+s2syWOWj7EDpXl4jDOD5o7HHUpOOq2K1MklWNffsKje57IPxNVySTknJrkS7mNhXcuST1pKKKoYVpaVpTXbiWUEQg/8AfX/1qdpmjPcsslwCsQ6A9W/+tXSIqogVQAo4AFduHw9/ekdFOlfVgqKiBVACgYAHanUUV6J0hRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFIVDAggEHsaWigDLuNCtZiWQGNj/d6flVJ/DcmfknUj3GK6GisZYenJ3aM3Ti+hgR+G3z+8nAH+yKv2uj21sQ23e4/ibmtCiiNCEXdIapxWyCiiitiwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==';
    const htmlContent = `
            <div style="padding: 100px; text-align: center;">
                <div style="margin-top: 20px;">
                    <p style="padding-bottom: 20px; font-size: 24px; color: ${
                      colors.gray1
                    }; border-bottom: 4px solid #54b6ff;">
                        ${trans('Your payment has been confirmed')}
                    </p>
                </div>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${data?.resident?.name.toUpperCase()}
                </p>
                <div style="display: flex; justify-content: center;">
                    <img src="${imageBase64Data}" alt="" style="width: 200px; height: 200px;" />
                </div>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${data?.paymentType?.name} ${
      data?.amount
    } (${moment().format('MMMM YYYY')})
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${trans('We have received payment for')} ${
      data?.amount
    } ${trans('applied to the document dated')}
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${moment(data?.createdAt).format('YYYY-MM-DD')}
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${trans('Approval Number')}: ${
      data?.transactionNumber ?? 'N/A'
    }
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${trans('Transaction Number')}: ${
      data?.transactionNumber ?? 'N/A'
    }
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${trans('Expiration Date')}: ${moment(
      data?.expireDate,
    ).format('YYYY-MM-DD')}
                </p>
                <p style="font-size: 18px; margin-top: 20px; color: ${
                  colors.primary
                };">
                    ${trans('Payment Date')}: ${moment(
      data?.paymentDate,
    ).format('YYYY-MM-DD')}
                </p>
            </div>
        `;
    const customDirectory =
      Platform.OS == 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.DownloadDirectoryPath;
    const dirExists = await RNFS.exists(customDirectory);
    if (!dirExists) {
      await RNFS.mkdir(customDirectory); // Create the directory
    }
    const results: any = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: `Voucher-${moment(new Date()).format('DD-MMM-YYYY')}`,
      base64: true,
      directory: customDirectory,
    });

    console.log('results after print:', results);

    Alert.alert(trans('Success'), trans('PDF downloaded successfully!'));
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onDismiss} style={styles.pressableCont} />
      <View style={styles.mainCont}>
        <View style={styles.headerCont}>
          {titleHeader && <Text style={styles.title}>{titleHeader}</Text>}
        </View>
        <Text style={[styles.text, {marginTop: 60, color: colors.primary}]}>
          {data?.resident?.name}
        </Text>

        <Image
          source={require('../../assets/images/check.jpg')}
          style={{width: 100, height: 100, resizeMode: 'contain'}}
        />

        <Text style={[styles.text, {marginTop: 10, color: colors.primary}]}>
          {data?.paymentType?.name} {data?.amount}{' '}
          {`(${momentTimezone().format('MMMM YYYY')})`}
        </Text>
        <Text
          style={[
            styles.text,
            {marginTop: 10, color: colors.primary, textAlign: 'center'},
          ]}>
          {`${trans('We have received a payment for')} {data?.amount} ${trans('applied to the document dated')}`}
        </Text>
        <Text style={[styles.text, {color: colors.primary}]}>
          {momentTimezone(data?.createdAt).format('YYYY-MM-DD')}
        </Text>
        <Text style={[styles.text, {color: colors.primary}]}>
          {trans('Transaction Number:')} {data?.transactionNumber ?? 'N/A'}
        </Text>
        <Text
          style={[styles.text, {color: colors.primary, textAlign: 'center'}]}>
          {trans('Approval Number:')} {data?.approveNumber ?? 'N/A'}
        </Text>
        <Text style={[styles.text, {color: colors.primary}]}>
          {trans('Expiration Date:')}{' '}
          {momentTimezone(data?.expireDate).format('YYYY-MM-DD')}
        </Text>
        <Text style={[styles.text, {color: colors.primary}]}>
          {trans('Payment Date:')} {momentTimezone(data?.paymentDate).format('YYYY-MM-DD')}
        </Text>
        <TouchableOpacity onPress={printPDF} style={styles.closeButton}>
          <Text
            style={[
              styles.text,
              {alignSelf: 'center', marginBottom: 0, fontWeight: '700'},
            ]}>
            {trans('Print')}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default VoucherComp;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableCont: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  mainCont: {
    width: width - 60,
    // height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    zIndex: 200,
    borderRadius: 10, // Optional: for rounded corners
    padding: 20, // Optional: for some inner spacing,
    borderWidth: 1,
  },
  headerCont: {
    width: '100%',
    // flexWrap: "wrap",
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: colors.primary,
    position: 'absolute',
    top: 10,
  },
  title: {
    ...typographies(colors).montserratSemibold16,
    marginBottom: 10, // Space between title and log text
    color: colors.gray1,
  },
  text: {
    ...typographies(colors).montserratMedium13,
    marginBottom: 10, // Space between title and log text
    color: '#000000',
    // alignSelf: 'flex-start',
  },
  closeButton: {
    width: 110,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
