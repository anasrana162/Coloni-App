import { ReactElement } from 'react';
import { KeyboardTypeAndroid, TextInputProps, TextStyle, ViewStyle } from 'react-native';

interface buttonProps {
  text: string;
  bgColor?: string;
  style?: ViewStyle;
  borderRadius?: number;
  textColor?: string;
  textStyle?: TextStyle;
  onPress?: () => void;
  icon?: any;
  isLoading?: boolean;
}
interface outlineButtonProps {
  text: string;
  borderColor?: string;
  style?: ViewStyle;
  borderRadius?: number;
  textColor?: string;
  textStyle?: TextStyle;
  isLoading?: boolean;
  activeOpacity?: number;
  onPress: () => void;
}
interface iconProps {
  width?: number;
  height?: number;
  fill?: string;
}

interface headerProps {
  text: string;
  leftIcon?: boolean;
  rightIcon?: any;
  leftControl?: () => void;
  rightControl?: () => void;
  showBg?: boolean;
  rightBg?: string;
  heading?: string;
  body?: string;
}
interface headerPropstwo {
  text: string;
  leftIcon?: boolean;
  rightIcon?: any;
  secondRightIcon?: any;
  leftControl?: () => void;
  rightControl?: () => void;
  secondRightControl?: () => void;
  showBg?: boolean;
  rightBg?: string;
  heading?: string;
  body?: string;
}

interface twoColorProps {
  text1: string;
  text2: string;
  color1?: string;
  color2?: string;
  style?: ViewStyle;
  light?: boolean;
}
interface inputLeftIconProps {
  icon?: any;
  placeholder?: string;
  onChangeText?: (
    value: any,
    name?: any,
    validationRules?: boolean | any | undefined,
  ) => void;
  defaultValue?: any;
  name?: string | any | undefined;
  validationRules?: () => boolean | undefined | any;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  rightIcon?: any;
  inputRef?: any;
  maxLength?: any;
  hideIcons?: any;
  secureTextEntry?: any;
  onEndEditing?: any;
  editable?: boolean;
  placeholderColor:string,
  keyboardType: KeyboardTypeAndroid,
  handleSendMessage?: any;  for chats
  message ?: string;  for chats
}
interface clickableTextProps {
  text: string;
  onPress: () => void;
  hasUnderline?: boolean;
  style?: TextStyle;
  wrpStyle?: ViewStyle;
  disabled?: boolean;
  color?: string;
}
interface tabOptionsInterface {
  icon: SVGElement;
  Component: ReactElement;
  name: string;
}
interface customSelectProps {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  data?: string[];
  onChange?: (props: any) => void;
  style?: ViewStyle;
  name?: string;
  isDataObject?: boolean;
  mainStyles?: ViewStyle
}
interface dateTimeInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: any;
  onChange?: (props?: Date, name: string) => void;
  style?: ViewStyle;
  name?: string;
  isReportActivity?:boolean

}
interface multilineProps {
  placeholder?: string;
  onChangeText?: (
    value: any,
    name?: any,
    validationRules?: boolean | any | undefined,
  ) => void;
  defaultValue?: string;
  name?: string | any | undefined;
  validationRules?: () => boolean | undefined | any;
  inputProps?: TextInputProps;
  placeholderTextColor?: string;
  label?: string;
  style?: ViewStyle;
  textInputStyle:any
}
export type {
  buttonProps,
  iconProps,
  headerProps,
  outlineButtonProps,
  twoColorProps,
  inputLeftIconProps,
  clickableTextProps,
  tabOptionsInterface,
  customSelectProps,
  multilineProps,
  dateTimeInputProps,
  headerPropstwo
};
