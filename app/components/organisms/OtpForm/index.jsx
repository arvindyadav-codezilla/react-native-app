import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Button from '../../atoms/Button';
import CustomAlert from '../../atoms/CustomAlert';
import Input from '../../atoms/Input';
import T from '../../atoms/T';

const OtpForm = ({
  formikProps,
  otp,
  inputRefs,
  resendOtp,
  verifyOtp,
  handleOtpInput,
  onSubmitEditing,
}) => {
  return (
    <>
      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
        <T title={'Enter OTP'} style={{fontSize: 20, marginBottom: 20}} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {otp?.map((digit, index) => (
            <Input
              key={index}
              value={digit}
              onChangeText={value => handleOtpInput(index, value)}
              onBlur={formikProps.handleBlur('email')}
              placeholder=""
              keyboardType="numeric"
              maxLength={1}
              style={{width: '12%', margin: 5}}
              ref={text => (inputRefs.current[index] = text)}
              initialSecureState={false}
              onSubmitEditing={onSubmitEditing}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '95%',
            marginTop: 20,
          }}>
          <Button
            title="Resend OTP"
            onPress={resendOtp}
            style={styles.button}
            textStyle={{padding: 14, fontWeight: 'bold', fontSize: 12}}
          />
          <Button
            title="Verify OTP"
            onPress={verifyOtp}
            style={styles.button}
            textStyle={{padding: 14, fontWeight: 'bold', fontSize: 12}}
          />
        </View>
      </View>
    </>
  );
};

export default OtpForm;

const styles = StyleSheet.create({
  form: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  forgotPasswordText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'right',
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#6A2382',
    borderRadius: 10,
    width: '44%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
