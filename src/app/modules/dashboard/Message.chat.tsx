import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {inputLeftIconProps} from '../../types/components.interface';
import {colors} from '../../assets/global-styles/color.assets';
import SendMessageIcon from '../../assets/icons/SendMessage.icon';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {customPadding} from '../../assets/global-styles/global.style.asset';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {getHexaOpacityColorCode} from '../../utilities/helper';

const ChatMessage: React.FC<inputLeftIconProps> = ({
  onChangeText,
  handleSendMessage,
  message,
  defaultValue = '',
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
      <TextInput
          style={styles.input}
          numberOfLines={1}
          onChangeText={onChangeText}
          placeholder={'Write your message'}
          selectionColor={colors.primary}
          placeholderTextColor={getHexaOpacityColorCode(colors.black, 0.7)}
          value={message}
        />
        <TouchableOpacity activeOpacity={0.7} onPress={handleSendMessage}>
          <SendMessageIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.transparent,
    backgroundColor: colors.graySoft,
    ...customPadding(0, 11, 0, 11),
    height: rs(42),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainContainer: {
    ...customPadding(20, 13, 30, 13),
    backgroundColor: colors.primary,
    borderTopColor: colors.gray3,
    borderTopWidth: 1,
  },
  input: {
    ...typographies(colors).ralewayMedium12,
    color: colors.black,
    flexShrink: 1,
    width: '100%',
  },
});
