import {useEffect} from 'react';
import {Linking} from 'react-native';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import {Config} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../navigations/navigationRef';

const useNotifications = () => {
  const handleOnMessage = async res => {
    let remoteMessage = JSON.parse(res);
    try {
      let notificationMessage;
      const channelId = await notifee.createChannel({
        id: Config?.USEDO_NOTIFICATION_CHANNEL,
        name: Config?.USEDO_NOTIFICATION_CHANNEL,
        importance: AndroidImportance.HIGH,
      });
      if (remoteMessage?.data?.message_data) {
        const srz = JSON.parse(remoteMessage?.data);
        const dataLink = {link: srz?.custom[0]?.value};
        notificationMessage = {
          title: srz?.title,
          body: srz?.message,
          data: dataLink,
        };
      } else {
        notificationMessage = {
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          data: remoteMessage?.data,
        };
      }
      await notifee.displayNotification({
        ...notificationMessage,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {}
  };

  const handleNotificationTest = async () =>
    await notifee.displayNotification({
      title: 'Notification Title3',
      body: 'Main body content of the notification',
      data: {link: 'mycarebridge://caseload'},
      android: {
        channelId: Config?.USEDO_NOTIFICATION_CHANNEL,
        pressAction: {
          id: 'default',
        },
      },
    });

  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          if (detail.notification.data.navigationUrl) {
            const url = detail.notification.data.navigationUrl;
            if (url === 'mycarebridge://MyTabs/DashboadStack/CaseLoadLayout') {
              navigate('CaseLoadLayout', {
                // cardInfo: detail.notification.data.cardInfo,
                data: detail.notification.data,
              });
            } else if (
              url === 'mycarebridge://MyTabs/DashboadStack/chatMainScreen'
            ) {
              navigate('chatMainScreen', {
                // cardInfo: detail.notification.data.cardInfo,
                data: detail.notification.data,
              });
            } else {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              }
            }
          }
          break;
      }
    });

    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          if (detail.notification.data.navigationUrl) {
            const url = detail.notification.data.navigationUrl;
            if (url === 'mycarebridge://MyTabs/DashboadStack/CaseLoadLayout') {
              navigate('CaseLoadLayout', {
                data: detail.notification.data,
              });
            } else if (
              url === 'mycarebridge://MyTabs/DashboadStack/chatMainScreen'
            ) {
              navigate('chatMainScreen', {
                data: detail.notification.data,
              });
            } else {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              }
            }
          }
          break;
      }
    });
  }, []);
  return {handleOnMessage, handleNotificationTest};
};

export default useNotifications;
