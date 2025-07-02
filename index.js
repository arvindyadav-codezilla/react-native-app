/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {handleNotification} from './app/utils/deepLinks';

messaging().setBackgroundMessageHandler(async remoteMessage => {});

messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    if (remoteMessage) {
      // Handle navigation only if the app was opened by clicking the notification
      setTimeout(async () => {
        await handleNotification(remoteMessage);
      }, 1200);
    }
  });
messaging().onNotificationOpenedApp(async remoteMessage => {
  // handleOnMessage(JSON.stringify(remoteMessage));
  await handleNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
