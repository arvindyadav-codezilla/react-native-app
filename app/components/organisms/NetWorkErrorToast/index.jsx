// // NetWorkErrorToast.js
// import React, {useEffect} from 'react';
// import {useSelector, useDispatch} from 'react-redux';
// import Toast from 'react-native-simple-toast';
// import {
//   clearNetworkError,
//   selectNetworkError,
// } from '../../../containers/Authentication/Login/networkSlice';

// const NetWorkErrorToast = () => {
//   const dispatch = useDispatch();
//   const isNetworkError = useSelector(selectNetworkError);

//   useEffect(() => {
//     if (isNetworkError) {
//       Toast.show('Network Error. Please try again.', Toast.LONG);
//       const timer = setTimeout(() => {
//         dispatch(clearNetworkError());
//       }, 3000); // Clear the error after 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [isNetworkError, dispatch]);

//   return null; // This component does not render anything
// };

// export default NetWorkErrorToast;

// NetWorkErrorToast.js
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {
  clearNetworkError,
  selectNetworkError,
} from '../../../containers/Authentication/Login/networkSlice';

const NetWorkErrorToast = () => {
  const dispatch = useDispatch();
  const isNetworkError = useSelector(selectNetworkError);
  const [showToast, setShowToast] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value

  useEffect(() => {
    if (isNetworkError) {
      setShowToast(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Fade in duration
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // Fade out duration
          useNativeDriver: true,
        }).start(() => {
          setShowToast(false);
          dispatch(clearNetworkError());
        });
      }, 10000); // Clear the error after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isNetworkError, dispatch, fadeAnim]);

  if (!showToast) {
    return null;
  }

  return (
    <Animated.View style={[styles.toastContainer, {opacity: fadeAnim}]}>
      <Text style={styles.toastText}>Network Error. Please try again.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    zIndex: 1000,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NetWorkErrorToast;
