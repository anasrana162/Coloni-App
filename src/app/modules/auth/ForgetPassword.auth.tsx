import {KeyboardAvoidingView, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import Container from '../../layouts/Container.layout';
import SignInSVG from '../../assets/icons/SignInSVG.icon';
import {globalStyles} from '../../assets/global-styles/global.style.asset';
import {
  customPadding,
  customMargin,
} from '../../assets/global-styles/global.style.asset';
import TwoColorText from '../../components/core/TwoColorText.core.m';
import IconWithInput from '../../components/core/text-input/IconWithInput.core';
import EmailIcon from '../../assets/icons/Email.icon';
import Button from '../../components/core/button/Button.core';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import {useTranslation} from 'react-i18next';
import {showAlertWithOneAction} from '../../utilities/helper';
import userService from '../../services/features/users/user.service';
import {apiResponse} from '../../services/features/api.interface';
const ForgetPassword = () => {
  const navigation = useCustomNavigation<any>();
  const {t: trans} = useTranslation();
  const emailRef = useRef('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (emailRef.current) {
      setLoading(true);
      const result = await userService.forgotPassword({
        email: emailRef.current,
      });
      const {status, message, body} = result as apiResponse;
      setLoading(false);
      if (status) {
        navigation.navigate(screens.verifyPassword as never, {
          token: body?.token,
          email: emailRef.current,
        });
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
  };
  return (
    <Container showHeader={false} bottomTab={false}>
      <SignInSVG />
      <KeyboardAvoidingView style={globalStyles.flex1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{...customPadding(40, 16, 0, 16)}}
          keyboardShouldPersistTaps="always">
          <TwoColorText text1={trans('Forgot')} text2={trans('Password')} />
          <IconWithInput
            icon={<EmailIcon />}
            placeholder={trans('Email')}
            onChangeText={(text: string) => (emailRef.current = text)}
            style={{...customMargin(22, 0, 23)}}
            defaultValue={emailRef.current}
          />
          <Button
            text={trans('Submit')}
            onPress={handleSubmit}
            isLoading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ForgetPassword;
