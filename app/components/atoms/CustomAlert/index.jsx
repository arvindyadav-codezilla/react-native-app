import React from 'react';
import {Alert} from 'react-native';

const CustomAlert = ({title, message, onPressOk, onPressCancel}) => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: onPressOk,
    },
    {
      text: 'Cancel',
      onPress: onPressCancel,
      style: 'cancel',
    },
  ]);
};

export default CustomAlert;
