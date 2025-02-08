import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {typographies} from '../../../assets/global-styles/typography.style.asset';
import {useTranslation} from 'react-i18next';
import GarbageArrivedServices from '../../../services/features/GarbageArrived/GarbageArrivedServices';
import {showAlertWithOneAction} from '../../../utilities/helper';
import {useTheme} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

interface GarbageArrivedProps {
  onDismiss: () => void;
  title: string;
}

const GarbageArrivedModal: React.FC<GarbageArrivedProps> = ({
  title,
  onDismiss,
}) => {
  const {t: trans} = useTranslation();
  const {colors} = useTheme() as any;
  const [loading, setLoading] = useState<boolean>(false);
  const handleGarbagePressed = async () => {
    const payload = {
      notify: true,
      sendTo: 'Private',
    };

    try {
      setLoading(true);
      const result = await GarbageArrivedServices.create(payload);
      const {status, message} = result;
      if (status) {
        console.log('Notification created successfully');
        // showAlertWithOneAction({
        //   title: trans('Success'),
        //   body: trans('Garbage arrival notification sent successfully.'),
        // });
        onDismiss();
        setLoading(false);
      } else {
        setLoading(false);
        console.error('Failed to create notification:', message);
        showAlertWithOneAction({
          title: trans('Notification Error'),
          body: message,
        });
      }
    } catch (error) {
      setLoading(false);

      console.error('Error creating notification:', error);
      showAlertWithOneAction({
        title: trans('Notification Error'),
        body: trans('Failed to create notification'),
      });
    }
  };

  return (
    <View style={styles.overlay}>
      <Pressable
        onPress={onDismiss}
        style={{...styles.background, backgroundColor: colors.white}}
      />
      <View style={{...styles.container, borderBlockColor: colors.black}}>
        <Text
          style={{
            ...styles.title,
            ...typographies(colors).ralewayBold18,
            color: colors.tertiary,
          }}>
          {title}
        </Text>
        <Text
          style={{
            ...styles.paragraph,
            ...typographies(colors).ralewayMedium12,
            color: colors.primary,
          }}>
          {trans(
            'Notify Residents that garbage collection service has arrived?',
          )}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onDismiss}
            style={{...styles.button, backgroundColor: colors.graySoft}}>
            <Text
              style={{
                ...typographies(colors).ralewayBold15,
                color: colors.black,
              }}>
              {trans('No')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGarbagePressed}
            disabled={loading}
            style={{...styles.button, backgroundColor: colors.primary}}>
            {loading ? (
              <ActivityIndicator color={'white'} size={'small'} />
            ) : (
              <Text
                style={{
                  ...typographies(colors).ralewayBold15,
                  color: colors.white,
                }}>
                {trans('Confirm')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GarbageArrivedModal;

const styles = StyleSheet.create({
  overlay: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1000,
  },
  background: {
    // backgroundColor: 'blue',
    // width: width,
    // height: height,
    // position: 'absolute',
  },
  container: {
    borderWidth: 1,
    backgroundColor: 'white',
    width: width - 80,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    // shadowColor: 'black',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    //elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    textAlign: 'center',

    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '45%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,
    marginTop: 10,
  },
});
