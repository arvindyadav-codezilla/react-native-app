import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import T from '../../atoms/T';

const ForgetPasswordForm = props => {
  const {formikProps, onClick, error, handleError, onEditSubmit} = props;
  const handleErrorText = () => {
    handleError();
  };
  return (
    <>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <T title={'Email Address'} style={styles.inputLabel} />
          <Input
            value={formikProps.values.email}
            onChangeText={formikProps.handleChange('email')}
            onBlur={formikProps.handleBlur('email')}
            onFocus={handleErrorText}
            placeholder="Enter your email"
            keyboardType="email-address"
            style={{borderRadius: 25}}
            initialSecureState={false}
            onSubmitEditing={() => {
              onEditSubmit(formikProps.values, formikProps);
            }}
          />
          {formikProps.touched.email && formikProps.errors.email && (
            <Text style={styles.errorText}>{formikProps.errors.email}</Text>
          )}
        </View>
      </View>
      <T
        title={error}
        style={{
          color: 'red',
          fontSize: 13,
          textAlign: 'center',
          // marginVertical: 5,
        }}
      />
      <TouchableOpacity
        style={{alignSelf: 'flex-end', marginBottom: 10}}
        onPress={onClick}>
        <T
          title={'Go back to Login'}
          style={{
            color: '#101828',
            fontSize: 13,
            textAlign: 'right',
            // marginVertical: 5,
            textDecorationLine: 'underline',
          }}
        />
      </TouchableOpacity>
      <View>
        <Button
          onSubmit={() => {
            onEditSubmit(formikProps.values, formikProps);
          }}
          title="FORGOT"
          onPress={formikProps.handleSubmit}
          style={styles.button}
          textStyle={{padding: 5, fontFamily: 'Inter-Bold', padding: 12}}
        />
      </View>
    </>
  );
};

export default ForgetPasswordForm;

const styles = StyleSheet.create({
  form: {
    marginBottom: 1,
  },
  inputContainer: {
    marginBottom: 1,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
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
    borderRadius: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
