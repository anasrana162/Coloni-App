import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Container from '../../layouts/Container.layout';
import SignInSVG from '../../assets/icons/SignInSVG.icon';
import TwoColorText from '../../components/core/TwoColorText.core.m';
import {
  customMargin,
  customPadding,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import IconWithInput from '../../components/core/text-input/IconWithInput.core';
import EmailIcon from '../../assets/icons/Email.icon';
import PasswordInput from '../../components/core/text-input/PasswordInput.core';
import RectangleIcon from '../../assets/icons/Rectangle.icon';
import ClickableText from '../../components/core/ClickableText.core.component';
import {loginStyles as styles} from './login.styles';
import Button from '../../components/core/button/Button.core';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';
import Done from '../../assets/images/svg/checkDone.svg';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {useTheme} from '@react-navigation/native';
import useLogin from './hooks/useLogin.hook';

const Login = () => {
  const navigation = useCustomNavigation<any>();
  const {colors} = useTheme() as any;
  const {
    trans,
    usernameInputRef,
    passwordInputRef,
    handleLogin,
    isLoading,
    onChangeValue,
    check,
    setCheck,
  } = useLogin();
  return (
    <Container showHeader={false} bottomTab={false}>
      <SignInSVG />
      <KeyboardAvoidingView style={globalStyles.flex1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          style={{...customPadding(40, 16, 0, 16)}}>
          <TwoColorText text1={trans('Come On')} text2={trans('Sign in')} />
          <IconWithInput
            icon={<EmailIcon />}
            placeholder={trans('Username')}
            style={{...customMargin(22)}}
            inputRef={usernameInputRef}
            name={'username'}
            onChangeText={onChangeValue}
            inputProps={{
              returnKeyType: 'next',
              blurOnSubmit: false,
              autoCapitalize: 'none',
              onSubmitEditing: () => passwordInputRef.current?.focus(),
            }}
          />
          <PasswordInput
            placeholder={trans('Password')}
            inputRef={passwordInputRef}
            name={'password'}
            onChangeText={onChangeValue}
            inputProps={{
              returnKeyType: 'go',
            }}
            style={{...customMargin(22)}}
          />
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setCheck(!check)}
              style={styles.innerContainer}>
              {check ? (
                <Done height={rs(17)} width={rs(21)} fill={colors.primary} />
              ) : (
                <RectangleIcon />
              )}
              <ClickableText
                text={trans('Remember Me')}
                onPress={() => setCheck(!check)}
              />
            </TouchableOpacity>
            <ClickableText
              text={trans('Forgotten password')}
              onPress={() =>
                navigation.navigate(screens.forgetPassword as never)           // forget
              }
            />
          </View>
          <Button
            isLoading={isLoading}
            text={trans('Login')}
            onPress={handleLogin}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Login;
