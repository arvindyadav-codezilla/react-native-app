import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {AppImages} from '../../../styles/images';
import {Scale} from '../../../styles';
import Images from '../../../components/atoms/Image';
import axios from 'axios';
import Loader from '../../../components/atoms/Lodar';
import T from '../../../components/atoms/T';
import LoginForm from '../../../components/organisms/loginForm';
import FooterPrivacyPolicy from '../../../components/molecules/FooterPricacyPolicy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser} from '../../../services/authServices';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Config} from '../../../config';
import {storageRead, storageWrite} from '../../../utils/storageUtils';
import messaging from '@react-native-firebase/messaging';
import {getOrganisationImageBase64} from '../../../utils/common';
import {CommonActions} from '@react-navigation/native';
import useBiometricLogin from '../BiometricLogin/useBiometricLogin';
import Button from '../../../components/atoms/Button';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email must be lowercase and a valid format')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = props => {
  const {navigation} = props;
  const [lodar, setLodar] = useState(false);
  const [errorValidation, setErrorValidation] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
    const [userDetails, setUserDetail] = useState(null);
  const { tryBiometricLogin, loading } = useBiometricLogin(props);
  const [isfingerPrint, setFingerPrintDetail] = useState(null);


  useEffect(() => {
    getDeviceToken();
      getCurrentFingerPrintStatus()
  }, []);

    const getCurrentFingerPrintStatus = async () => {
        let useData = await storageRead('biometric_token');
        setFingerPrintDetail(useData);
      };

  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      setDeviceToken(token);
    } catch (error) {}
  };

  const handleLogin = (values, formik) => {
    const lowercaseEmail = values.email.toLowerCase();
    const updatedValues = {...values, email: lowercaseEmail};
    handleAuthentication(updatedValues, formik);
  };

  const handleAuthentication = async (value, formik) => {
    setErrorValidation('');
    try {
      setLodar(true);

      const data = {
        scope: '7',
        username: value?.email,
        password: value?.password,
        grant_type: 'password',
        device_token: deviceToken,
      };
      const response = await loginUser(data);
      let result = response?.data?.data;
      if (response?.status === 200) {
        if (result?.mfa === true) {
          setErrorValidation('');
          navigation.navigate('Auth', {
            screen: 'otpScreen',
            params: {
              email: value?.email,
              data: data,
            },
          });
        } else {
          if (result?.organization?.logo) {
            let organizationImage = await getOrganisationImageBase64(
              result?.organization?.logo,
            );
            result = {
              ...result,
              organization: {...result?.organization, logo: organizationImage},
            };
          }

          await storageWrite('accessToken', result?.accessToken);
          await storageWrite('refreshToken', result?.refreshToken);
          await storageWrite('biometric_token', result?.biometric_token);
          await storageWrite('userDetails', result);
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${result?.accessToken}`;
          setErrorValidation('');

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'MyTabs'}],
            }),
          );
        }
        formik.resetForm();
        setLodar(false);
      }
    } catch (error) {
      setLodar(false);
      if (error.statusCode === 404) {
        setErrorValidation(error.message);
      }
      if (error.statusCode === 401) {
        setErrorValidation(error.message);
      }
      if (error.statusCode === 400) {
        setErrorValidation(error.message);
      }
    }
  };

  useEffect(() => {
    axios.defaults.baseURL = `${Config.MYCAREBRIDGE_BASE_URL}`;
    checkIsLogedIn();
  }, []);

  const checkIsLogedIn = async () => {
    AsyncStorage.getItem('accessToken')
      .then(res => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res}`;
        if (res) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'MyTabs'}],
            }),
          );
        } else {
          navigation.navigate('Auth');
        }
      })
      .catch(error => {
        navigation.navigate('Auth');
      });
  };

console.log('isfingerPrint===>',isfingerPrint)
  return (
    <>
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View style={styles.headerLogoImgCon}>
              <Images
                source={AppImages?.MyCareBridge}
                ImgStyle={styles.headerImg}
                resizeMode="contain"
              />
            </View>
            <View>
              <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}>
                {formikProps => (
                  <View style={styles.formContainer}>
                    <View style={styles.header}>
                      <T title={'Login Account'} style={styles.greetingText} />
                      <Text style={styles.headerSubtitle}>
                        "Welcome back, Parent, Login to access the App"
                      </Text>
                    </View>
                    <LoginForm
                      formikProps={formikProps}
                      errorValidation={errorValidation}
                      onPress={() => {
                        setErrorValidation('');
                        navigation.navigate('forgot');
                      }}
                    />

                   {isfingerPrint === true || isfingerPrint === 'true' &&  <View style={{marginTop:10}}>
        <Button
          title="Login with Biometrices"
          onPress={tryBiometricLogin}
          style={styles.button}
          textStyle={{padding: 5, fontWeight: 'bold', padding: 12}}
        />
      </View>}


                    {lodar && <Loader />}
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <View style={styles.footerImgCon}>
            <Images
              source={AppImages?.PoweredByImg}
              headerImgStyle={styles.footerImg}
              resizeMode="contain"
            />
          </View>
          <FooterPrivacyPolicy />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: Scale.moderateScale(30),
  },
  greetingText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#969696',
    fontFamily: 'Inter-Medium',
  },
  headerLogoImgCon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: Scale.moderateScale(50),
  },
  headerImg: {
    alignSelf: 'center',
  },
  footerImgCon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Scale.moderateScale(50),
  },
  footerImg: {
    alignSelf: 'center',
    height: 70,
    width: '39%',
  },
  button: {
    backgroundColor: '#6A2382',
    borderRadius: 25,
  },
});

export default Login;
