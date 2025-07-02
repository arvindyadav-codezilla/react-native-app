// store.js

import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers';
import dashboadReducer from './reducers';
import overviewReducer from './reducers';
import TabReducer from './reducers';
import caseloadReducer from './reducers';
import logoutReducer from './reducers';
import SelectCardReducer from './reducers';
import NetworkError from './reducers';
import NotificationData from './reducers';
import biometricReducer from './reducers';

export default configureStore({
  reducer: {
    user: userReducer,
    dashboad: dashboadReducer,
    overview: overviewReducer,
    tab: TabReducer,
    caseload: caseloadReducer,
    logout: logoutReducer,
    cardSelectDetails: SelectCardReducer,
    NetworkDetails: NetworkError,
    notificationData: NotificationData,
    biometric:biometricReducer
  },
});
