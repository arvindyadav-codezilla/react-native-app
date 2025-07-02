import {combineReducers} from 'redux';
import authReducer from '../containers/Authentication/OtpScreen/userSlice';
import patientReducer from '../containers/Dashboad/DashboadSlice';
import overViewReducer from '../containers/Casleoad/Overview/OverViewSlice';
import TabReducer from '../navigations/BottomNavigation/tabSlice';
import caseloadReducer from '../containers/Casleoad/CaseLoadLayout/caseloadSelectedSlice';
import SelectedCardDetailsReducer from '../containers/Casleoad/CaseLoadLayout/slectedCaseloadDetails';
import logoutReducer from '../containers/Authentication/Logout/logoutSlice';
import networkReducer from '../containers/Authentication/Login/networkSlice';
import biometricReducer from '../containers/Authentication/BiometricLogin/biometricSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  patientData: patientReducer,
  overViewDetail: overViewReducer,
  TabDetail: TabReducer,
  caseloadSelected: caseloadReducer,
  logoutData: logoutReducer,
  selectCard: SelectedCardDetailsReducer,
  networkError: networkReducer,
  biometric: biometricReducer,
});

export default rootReducer;
