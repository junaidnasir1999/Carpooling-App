import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';

import colors from '../../theme/colors';
import Input from '../../components/Input';
import ChatHeader from '../../components/ChatHeader';

const ChatScreen = ({navigation, route}) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatExists, setChatExists] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('');
  const [readByIds, setReadByIds] = useState([]);
  const [typing, setTyping] = useState(false);
  const [messageSendingLoading, setMessageSendingLoading] = useState(false);
  const [deletedFor, setDeletedFor] = useState({});
  const [blockedBy, setBlockedBy] = useState([]);
  const [keyboardShow, setKeyboardShow] = useState();

  const {data} = useSelector(state => state.authData);
  const {fcm_token, otheruser_id, otheruser_name, otheruser_profile_image} =
    route.params;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  console.log('Keyboard Show ----> ', keyboardShow);

  // This UseEffect makes the typing status either true or false based on if the messageText state is true or false LLLLLLLLLLLLLLLL
  useEffect(() => {
    const chatRef = database().ref(`/chats/${currentChatId}`);

    if (!messageText) {
      chatRef.update({
        typing: false,
      });
    } else if (messageText.length === 1) {
      chatRef.update({
        typing: data.id,
      });
    }
  }, [messageText]);

  useEffect(() => {
    database()
      .ref(`/chats/${data.id}_${otheruser_id}`)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          const resultedData = snapshot.val();

          setCurrentChatId(`${data.id}_${otheruser_id}`);
          setDeletedFor(resultedData.deletedFor);
          setChatExists(true);
          setMessages(resultedData.messages);
          setReadByIds(resultedData.readBy);
          setTyping(resultedData.typing);
          resultedData.blockedBy
            ? setBlockedBy(resultedData.blockedBy)
            : setBlockedBy([]);
        } else {
          database()
            .ref(`/chats/${otheruser_id}_${data.id}`)
            .on('value', snapshot => {
              if (snapshot.exists()) {
                const resultedData = snapshot.val();

                setCurrentChatId(`${otheruser_id}_${data.id}`);
                setDeletedFor(resultedData.deletedFor);
                setChatExists(true);
                setMessages(resultedData.messages);
                setReadByIds(resultedData.readBy);
                setTyping(resultedData.typing);
                resultedData.blockedBy
                  ? setBlockedBy(resultedData.blockedBy)
                  : setBlockedBy([]);
              }
            });
        }
      });
  }, []);

  // This useEffect checks whether the message is being seen or not
  useEffect(() => {
    messageSeen();
  }, [chatExists, messages]);

  // This function checks whether the readBy array includes data.id and if not, it adds it in that array
  const messageSeen = () => {
    const chatRef = database().ref(`/chats/${currentChatId}`);

    if (chatExists) {
      chatRef.on('value', snapshot => {
        const readByIdsArray = snapshot.val().readBy;

        if (!readByIdsArray.includes(data?.id)) {
          const readByRef = database().ref(`/chats/${currentChatId}/readBy`);
          readByRef.set([...readByIdsArray, data?.id]);
        }
      });
    }
  };

  // This function renders the message
  const renderMessages = ({item, index}) => {
    if (item.messageTime >= deletedFor[data.id]) {
      return (
        <View key={index} style={styles.messageContainer}>
          <View
            style={[
              styles.message,
              item.senderId === data.id
                ? styles.messageByMe
                : styles.messageByOther,
            ]}>
            <Text style={styles.messageText}>{item.messageText}</Text>
            <Text style={styles.time}>
              {new Date(item.messageTime).toLocaleString()}
            </Text>
          </View>

          {item.senderId === data.id &&
            index === 0 &&
            readByIds.includes(otheruser_id) && (
              <Text style={styles.seenMessage}>seen</Text>
            )}

          {item.senderId === data.id &&
            index === 0 &&
            !readByIds.includes(otheruser_id) && (
              <Text style={styles.seenMessage}>sent</Text>
            )}
        </View>
      );
    }
  };

  // This function starts the chat if the chat does not exist already
  const startChat = ({
    videoUrl = null,
    imageUrl = null,
    thumbnailUrl = null,
  } = {}) => {
    const chatRef = database().ref(`/chats/${data.id}_${otheruser_id}`);

    chatRef
      .set({
        chatId: `${data.id}_${otheruser_id}`,
        ids: [`${data.id}`, `${otheruser_id}`],
        lastMessageTime: new Date().getTime(),
        readBy: [data.id],
        lastMessage: {
          text: messageText,
          senderId: data.id,
        },
        deletedFor: {
          [data.id]: new Date().getTime(),
          [otheruser_id]: new Date().getTime(),
        },
        blockedBy: [],
        messages: [
          {
            messageText: messageText,
            senderId: data.id,
            messageTime: new Date().getTime(),
          },
        ],
      })
      .then(() => {
        setMessageSendingLoading(false);
        setMessageText('');

        // code for sending notifications of message
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'key=AAAA6gSE8vA:APA91bFHXdjuqYnPtzSSlsoNFv4oECyGYtNPG8KEW7Is4R_PS6XbGEzKUSIdfbpyz_r4QTCvY-n2NEBsIRA9HkmBNxFn6mXwvkb0bzTMo5iFe_ZeUuWnnZ8G8kPk0UxGexdBdz1vNffd',
          },
          body: JSON.stringify({
            to: fcm_token,
            notification: {
              title: 'A New Message',
              body: `${data.name} has sent you a message!`,
            },
          }),
        }).then(() => console.log('message notification sent'));
      })
      .catch(() => {
        setMessageSendingLoading(false);
        console.log('Something went wrong while starting the chat');
      });
  };

  // This function sends the message if the chat already exists
  const sendMessage = async ({
    videoUrl = null,
    imageUrl = null,
    thumbnailUrl = null,
  } = {}) => {
    const chatRef = database().ref(`/chats/${currentChatId}`);

    try {
      const updatedChat = {
        lastMessageTime: new Date().getTime(),
        readBy: [data.id],
        lastMessage: {
          text: messageText,
          senderId: data.id,
        },
        messages: [
          {
            messageText: messageText,
            senderId: data.id,
            messageTime: new Date().getTime(),
          },
          ...messages,
        ],
      };

      await chatRef.update(updatedChat);

      console.log('Message sent successfully');
      setMessageSendingLoading(false);
      setMessageText('');

      const otherUserId = readByIds.filter(id => id !== data.id);

      if (!readByIds.includes(otherUserId[0])) {
        // code for sending notifications of message
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'key=AAAA6gSE8vA:APA91bFHXdjuqYnPtzSSlsoNFv4oECyGYtNPG8KEW7Is4R_PS6XbGEzKUSIdfbpyz_r4QTCvY-n2NEBsIRA9HkmBNxFn6mXwvkb0bzTMo5iFe_ZeUuWnnZ8G8kPk0UxGexdBdz1vNffd',
          },
          body: JSON.stringify({
            to: fcm_token,
            notification: {
              title: 'A New Message',
              body: `${data.name} has sent you a message!`,
            },
          }),
        }).then(() => console.log('message notification sent'));
      }
    } catch (error) {
      setMessageSendingLoading(false);
      console.error('Something went wrong while sending message:', error);
    }
  };

  // This function executes the startChat function if the chat does not exist already and
  // and executes the sendMessage function if the chat already exists with a specific chatId
  const onSend = async () => {
    if (!chatExists) {
      try {
        if (messageText) {
          setMessageSendingLoading(true);
          startChat();
        } else {
          Alert.alert('You can not send an empty message');
        }
      } catch (error) {
        console.error(error);
        setMessageSendingLoading(false);
        Alert.alert('Failed to send message. Please try again.');
      }
    } else {
      try {
        if (messageText) {
          setMessageSendingLoading(true);
          sendMessage();
        } else {
          Alert.alert('You can not send an empty message');
        }
      } catch (error) {
        console.error(error);
        setMessageSendingLoading(false);
        Alert.alert('Failed to send message. Please try again.');
      }
    }
  };

  // This function blocks the user and add it the user's id that is (data.id) in blockedBy array
  const onBlockPress = () => {
    const blockedByPropertyRef = database().ref(
      `/chats/${currentChatId}/blockedBy`,
    );
    blockedByPropertyRef.set([...blockedBy, data.id]);
  };

  // This function removes the user's id from the blockedBy array
  const onUnblockPress = () => {
    const chatRef = database().ref(`/chats/${currentChatId}`);
    chatRef.update({
      blockedBy: blockedBy.filter(each => each !== data.id),
    });
  };

  // This function cause the chats to be deleted for a specific user
  const onDeletePress = () => {
    const deletedForPropertyRef = database().ref(
      `/chats/${currentChatId}/deletedFor`,
    );
    const lastMessagePropertyRef = database().ref(
      `/chats/${currentChatId}/lastMessage`,
    );
    deletedForPropertyRef.set({
      [otheruser_id]: deletedFor[otheruser_id],
      [data.id]: new Date().getTime(),
    });
    lastMessagePropertyRef.set({
      text: '',
    });
  };

  // const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.chatHeaderContainer}>
        <ChatHeader
          blocked={blockedBy.includes(data.id) ? true : false}
          onUnblockPress={onUnblockPress}
          onBlockPress={onBlockPress}
          onDeletePress={onDeletePress}
          onBackPress={() => navigation.goBack()}
          name={otheruser_name}
          image={otheruser_profile_image}
        />
      </View>
      <View style={styles.messagesContainer}>
        <FlatList data={messages} renderItem={renderMessages} inverted={true} />
        {typing === otheruser_id ? (
          <View style={styles.lottieCont}>
            <AnimatedLottieView
              source={require('../../assets/animations/typing-lottie.json')}
              autoPlay
              loop
              style={{width: '100%', height: '100%'}}
            />
          </View>
        ) : null}
      </View>
      {blockedBy.includes(data.id) ? (
        <Text style={styles.blockText}>You have blocked this User</Text>
      ) : blockedBy.includes(otheruser_id) ? (
        <Text style={styles.blockText}>You have been blocked</Text>
      ) : Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={60} style={styles.messageInputContainer}>
          <View style={{width: '85%', borderRadius: 50}}>
            <Input
              placeholder={'Write your message'}
              value={messageText}
              onChangeText={changedText => setMessageText(changedText)}
              style={styles.messageInput}
            />
          </View>

          <TouchableOpacity
            disabled={messageSendingLoading}
            activeOpacity={0.6}
            onPress={onSend}
            style={styles.sendBtn}>
            <Feather name="send" size={25} color={colors.themeBlue} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.messageInputContainer}>
          <View style={{width: '85%', borderRadius: 50}}>
            <Input
              placeholder={'Write your message'}
              value={messageText}
              onChangeText={changedText => setMessageText(changedText)}
              style={styles.messageInput}
            />
          </View>

          <TouchableOpacity
            disabled={messageSendingLoading}
            activeOpacity={0.6}
            onPress={onSend}
            style={styles.sendBtn}>
            <Feather name="send" size={25} color={colors.themeBlue} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  cross: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  crossIcon: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 30,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 30,
  },
  option: {
    padding: 15,
    fontSize: hp('3%'),
    color: 'black',
  },
  image: {
    width: '90%',
    height: hp('40%'),
    backgroundColor: 'lightyellow',
    margin: 10,
    borderRadius: 30,
  },
  messageImage: {
    width: '90%',
    height: hp('40%'),
    backgroundColor: 'lightyellow',
    margin: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headingText: {
    color: 'black',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginLeft: 15,
  },
  chatHeaderContainer: {
    position: 'absolute',
    // top: 28,
    top: 5,
    width: '100%',
    zIndex: 30,
  },
  otherUserMessage: {
    backgroundColor: colors.themeBlack,
    padding: 15,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginHorizontal: 25,
    marginTop: 60,
  },
  yourMessage: {
    backgroundColor: colors.themeBlue,
    padding: 15,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginHorizontal: 25,
    marginTop: 10,
  },
  messagesContainer: {
    width: '100%',
    paddingTop: hp('12%'),
    flex: 1,
  },
  messageInputContainer: {
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 30,
    marginBottom: 6,
  },
  messageInput: {
    width: '105%',
    color: 'black',
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 15,
    overflow: 'hidden',
    marginLeft: -5,
  },
  sendBtn: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.themeBlack,
    alignSelf: 'flex-end',
  },
  messageByOther: {
    width: wp('70%'),
    backgroundColor: colors.themeBlue,
    borderRadius: 10,
    alignSelf: 'flex-start',
    margin: 10,
  },
  messageByMe: {
    width: wp('70%'),
    backgroundColor: colors.themeBlack,
    alignSelf: 'flex-end',
    borderRadius: 15,
    margin: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: hp('2.2%'),
    color: 'white',
    padding: 15,
  },
  time: {
    color: 'lightgrey',
    marginLeft: 12,
    marginBottom: 3,
    fontSize: hp('1.7%'),
  },
  lottieCont: {
    width: '20%',
    height: hp('6%'),
    paddingLeft: wp('5%'),
  },
  seenMessage: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: -5,
    marginBottom: 10,
  },
  blockText: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: hp('2.2%'),
    color: 'grey',
    marginVertical: 15,
  },
});
