import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../../containers/Dashboad';
import CustomTabBar from './CustomTabBar';
import {createStackNavigator} from '@react-navigation/stack';
import CaseLoadLayout from '../../containers/Casleoad/CaseLoadLayout';
import ChatConatiner from '../../containers/ChatConatiner';
import ChatMainScreen from '../../containers/ChatMainScreen';
import React from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectTabState, toggleTabState} from './tabSlice';
import UploadDocument from '../../components/organisms/UploadDocument';
import Document from '../../containers/Casleoad/Document';
import ResourceLayout from '../../containers/Resource/ResourceLayout';
import ParentForm from '../../components/organisms/ParentForm';
import NotificationScreen from '../../containers/NotificationScreen';
import UpdateEmail from '../../containers/Authentication/UpdateEmail';
import MyAccount from '../../containers/Authentication/MyAccount';
import UserSettings from '../../containers/Authentication/UserSettings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboadStack = ({navigation, route}) => {
  const dispatch = useDispatch();
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (
      routeName === 'chatMainScreen' ||
      routeName === 'chatLayout' ||
      routeName === 'UploadDocument' ||
      routeName === 'NotificationScreen' ||
      routeName === 'UpdateEmail' ||
      routeName === 'MyAccount' || 
      routeName === 'UserSettings'
    ) {
      navigation.setOptions({
        tabBarStyle: {display: 'none'},
      });
      dispatch(toggleTabState(true));
    } else {
      navigation.setOptions({
        tabBarStyle: {display: 'flex'},
      });
      dispatch(toggleTabState(false));
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      initialRouteName="dashboard"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="dashboard" component={Dashboard} />
      <Stack.Screen name="CaseLoadLayout" component={CaseLoadLayout} />
      <Stack.Screen name="chatLayout" component={ChatConatiner} />
      <Stack.Screen name="chatMainScreen" component={ChatMainScreen} />
      <Stack.Screen name="parentForm" component={ParentForm} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="UserSettings" component={UserSettings} />
      <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
    </Stack.Navigator>
  );
};

const MyTabs = ({navigation, route}) => {
  const tabState = useSelector(selectTabState);
  return (
    <Tab.Navigator
      initialRouteName="DashboadStack"
      backBehavior={'history'}
      screenOptions={{
        headerShown: false,
        tabBarStyle: [{display: 'flex'}, null],
      }}
      tabBar={props => tabState == false && <CustomTabBar {...props} />}>
      <Tab.Screen
        name="DashboadStack"
        component={DashboadStack}
        options={{tabBarLabel: 'Overview'}}
      />
      <Tab.Screen
        name="Resource"
        component={ResourceLayout}
        options={{tabBarLabel: 'Resource'}}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
