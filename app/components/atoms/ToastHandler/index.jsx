import Toast from 'react-native-simple-toast';

const ToastHandler = msg => {
  // if (Platform.OS === 'android') {
  // ToastAndroid.show(msg, ToastAndroid.SHORT);
  Toast.show(msg, Toast.BOTTOM, {
    backgroundColor: '#6A2382',
    shadowColor: '#6A2382',
  });

  // } else {
  //   AlertIOS(msg);
  // }
};

export default ToastHandler;
