import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import {AppImages} from '../../../styles/images';
import Images from '../../atoms/Image';
import T from '../../atoms/T';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../containers/Authentication/OtpScreen/userSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import UserLogoutModal from '../UserLogoutModal';
import {SvgXml} from 'react-native-svg';
import {userIcon} from '../../../assets/SvgImages';
import BreakSectionLine from '../BreakSectionLine';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {wipeStorage} from '../../../utils/storageUtils';
import {loginUser, logout} from '../../../services/authServices';
import ToastHandler from '../../atoms/ToastHandler';
const UserHeader = ({navigation}) => {
  const user = useSelector(selectUser);
  const [logedInUser, setLogedInUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    getuserDetails();
  }, []);

  const getuserDetails = async () => {
    let AsyncData = await AsyncStorage.getItem('userDetails');
    let accessToken = await AsyncStorage.getItem('accessToken');
    let userProfile = JSON.parse(AsyncData);
    setToken(accessToken);
    setLogedInUser(userProfile);
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response?.status === 200) {
        ToastHandler(`${response?.data?.message}`);

        await wipeStorage();
        toggleModal();
        navigation.navigate('Auth', {screen: 'login'});
      } else {
        ToastHandler(`${response?.data?.message}`);
      }
    } catch (error) {
      ToastHandler(`${response?.data?.message}`);
    }
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const {first_name, last_name} = logedInUser || {};
  const first = first_name || '';
  const second = last_name || '';
  const userName = `${first} ${second}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <T title={'Hi, Welcome 👋'} style={styles.welcomeText} />
        <T title={userName} style={styles.userName} />
      </View>
      <View style={styles.imageContainer}>
        <Pressable onPress={toggleModal} style={styles.userImg}>
          <SvgXml xml={userIcon()} height={50} width={50} />
        </Pressable>
      </View>

      <UserLogoutModal visible={modalVisible} onClose={toggleModal}>
      <TouchableOpacity
          style={[
            styles.button,
            {
              flexDirection: 'row',
            },
          ]}
          onPress={() => {
            toggleModal();
            navigation.navigate('UserSettings');
          }}>
          <AntDesign name={'setting'} size={22} color={'black'} />
          <Text style={styles.settingButtonText}>Setting</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              flexDirection: 'row',
            },
          ]}
          onPress={() => {
            toggleModal();
            navigation.navigate('MyAccount');
          }}>
          <AntDesign name={'user'} size={22} color={'black'} />
          <Text style={styles.settingButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() => setSelectedId(0)}
          onPressOut={() => setSelectedId(null)}
          style={[
            styles.button,
            {
              backgroundColor: selectedId === 0 ? '#6A2382' : null,
              flexDirection: 'row',
            },
          ]}
          onPress={handleLogout}>
          <AntDesign name={'logout'} size={22} color={'#C41E3A'} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </UserLogoutModal>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  button: {
    padding: 9,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: '#C41E3A',
    fontSize: 16,
    marginLeft: 5,
  },
  settingButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 5,
  },
  welcomeText: {
    fontSize: 15,
    color: '#101828',
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    color: '#101828',
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
  },
  imageWrapper: {
    height: 45,
    width: 45,
    borderColor: '#E7E7E7',
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImg: {
    height: 45,
    width: 45,
    borderColor: '#E7E7E7',
    // borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    width: '60%',
  },
});
