import React from 'react';
import {View, Text} from 'react-native';
import MyCareBridgeAlert from '../../../../../components/molecules/MyCareBridgeAlert';

const AlertMessage = ({alertVisible, handleCloseAlert}) => {
  return (
    alertVisible && (
      <MyCareBridgeAlert
        visible={alertVisible}
        headerText="Important Notice !"
        onClose={handleCloseAlert}>
        <View style={{padding: 7}}>
          <Text style={{fontSize: 16, color: 'black', paddingBottom: 5}}>
            Before you begin filling out this form, please be aware of the
            following:
          </Text>
          <Text style={{fontSize: 16, color: 'black', paddingBottom: 7}}>
            1. Time Required: The form will take approximately 40-50 minutes to
            complete.
          </Text>
          <Text style={{fontSize: 16, color: 'black', paddingBottom: 7}}>
            2. Save function: You are able to save your information as you go by
            pressing the 'save' button at the bottom of the form. Using the save
            function means that you can exit this form and return to continue it
            later on if you need more time or to gather more information.
          </Text>
          <Text style={{fontSize: 16, color: 'black', paddingBottom: 7}}>
            To avoid any inconvenience, we recommend having all necessary
            information and documents ready before you start.
            <Text>Thank you for your understanding and cooperation.</Text>
          </Text>
        </View>
      </MyCareBridgeAlert>
    )
  );
};

export default AlertMessage;
