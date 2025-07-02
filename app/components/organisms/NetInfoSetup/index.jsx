// NetInfoSetup.js
import NetInfo from '@react-native-community/netinfo';
import store from './store'; // Import your Redux store
import {setNetworkError} from '../../../containers/Authentication/Login/networkSlice';

NetInfo.addEventListener(state => {
  const isConnected = state.isConnected && state.isInternetReachable;
  store.dispatch(setNetworkError(!isConnected));
});
