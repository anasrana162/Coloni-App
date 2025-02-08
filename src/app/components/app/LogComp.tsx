import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors} from '../../assets/global-styles/color.assets';
import moment from 'moment';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');

interface LogCompProps {
  data?: any; // Consider specifying a more precise type if possible
  onDismiss?: () => void;
  titleHeader?: string;
}

const LogComp: React.FC<LogCompProps> = ({
  data = [],
  onDismiss,
  titleHeader,
}) => {
  console.log('Log Data in Log Comp:', data);
  const date = new Date(data?.createdAt || '');
  const {t: trans} = useTranslation();

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(
    minutes,
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Pressable onPress={onDismiss} style={styles.pressableCont} />
      <View style={styles.mainCont}>
        <View style={styles.headerCont}>
          {titleHeader && <Text style={styles.title}>{titleHeader}</Text>}
        </View>
        {data == undefined || data?.length == 0 ? (
          <Text
            style={[
              styles.text,
              {
                marginTop: 60,
                ...typographies(colors).montserratMedium13,
                color: colors.primary,
                alignSelf: 'center',
              },
            ]}>
            {trans('There is no data to Display')}
          </Text>
        ) : (
          <>
            <Text style={[styles.text, {marginTop: 60}]}>
            {`${trans('Time')} : ${formattedTime}`}
            </Text>
            <Text style={[styles.text, {}]}>{`${trans('Status')} : ${trans('Approved')}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('Amount')} : ${data?.amount}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('Date')} : ${moment(data?.date).format('DD/MM/YYYY')}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('F.Payment')} : ${moment(data?.income?.paymentDate).format('DD/MM/YYYY')}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('F.Expires')} : ${moment(data?.income?.expireDate).format('DD/MM/YYYY')}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('Resident Name')} : ${data?.resident?.name}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('Note')} : ${data?.income?.note}`}</Text>
            <Text style={[styles.text, {}]}>{`${trans('Device')} : ${data?.resident?.device?.deviceName}`}</Text>
          </>
        )}
        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
          <Text style={[styles.text, {alignSelf: 'center', marginBottom: 0}]}>
            {trans('Close')}
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogComp;

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    zIndex: 200,
    borderRadius: 10,
    padding: 20, 
    borderWidth: 1,
  },
  headerCont: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
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
    alignSelf: 'flex-start',
  },
  closeButton: {
    width: 110,
    height: 40,
    backgroundColor: colors.gray1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
