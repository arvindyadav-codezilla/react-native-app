import {Linking} from 'react-native';
import {navigate} from '../navigations/navigationRef';

export const linking = {
  prefixes: ['mycarebridge://', 'https://mycarebridge.com'],
  config: {
    screens: {
      Auth: 'Auth',
      MyTabs: {
        path: 'MyTabs',
        screens: {
          DashboadStack: {
            path: 'DashboadStack',
            screens: {
              dashboard: 'dashboard',
              CaseLoadLayout: 'CaseLoadLayout',
              chatLayout: 'chatLayout',
              chatMainScreen: {
                path: 'chatMainScreen',
                parse: {
                  id: id => {
                    decodeURIComponent(id);
                  },
                },
              },
              parentForm: 'parentForm',
            },
          },
          Resource: 'Resource',
        },
      },
    },
  },
};

export const handleNotification = async remoteMessage => {
  const {navigationUrl} = remoteMessage.data || {};
  if (navigationUrl) {
    if (
      navigationUrl === 'mycarebridge://MyTabs/DashboadStack/CaseLoadLayout'
    ) {
      navigate('CaseLoadLayout', {data: remoteMessage.data});
    } else if (
      navigationUrl === 'mycarebridge://MyTabs/DashboadStack/chatMainScreen'
    ) {
      navigate('chatMainScreen', {data: remoteMessage.data});
    } else {
      const supported = await Linking.canOpenURL(navigationUrl);
      if (supported) {
        await Linking.openURL(navigationUrl);
      }
    }
  }
};
