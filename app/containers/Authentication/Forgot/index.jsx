import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../components/atoms/Input';
import Button from '../../../components/atoms/Button';
import {AppImages} from '../../../styles/images';
import {Scale} from '../../../styles';
import Images from '../../../components/atoms/Image';
import T from '../../../components/atoms/T';
import ForgetPasswordForm from '../../../components/organisms/ForgetPasswordForm';
import FooterPrivacyPolicy from '../../../components/molecules/FooterPricacyPolicy';
import CustomAlert from '../../../components/atoms/CustomAlert';
import {forgotPasswordServices} from '../../../services/authServices';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const Forgot = props => {
  const {navigation} = props;
  const [lodar, setLodar] = useState(false);
  const [error, setError] = useState(null);
  // axios.defaults.baseURL = 'https://api.stg.mycarebridge.co.uk/';
  const HEADER_TOKEN = {
    Authorization: 'Basic YXNkY2xpZW50OmFzZHNlY3JldA==',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const handleLogin = (values, formik) => {
    handleAuthentication(values, formik);
  };

  const handleAuthentication = async (value, formik) => {
    try {
      setLodar(true);

      const data = {
        email: value?.email,
      };

      const response = await forgotPasswordServices(data);
      if (response?.data?.status === 200) {
        setLodar(false);
        formik.resetForm();
        CustomAlert({
          title: 'ASD',
          message: response?.data?.message,
          onPressOk: () => {},
          onPressCancel: () => {},
        });
        navigation.navigate('login');
      } else {
        setLodar(false);
      }
    } catch (error) {
      if (error.response.status) {
        setError(error.response.data.message);
        setLodar(false);
      }
      setLodar(false);
    }
  };
  const handleClick = () => {
    props.navigation.goBack();
  };
  const handleError = () => {
    setError(null);
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.headerImgCon}>
        <Images
          source={AppImages?.MyCareBridge}
          ImgStyle={styles.headerImg}
          resizeMode="contain"
        />
      </View>

      <Formik
        initialValues={{email: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {formikProps => (
          <View style={styles.container}>
            <View style={{paddingHorizontal: '5%', justifyContent: 'center'}}>
              {/* <View style={styles.imageContainer} /> */}

              <View style={styles.header}>
                <T title={'Forgot Password'} style={styles.greetingText} />
              </View>

              <ForgetPasswordForm
                formikProps={formikProps}
                onClick={handleClick}
                error={error}
                handleError={handleError}
                onEditSubmit={handleLogin}
                onLoading={lodar}
              />
            </View>
          </View>
        )}
      </Formik>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: Scale.moderateScale(40),
        }}>
        <View style={styles.headerBottomImgCon}>
          <Images
            source={AppImages?.PoweredByImg}
            headerImgStyle={styles.headerImg}
            resizeMode="contain"
          />
        </View>
      </View>
      {lodar && <Loader />}
      <FooterPrivacyPolicy />
    </View>
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
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
    color: 'black',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#575757',
    fontFamily: 'Inter-Medium',
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
    flex: 0.6,
  },
  headerBottomImgCon: {
    marginBottom: Scale.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImg: {alignSelf: 'center', height: 65, width: 150},
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  containersss: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 290,
    left: 0,
    right: 0,
  },
  loaders: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,

    alignItems: 'center',
  },
});

export default Forgot;

const Loader = () => {
  return (
    <View style={styles.containersss}>
      <View style={styles.loaders}>
        <ActivityIndicator size="large" color="#6A2382" />
      </View>
    </View>
  );
};
