import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Scale} from '../../../styles';
import Button from '../../atoms/Button';
import T from '../../atoms/T';
import InputField from '../../molecules/InputField';

const LoginForm = props => {
  const {onPress, formikProps, errorValidation} = props;
  return (
    <View style={{flex: 1}}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <T title={'Email Address'} style={styles.inputLabel} />
          <InputField
            value={formikProps.values.email}
            onChangeText={formikProps.handleChange('email')}
            onBlur={formikProps.handleBlur('email')}
            placeholder="Enter your email"
            keyboardType="email-address"
            style={{}}
            initialSecureState={false}
          />
          {formikProps.touched.email && formikProps.errors.email && (
            <Text style={styles.errorText}>{formikProps.errors.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <T title={'Enter Password'} style={styles.inputLabel} />

          <InputField
            value={formikProps.values.password}
            onChangeText={formikProps.handleChange('password')}
            onBlur={formikProps.handleBlur('password')}
            placeholder="Enter your password"
            style={{}}
            icon={true}
            initialSecureState={true}
            onSubmitEditing={formikProps.handleSubmit}
          />
          {formikProps.touched.password && formikProps.errors.password && (
            <Text style={styles.errorText}>{formikProps.errors.password}</Text>
          )}

          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onPress}>
            <T title={' Forgot password?'} style={styles.forgotPasswordText} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: 'red',
            fontFamily: 'Inter-Medium',
            textAlign: 'center',
            padding: 4,
          }}>
          {errorValidation}
        </Text>
      </View>
      <View>
        <Button
          title="LOGIN"
          onPress={formikProps.handleSubmit}
          style={styles.button}
          textStyle={{padding: 5, fontWeight: 'bold', padding: 12}}
        />
      </View>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  form: {
    // marginBottom: 15,
  },
  inputContainer: {
    // marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
  },
  forgotPasswordText: {
    color: '#101828',
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
    paddingBottom: 7,
  },
});
