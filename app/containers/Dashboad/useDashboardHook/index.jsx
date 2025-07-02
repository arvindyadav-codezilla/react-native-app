import {useState, useEffect, useCallback} from 'react';
import {BackHandler, Linking, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import notifee from '@notifee/react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import {useFocusEffect} from '@react-navigation/native';

import {caseLoadsServices} from '../../../services/dashboadServices';
import {
  selectSessionData,
  setLogoutSuccess,
} from '../../Authentication/Logout/logoutSlice';
import {wipeStorage} from '../../../utils/storageUtils';
import {
  checkPermission,
  requestNotificationPermission,
  getStatusText,
} from '../../../utils/common';
import {Config} from '../../../config';

export const useDashboardHook = navigation => {
  const [caseLoads, setCaseLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const dispatch = useDispatch();
  const sessionData = useSelector(selectSessionData);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    await handlePermissions();
    await loadCaseLoads();
    notifee.cancelAllNotifications();
  };

  const handlePermissions = async () => {
    const hasStoragePermission = await checkPermission();
    if (!hasStoragePermission) {
      await requestNotificationPermission();
    }
  };

  const loadCaseLoads = async () => {
    setLoading(true);
    try {
      const response = await caseLoadsServices();
      if (response.data.status === 200) {
        setCaseLoads(response.data.data.ActiveReferrals);
      }
    } catch (error) {
      console.error('Error loading caseloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = useCallback(() => {
    const navigationState = navigation.getState();
    const currentRouteName =
      navigationState.routes[navigationState.index]?.name;
    if (currentRouteName && currentRouteName.includes('dashboard')) {
      BackHandler.exitApp();
      return true;
    }
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);

  const handleLogout = async () => {
    dispatch(setLogoutSuccess(false));
    await wipeStorage();
    navigation.navigate('Auth', {screen: 'login'});
  };

  const compareVersions = (v1, v2) => {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    const len = Math.max(v1Parts.length, v2Parts.length);

    for (let i = 0; i < len; i++) {
      const a = v1Parts[i] || 0;
      const b = v2Parts[i] || 0;
      if (a < b) return -1;
      if (a > b) return 1;
    }
    return 0;
  };

  const checkForUpdate = useCallback(async () => {
    let currentVersion;
    let latestVersion;

    if (Platform.OS === 'android') {
      currentVersion = DeviceInfo.getVersion();
    } else if (Platform.OS === 'ios') {
      currentVersion = DeviceInfo.getVersion();
    }

    if (Platform.OS === 'android') {
      // For Android (Play Store)
      latestVersion = await VersionCheck.getLatestVersion({
        provider: 'playStore',
      });
    } else if (Platform.OS === 'ios') {
      // For iOS (App Store)
      latestVersion = await VersionCheck.getLatestVersion({
        provider: 'appStore',
      });
    }

    console.log('currentVersion', currentVersion);
    console.log('latestVersion', latestVersion);

    // if (Platform.OS === 'android') {
    //   if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
    //     setShowUpgradeModal(true);
    //   }
    // } else {
    //   if (parseFloat(currentVersion) > parseFloat(latestVersion)) {
    //     setShowUpgradeModal(true);
    //   }
    // }

    if (Platform.OS === 'android') {
      if (parseFloat(currentVersion) < parseFloat(latestVersion)) {
        setShowUpgradeModal(true);
      }
    } else {
      if (currentVersion < latestVersion) {
        setShowUpgradeModal(true);
      }
    }
  }, []);

  const handleUpgrade = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(Config.PLAY_STORE_URL);
    } else if (Platform.OS === 'ios') {
      Linking.openURL(Config.IOS_STORE_URL);
    }

    setShowUpgradeModal(false);
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        checkForUpdate();
      }

      fetchData();
    }, []),
  );

  return {
    caseLoads,
    loading,
    sessionData,
    showUpgradeModal,
    loadCaseLoads,
    handleLogout,
    handleUpgrade,
  };
};
