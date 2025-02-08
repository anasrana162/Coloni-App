import React, {useEffect, useState} from 'react';
import Container from '../../layouts/Container.layout';
import Header from '../../components/core/header/Header.core';
import CallIcon from '../../assets/icons/Call.icon';
import ImagePreview from '../../components/core/ImagePreview.core.component';
import imageLink from '../../assets/images/imageLink';
import rs from '../../assets/global-styles/responsiveSze.style.asset';
import {Keyboard, ScrollView, Text, View} from 'react-native';
import {typographies} from '../../assets/global-styles/typography.style.asset';
import {
  customPadding,
  customMargin,
  globalStyles,
} from '../../assets/global-styles/global.style.asset';
import {colors} from '../../assets/global-styles/color.assets';
import {chatStyles as styles} from './styles/chat.styles';
import ChatMessage from './Message.chat';
import {useCustomNavigation} from '../../packages/navigation.package';
import {screens} from '../../routes/routeName.route';

import {socketServerUrl} from '../../services/features/endpoint.api';
import {io} from 'socket.io-client';
import chatsService from '../../services/features/chats/chats.service';
import {customUseSelector} from '../../packages/redux.package';
import {userStates} from '../../state/allSelector.state';
import moment from 'moment';

const Chat: React.FC<{
  route: {
    params?: {
      id: string;
      name: string;
    };
  };
}> = ({
  route: {
    params: {id, name} = {
      id: '',
      name: '',
    },
  },
}) => {
  const navigation = useCustomNavigation();
  const [message, setMessage] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);

  const [socket, setSocket] = useState<any>({});
  var {userInfo} = customUseSelector(userStates);

  const handleOnChangeText = (text: any) => {
    setMessage(text);
  };

  useEffect(() => {
    const newSocket = io(socketServerUrl);
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    fetchChatHistory();
    return () => {
      newSocket.close();
    };
  }, [socketServerUrl, id]);

  useEffect(() => {
    if (Object.keys(socket).length > 0) {
      socket?.emit('joinRoom', {groupId: id}); // Join room based on user's email

      socket?.on('newMessage', (message: {sender: {_id: any}}) => {
        setMessages((prevChatHistory: any) => [...prevChatHistory, message]);
      });
    }
  }, [socket, id]);

  const fetchChatHistory = async () => {
    try {
      console.log(' userInfo?.accessKey', userInfo?.accessKey);
      let history = await chatsService.messagesList({
        groupId: id,
        Accesskey: userInfo?.accessKey,
      });
      setMessages(history?.messages);
    } catch (error) {
      console.log('Error in fetching mEssage History:', error);
    }
  };

  const handleSendMessage = () => {
    Keyboard.dismiss();
    const messageData = {
      senderUsername: userInfo?.clue,
      messageContent: message,
      accessKey: userInfo?.accessKey,
      groupId: id,
    };
    console.log('handleSendMessage ', messageData);
    // Send message via socket
    socket.emit('chatMessage', messageData);

    setMessage(''); // Clear message input
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    // Options for formatting
    const options: any = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    // Use toLocaleString to format the date
    return date.toLocaleString('en-US', options);
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // Compare dates
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return moment(timestamp).format('MM/DD/YYYY'); // Format to local date (e.g., MM/DD/YYYY)
    }
  };

  const displayedDates = new Set();
  return (
    <Container bottomTab={false}>
      <Header
        text={'Chat'}
        // rightIcon={<CallIcon />}
        // rightControl={() => navigation.navigate(screens.callPreview as never)}
      />
      <ScrollView
        contentContainerStyle={{paddingBottom: '30%'}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode="on-drag">
        {messages?.map((msg: any, index: number) => {
          const messageDate = formatMessageDate(msg?.timestamp);
          const shouldDisplayDate = !displayedDates.has(messageDate);

          if (shouldDisplayDate) {
            displayedDates.add(messageDate);
          }

          return (
            <View key={index}>
              {shouldDisplayDate && (
                <View
                  style={{
                    // width: 120,
                    // height: 30,
                    backgroundColor: colors.gray4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 20,
                    marginTop: 20,
                  }}>
                  <Text
                    style={[
                      typographies(colors).montserratNormal12,
                      {
                        textAlign: 'center',
                        marginVertical: 8,
                        color: colors.black,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      },
                    ]}>
                    {messageDate}
                  </Text>
                </View>
              )}
              <View
                style={
                  msg?.sender?.userId === userInfo?._id
                    ? styles.flexEnd
                    : styles.leftContainer
                }>
                {msg?.sender?.userId !== userInfo?._id && (
                  <ImagePreview
                    source={imageLink.profileImage}
                    styles={{height: rs(40), width: rs(40)}}
                    borderRadius={40}
                  />
                )}
                <View style={globalStyles.flexShrink1}>
                  {msg?.sender?.userId !== userInfo?._id && (
                    <Text
                      style={[
                        typographies(colors).montserratMedium13,
                        {...customMargin(12), color: colors.primary},
                      ]}>
                      {msg.sender?.name}
                    </Text>
                  )}
                  <Text
                    style={[
                      typographies(colors).montserratNormal12,
                      msg?.sender?.userId === userInfo?._id
                        ? styles.rightText
                        : styles.leftText,
                    ]}>
                    {msg?.message}
                  </Text>
                  {msg?.sender?.userId !== userInfo?._id && (
                    <Text
                      style={[
                        typographies(colors).montserratNormal12,
                        {
                          fontSize: 10,
                          alignSelf: 'flex-end',
                          marginTop: 2,
                          color: colors.gray1,
                        },
                      ]}>
                      {formatTimestamp(msg?.timestamp)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <ChatMessage
        onChangeText={handleOnChangeText}
        handleSendMessage={handleSendMessage}
        message={message}
      />
    </Container>
  );
};

export default Chat;
