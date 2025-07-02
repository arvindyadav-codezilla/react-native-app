import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Appearance,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainAuth from './navigations/StackNavigation';
import store from './redux/store';
import {Provider, useDispatch, useSelector} from 'react-redux';
import useNotifications from './hook/useNotication';
import RNBootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {checkPermission} from './utils/common';
import {navigate} from './navigations/navigationRef';
import {handleNotification} from './utils/deepLinks';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';

const handleSplash = async () => {
  await RNBootSplash.hide({fade: true});
};

const App = () => {
  const {handleOnMessage} = useNotifications();

  useEffect(() => {
    const timer1 = setTimeout(() => handleSplash(), 1500);
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  messaging().getToken(res => {});
  useEffect(() => {
    messaging().onMessage(res => {
      if (Object.entries(res.data).length === 0) {
      } else {
        handleOnMessage(JSON.stringify(res));
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestNotificationPermission();
      requestUserPermission();
    } else {
      requestUserPermission();
    }

    getDeviceToken();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS')
          .then(response => {
            if (!response) {
              PermissionsAndroid.request(
                'android.permission.POST_NOTIFICATIONS',
                {
                  title: 'Notification',
                  message:
                    'App needs access to your notification ' +
                    'so you can get Updates',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
            }
          })
          .catch(err => {});
      } catch (err) {}
    }
  };

  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
    } catch (error) {}
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <MainAuth />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
