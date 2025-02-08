import {KeyboardAvoidingView, ScrollView, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import SignInSVG from '../../assets/icons/SignInSVG.icon';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {
  customPadding,
  customMargin,
} from '../../assets/global-styles/global.style.asset';
import TwoColorText from '../../components/core/TwoColorText.core.m';
import Button from '../../components/core/button/Button.core';
import PasswordInput from '../../components/core/text-input/PasswordInput.core';
import {useTranslation} from 'react-i18next';
import {screens} from '../../routes/routeName.route';
import {useCustomNavigation} from '../../packages/navigation.package';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
import {showAlertWithOneAction} from '../../utilities/helper';
import {authEndPoint} from '../../services/features/otherEndPoint.api';
import axios from 'axios';
import {colors} from '../../assets/global-styles/color.assets';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {TouchableOpacity} from 'react-native-gesture-handler';

const VerifyPassword: React.FC<{
  route: {params: {token: string; email: string}};
}> = ({
  route: {
    params: {token, email},
  },
}) => {
  const {t: trans} = useTranslation();
  const navigation = useCustomNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [values, setValues] = useState<{
    confirmPin: string;
    pin: string;
    OTP: string;
  }>({
    confirmPin: '',
    pin: '',
    OTP: '',
  });

  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes in seconds
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generatePinandUser();
    // Start timer when OTP is sent
    startTimer();
    setUserEmail(email);
    // Cleanup on unmount
    return () => clearInterval(timerRef.current!);
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setOtpSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (values.confirmPin && values.pin) {
      if (values.confirmPin === values.pin) {
        setLoading(true);
        const result = await userService.resetPassword(values);
        const {status, message} = result as apiResponse;
        setLoading(false);
        if (status) {
          navigation.navigate(screens.login as never);
        } else {
          showAlertWithOneAction({
            title: trans('Reset Password'),
            body: message,
          });
        }
      } else {
        showAlertWithOneAction({
          title: trans('Reset Password'),
          body: trans('Password not match!'),
        });
      }
    } else {
      showAlertWithOneAction({
        title: trans('Reset Password'),
        body: trans('Invalid Input!'),
      });
    }
  };

  const generatePinandUser = async () => {
    try {
      const resp = await axios.get(authEndPoint.generatePinandUser);
      console.log('Resp:', resp?.data);
      if (resp?.data?.success) {
        setValues({
          ...values,
          pin: resp?.data?.pin,
          confirmPin: resp?.data?.pin,
        });
        setOtpSent(true); // Mark OTP as sent
      } else {
        return 'error';
      }
    } catch (error: any) {
      console.log('fetching pin and username error:', error?.response.data);
      return 'error';
    }
  };

  const handleResendOTP = async () => {
    if (userEmail) {
      setLoading(true);
      const result = await userService.forgotPassword({
        email: userEmail,
      });
      const {status, message, body} = result as apiResponse;
      setLoading(false);
      if (status) {
        generatePinandUser();
        setOtpTimer(120);
        startTimer();
      } else {
        showAlertWithOneAction({
          title: trans('Forgot Password'),
          body: message,
        });
      }
    } else {
      showAlertWithOneAction({
        title: trans('Forgot Password'),
        body: trans('Email is required!'),
      });
    }
    // if (!otpSent) {

    // }
  };

  return (
    <Container showHeader={false} bottomTab={false}>
      <SignInSVG />
      <KeyboardAvoidingView style={globalStyles.flex1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{...customPadding(40, 16, 0, 16)}}
          keyboardShouldPersistTaps="always">
          <TwoColorText text1={trans('Forget')} text2={trans('Password')} />
          <PasswordInput
            placeholder={trans('OTP Code')}
            inputProps={{secureTextEntry: true}}
            style={{...customMargin(15, 0, 10)}}
            maxLength={6}
            secureTextEntry={true}
            hideIcons={true}
            onChangeText={(text: string) => setValues({...values, OTP: text})}
            defaultValue={values.OTP}
          />

          <Text
            style={{
              ...typographies(colors).ralewayBold15,
              alignSelf: 'flex-end',
            }}>{`${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(
            2,
            '0',
          )}`}</Text>

          <PasswordInput
            placeholder={trans('Pin')}
            inputProps={{secureTextEntry: false}}
            style={{...customMargin(15, 0, 10)}}
            hideIcons={true}
            secureTextEntry={false}
            editable={false}
            onChangeText={(text: string) => setValues({...values, pin: text})}
            defaultValue={values.pin}
          />
          <PasswordInput
            inputProps={{secureTextEntry: false}}
            placeholder={trans('Confirm Pin')}
            style={{...customMargin(0, 0, 21)}}
            hideIcons={true}
            secureTextEntry={true}
            editable={false}
            onChangeText={(text: string) =>
              setValues({...values, confirmPin: text})
            }
            defaultValue={values.confirmPin}
          />
          <Button
            text={trans('Submit')}
            onPress={handleSubmit}
            isLoading={loading}
          />

          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={otpSent}
            style={{
              width: 120,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                ...typographies(colors).montserratMedium13,
                fontWeight: '700',
                color: colors.tertiary,
              }}>
              {trans('Resend OTP')}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default VerifyPassword;
