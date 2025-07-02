import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  // FlatList,
  StyleSheet,
  Pressable,
  Image,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import CaseLoadInfoHeader from '../../components/molecules/CaseLoadInfoHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTimeString} from '../../utils/common';
import {
  conversationHistory,
  messageHistory,
  sendMessageServices,
} from '../../services/chatServices';
import {selectPatientData} from '../Dashboad/DashboadSlice';
import {PATHWAY_STATUS} from '../../utils/constant';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {selectOverViewData} from '../Casleoad/Overview/OverViewSlice';
import {FlashList} from '@shopify/flash-list';

const ChatMainScreen = ({route, navigation}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState(null);
  const [filedDisable, setFieldDisiable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // You can adjust the limit as needed
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const flatListRef = useRef();
  const overViewData = useSelector(selectOverViewData);
  let {id} = route?.params?.data;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [id, page]);

  const fetchMessages = async () => {
    if (loading || !hasMoreMessages) return;
    setLoading(true);
    try {
      UserDetails();
      const response = await messageHistory(id, page, limit);
      if (response.data.status === 200) {
        const newMessages = response.data.data;
        if (newMessages.length > 0) {
          const messages = newMessages;
          setMessages(prevMessages => [...prevMessages, ...messages]);
        } else {
          setHasMoreMessages(false);
          setLoading(false);
        }
        setLoading(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const UserDetails = async () => {
    let data = await AsyncStorage.getItem('userDetails');
    let user = JSON.parse(data);
    setUserData(user);
  };
  const {cardSelected} = useSelector(selectPatientData);

  const sendMessage = async () => {
    if (inputText.trim() !== '') {
      let headers = {
        'Content-Type': 'application/json',
      };
      let data = {
        content: inputText,
        conversationId: id,
      };
      let messageData = {
        content: inputText,
        conversationId: id,
        senderId: userData?.id,
        createdAt: new Date(),
      };

      try {
        setFieldDisiable(true);
        setMessages([messageData, ...messages]);
        const response = await sendMessageServices(data, headers);
        console.log('response', response.data);
        if (response.data.status === 200) {
          setInputText('');
          // setMessages([messageData, ...messages]);
          setFieldDisiable(false);
          // fetchMessages();
        }
      } catch (error) {
        setFieldDisiable(false);
      }
    }
  };
  // console.log('messages', messages);
  const backHandler = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  const renderMessageItem = ({item, index}) => {
    const isCurrentUser = item.senderId === userData?.id;
    const formatDate = dateString => {
      const date = new Date(dateString);
      const options = {day: '2-digit', month: 'short', year: 'numeric'};
      return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    const messageDate = formatDate(item.createdAt);
    const prevMessageDate =
      index > 0 ? formatDate(messages[index - 1].createdAt) : null;

    return (
      <View style={styles.messageWrapper}>
        {prevMessageDate !== messageDate && (
          <Text style={styles.dateText}>{messageDate}</Text>
        )}

        <View
          style={[
            styles.messageRow,
            {flexDirection: isCurrentUser ? 'row-reverse' : 'row'},
          ]}>
          {!isCurrentUser && (
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${item?.sender?.first_name}+${item?.sender?.last_name}&size=100`,
              }}
              style={styles.avatar}
            />
          )}
          <View
            style={[
              styles.messageContainer,
              {
                backgroundColor: isCurrentUser ? '#6A2382' : '#F9F9F9',
                borderBottomLeftRadius: isCurrentUser ? 10 : 0,
                borderBottomRightRadius: isCurrentUser ? 0 : 10,
              },
            ]}>
            <View>
              <Text style={styles.messageText(isCurrentUser)}>
                {item.content}
              </Text>
            </View>
            <Text style={styles.messageTime(isCurrentUser)}>
              {getTimeString(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleLoadMoreMessages = () => {
    if (!loading && hasMoreMessages) {
      setPage(prevPage => prevPage + 1);
    }
  };
  let getEmail = messages?.map(item => {
    if (item.senderId != userData?.id) {
      return item;
    }
  });

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}>
      <View style={styles.container}>
        <View style={{flex: 1, backgroundColor: '#ffff'}}>
          <CaseLoadInfoHeader
            iconFirstPress={() => navigation.goBack()}
            iconFirst="chevron-left"
            name="Group Chat"
            iconSize={34}
            iconColor="black"
          />
          <Text
            style={{
              color: 'grey',
              padding: 4,
              textAlign: 'left',
              marginTop: 5,
              marginBottom: 5,
              letterSpacing: 0.8,
              marginHorizontal: 11,
            }}>
            Parents and carers are unable to send messages at this time. Please
            contact our administration team on if you require additional support
            with your referral.
          </Text>
          <FlashList
            ref={flatListRef}
            data={messages}
            estimatedItemSize={87}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => index.toString()}
            inverted={true}
            onEndReached={handleLoadMoreMessages}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color={'#6A2382'} />
              ) : null
            }
          />
        </View>

        {!overViewData?.pathway_status[PATHWAY_STATUS.CASELOAD_CLOSED] && (
          <View
            style={[
              styles.inputContainer,
              isKeyboardVisible && styles.inputContainerWithKeyboard,
            ]}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor="black"
              onSubmitEditing={sendMessage}
              placeholder="Type a message..."
              multiline
            />
            <Pressable
              disabled={filedDisable}
              style={styles.sendButton}
              onPress={sendMessage}>
              <MaterialCommunityIcons name="send" size={20} color="white" />
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  dateText: {
    color: 'black',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: 'black',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6A2382',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  messageWrapper: {
    flex: 1,
  },
  dateText: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  messageRow: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  messageText: isCurrentUser => ({
    color: isCurrentUser ? 'white' : 'black',
  }),
  messageTime: isCurrentUser => ({
    color: isCurrentUser ? 'white' : 'grey',
    fontSize: 12,
    marginTop: 5,
  }),
  dateText: {
    color: 'black',
    textAlign: 'center',
  },
  inputContainerWithKeyboard: {
    paddingBottom: 30,
  },
});

export default ChatMainScreen;
