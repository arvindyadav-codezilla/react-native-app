import {View, Text, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import CaseLoadInfoHeader from '../../components/molecules/CaseLoadInfoHeader';
import ConversationHistoryList from '../../components/organisms/ConversationHistoryList';
import ChatMemberModal from '../../components/organisms/ChatMemberModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectOverViewData} from '../Casleoad/Overview/OverViewSlice';
import {useSelector} from 'react-redux';
import {
  conversationHistory,
  createConversation,
  getScopeChatMember,
} from '../../services/chatServices';
import {selectPatientData} from '../Dashboad/DashboadSlice';
import {selectCaseloadData} from '../Casleoad/CaseLoadLayout/caseloadSelectedSlice';

const ChatConatiner = props => {
  const [conversations, setConversations] = useState([]);
  const [members, setMembers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const overViewData = useSelector(selectOverViewData);
  const {cardSelected} = useSelector(selectPatientData);
  const selectcard = useSelector(selectCaseloadData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getConversationHistory();
  }, [cardSelected]);
  const getConversationHistory = async () => {
    setIsLoading(true);
    try {
      const response = await conversationHistory(cardSelected);
      let history = response.data.data;
      setConversations(history);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleSelectedChat = item => {
    props.navigation.navigate('DashboadStack', {
      screen: 'chatMainScreen',
      params: {data: item},
    });
  };
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectUser = async user => {
    setSelectedUser(user);
    let userdata = await AsyncStorage.getItem('userDetails');
    let Logineduser = JSON.parse(userdata);
    let name = `${user?.first_name} ${user.last_name}`;
    let headers = {
      'Content-Type': 'application/json',
    };
    let data = {
      participantsIds: [user?.id, Logineduser.id],
      title: name,
      caseload_id: overViewData?.id,
    };
    try {
      const response = await createConversation(data, headers);
      props.navigation.navigate('DashboadStack', {
        screen: 'chatMainScreen',
        params: response?.data,
      });
    } catch (error) {}
  };

  const backHandler = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, [props.navigation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CaseLoadInfoHeader
        iconFirstPress={() => {
          props.navigation.goBack();
        }}
        iconFirst={'chevron-left'}
        name={'Group Chat'}
        iconSize={26}
        iconColor={'black'}
      />

      <ConversationHistoryList
        conversations={conversations}
        onSelectChat={item => {
          handleSelectedChat(item);
        }}
        isLoading={isLoading}
      />
    </View>
  );
};

export default ChatConatiner;
