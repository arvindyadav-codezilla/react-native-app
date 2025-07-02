import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MyTabs from '../BottomNavigation';
import Auth from './Auth';
import {linking} from '../../utils/deepLinks';
import {Text} from 'react-native';
import {navigationRef} from '../navigationRef';
import NetWorkErrorToast from '../../components/organisms/NetWorkErrorToast';
import {selectNetworkError} from '../../containers/Authentication/Login/networkSlice';
import {useSelector} from 'react-redux';

const MainStack = createStackNavigator();

const MainAuth = () => {
  const isNetworkError = useSelector(selectNetworkError);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Auth" component={Auth} />
        <MainStack.Screen name="MyTabs" component={MyTabs} />
      </MainStack.Navigator>
      {isNetworkError?.isNetworkError && <NetWorkErrorToast />}
    </NavigationContainer>
  );
};

export default MainAuth;
