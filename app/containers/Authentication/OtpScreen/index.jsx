import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Alert, Keyboard} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Scale} from '../../../styles';
import axios from 'axios';
import Loader from '../../../components/atoms/Lodar';
import FooterPrivacyPolicy from '../../../components/molecules/FooterPricacyPolicy';
import CustomAlert from '../../../components/atoms/CustomAlert';
import OtpForm from '../../../components/organisms/OtpForm';
import Images from '../../../components/atoms/Image';
import {AppImages} from '../../../styles/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setUser} from './userSlice';
import {loginUser, otpServices} from '../../../services/authServices';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {storageWrite} from '../../../utils/storageUtils';
import messaging from '@react-native-firebase/messaging';
import {CommonActions} from '@react-navigation/native';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const OtpScreen = props => {
  const {navigation, route} = props;
  const [lodar, setLodar] = useState(false);
  const dispatch = useDispatch();
  const [deviceToken, setDeviceToken] = useState('');

  useEffect(() => {
    getDeviceToken();
  }, []);
  const getDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      setDeviceToken(token);
    } catch (error) {}
  };
  const HEADER_TOKEN = {
    Authorization: 'Basic YXNkY2xpZW50OmFzZHNlY3JldA==',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const handleLogin = (values, formik) => {
    verifyOtp(values, formik);
  };

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpInput = (index, value) => {
    if (!value || isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move focus to the previous field if not in the first field
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const getOrganisationImageBase64 = async imagePath => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const verifyOtp = async (values, formik) => {
    Keyboard.dismiss();
    const enteredOtp = otp.join('');
    if (!enteredOtp || enteredOtp.length < 6) {
      return CustomAlert({
        title: 'ASD',
        message: 'Please enter otp',
        onPressOk: () => {},
        onPressCancel: () => {},
      });
    }
    setLodar(true);
    let data = {
      email: route?.params?.email,
      otp: enteredOtp,
      device_token: deviceToken,
    };
    try {
      let response = await otpServices(data);
      let userData = response?.data?.data;
      if (response?.data?.status === 200) {
        dispatch(setUser(userData));
        let organizationImage = await getOrganisationImageBase64(
          userData?.organization?.logo,
        );
        userData = {
          ...userData,
          organization: {...userData?.organization, logo: organizationImage},
        };
        await storageWrite('accessToken', userData?.accessToken);
        await storageWrite('refreshToken', userData?.refreshToken);
        await storageWrite('userDetails', userData);
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${userData?.accessToken}`;
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'MyTabs'}],
          }),
        );
        setOtp(['', '', '', '', '', '']);
        setLodar(false);
      }
    } catch (error) {
      setLodar(false);
      if (error.statusCode === 400) {
        setLodar(false);
        Alert.alert('MyCareBridge', error.message);
      }
    }
  };
  const {data} = route.params;
  const resendOtp = async () => {
    try {
      const datas = {
        scope: '7',
        username: data?.username,
        password: data?.password,
        grant_type: 'password',
        device_token: deviceToken,
      };
      const response = await loginUser(datas);
      let result = response?.data?.data;
      if (result) {
        Alert.alert('Resend OTP', 'OTP resent successfully!');
      }
    } catch (error) {}
  };
  return (
    <>
      <Formik
        initialValues={{email: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {formikProps => (
          <View style={styles.container}>
            <View style={{paddingHorizontal: 18, flex: 1}}>
              <View style={styles.imageContainer} />
              <View style={styles.headerImgCon}>
                <Images
                  source={AppImages?.MyCareBridge}
                  ImgStyle={styles.headerImg}
                  resizeMode="contain"
                />
              </View>
              <OtpForm
                formikProps={formikProps}
                otp={otp}
                inputRefs={inputRefs}
                resendOtp={resendOtp}
                verifyOtp={verifyOtp}
                handleOtpInput={handleOtpInput}
                onSubmitEditing={handleLogin}
              />
            </View>
            <FooterPrivacyPolicy />
          </View>
        )}
      </Formik>
      {lodar && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#575757',
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  forgotPasswordText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'right',
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8ccdb',
    paddingVertical: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  providedByText: {
    fontWeight: 'bold',
    color: '#1992DB',
  },
  footerLink: {
    fontSize: 14,
    color: '#101828',
    textDecorationLine: 'underline',
    fontFamily: 'Inter',
  },
  button: {
    backgroundColor: '#6A2382',
    borderRadius: 30,
  },
  headerImgCon: {
    marginBottom: Scale.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImg: {alignSelf: 'center', height: 40, width: 200},
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default OtpScreen;
