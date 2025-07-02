import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Button from '../../../components/atoms/Button'; // Assuming you have a custom button component
import Input from '../../../components/atoms/Input'; // Assuming you have a custom input component
import CaseLoadInfoHeader from '../../../components/molecules/CaseLoadInfoHeader';
import {
  storageDelete,
  storageRead,
  storageWrite,
  wipeStorage,
} from '../../../utils/storageUtils';
import {
  changePassword,
  logout,
  updateUser,
} from '../../../services/authServices';
import {CommonActions} from '@react-navigation/native';
import InputField from '../../../components/molecules/InputField';
import UpdateEmailModal from '../../../components/organisms/UpdateEmailModal';
import ToastHandler from '../../../components/atoms/ToastHandler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../../../styles';
import VerifyEmailModal from '../../../components/VerifyEmailModal';
import useUpdateEmailHook from './useUpdateEmailHook';

const {width, height} = Dimensions.get('window');

// Validation Schema for profile update
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().required('Address is required'),
});

// Validation Schema for password change
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Minimum 8 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/[a-z]/, 'At least one lowercase letter')
    .matches(/[0-9]/, 'At least one number')
    .matches(/[!@#$%^&*]/, 'At least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const MyAccount = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isEditEmailOpen, setIsEditModal] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const {newEmail, currentPassword} = useUpdateEmailHook();
  useEffect(() => {
    const getUser = async () => {
      let result = await storageRead('userDetails');
      setUserDetails(result);
    };
    getUser();
  }, []);

  const handleProfileUpdate = async (values, formikActions) => {
    setIsLoading(true);
    let userData = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
    };
    try {
      let resp = await updateUser(userDetails.id, userData);
      formikActions.resetForm();
      ToastHandler(`${resp?.data?.message}`);
      let usersData = {
        ...userDetails,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
      };
      await storageWrite('userDetails', usersData);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MyTabs'}],
        }),
      );
    } catch (error) {
      console.error(error);
      ToastHandler(`Failed to change password`);
    } finally {
      setIsLoading(false);
    }
  };

  function askToChangePassword(values, formikActions) {
    Alert.alert(
      'Change Password',
      'Are you sure you want to update your password? Doing so will redirect you to the login page.', // Message
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setError(null);
            handlePasswordUpdate(values, formikActions);
          },
        },
      ],
      {cancelable: true},
    );
  }

  function askToUpdateProfile(values, formikActions) {
    Alert.alert(
      'Update Profile',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleProfileUpdate(values, formikActions);
          },
        },
      ],
      {cancelable: true},
    );
  }

  const handlePasswordUpdate = async (values, formikActions) => {
    setIsLoading(true);
    let datas = {
      current_password: values.currentPassword,
      new_password: values.newPassword,
    };
    try {
      let res = await changePassword(datas);
      ToastHandler(res?.data?.message);
      setPasswordModalVisible(false);
      await wipeStorage();
      setTimeout(() => {
        navigation.navigate('Auth', {screen: 'login'});
      }, 1000);
    } catch (error) {
      setError(error?.message);
      ToastHandler(`${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = data => {
    setResponseData(data);
    setIsEditModal(false);
    setTimeout(() => {
      setIsVerifyModalVisible(true);
    }, 1000);
  };
  const handleCloseVerifyModal = async () => {
    await storageDelete('EditUserPrevious');
    await storageDelete('updateEmailData');
    setIsVerifyModalVisible(!isVerifyModalVisible);
  };

  const handleResendOtp = data => {
    setResponseData(data);
  };
  useEffect(() => {}, [responseData]);
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <CaseLoadInfoHeader
        icon={'chevron-down'}
        name={'User Profile'}
        iconSize={34}
        iconColor={'black'}
        iconFirstPress={() => {
          navigation.goBack();
        }}
        iconFirst={'chevron-left'}
      />

      <View style={styles.container}>
        <Formik
          initialValues={{
            firstName: userDetails?.first_name || '',
            lastName: userDetails?.last_name || '',
            email: userDetails?.email || '',
            address: userDetails?.address || '',
          }}
          validationSchema={ProfileSchema}
          enableReinitialize
          onSubmit={(values, formikActions) =>
            askToUpdateProfile(values, formikActions)
          }>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            formikActions,
          }) => (
            <View>
              <Text style={styles.label}>First Name</Text>
              <InputField
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                placeholder="First Name"
                keyboardType="default"
                style={{}}
                initialSecureState={false}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.error}>{errors.firstName}</Text>
              )}

              <Text style={styles.label}>Last Name</Text>
              <InputField
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                placeholder="Last Name"
                keyboardType="default"
                style={{}}
                initialSecureState={false}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.error}>{errors.lastName}</Text>
              )}

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholderTextColor={'black'}
                editable={false}
                style={[styles.input, {color: 'grey', borderRadius: 30}]}
                placeholder="Email"
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text
                onPress={() => {
                  setIsEditModal(true);
                }}
                style={[styles.label, {textAlign: 'right', color: '#6A2382'}]}>
                Update Email
              </Text>

              <Text style={styles.label}>Address</Text>
              <TextInput
                placeholderTextColor={'black'}
                editable={false}
                style={[
                  styles.input,
                  {height: 100, textAlignVertical: 'top', color: 'grey'},
                ]}
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                multiline
              />
              {touched.address && errors.address && (
                <Text style={styles.error}>{errors.address}</Text>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, {width: '49%', borderRadius: 30}]}
                  onPress={() => setPasswordModalVisible(true)}>
                  <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, {width: '45%', borderRadius: 30}]}
                  onPress={() => {
                    handleSubmit(values, formikActions);
                  }}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Update Profile</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>

      {/* Password Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            margin: 0,
            padding: 0,
          }}
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chnage Password</Text>

              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={PasswordSchema}
                onSubmit={askToChangePassword}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  formikActions,
                }) => (
                  <View>
                    <Text style={styles.label}>Current Password</Text>
                    {/* <TextInput
                    placeholderTextColor={'black'}
                    style={styles.input}
                    placeholder="Enter current password"
                    secureTextEntry
                    onChangeText={handleChange('currentPassword')}
                    onBlur={handleBlur('currentPassword')}
                    value={values.currentPassword}
                  /> */}
                    <InputField
                      value={values.currentPassword}
                      onChangeText={handleChange('currentPassword')}
                      onBlur={handleBlur('currentPassword')}
                      placeholder="Enter current password"
                      style={{}}
                      icon={true}
                      initialSecureState={true}
                    />
                    {touched.currentPassword && errors.currentPassword && (
                      <Text style={styles.error}>{errors.currentPassword}</Text>
                    )}

                    <Text style={styles.label}>New Password</Text>
                    {/* <TextInput
                    placeholderTextColor={'black'}
                    style={styles.input}
                    placeholder="Enter new password"
                    secureTextEntry
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    value={values.newPassword}
                  /> */}
                    <InputField
                      value={values.newPassword}
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
                      placeholder="Enter new password"
                      style={{}}
                      icon={true}
                      initialSecureState={true}
                    />
                    {touched.newPassword && errors.newPassword && (
                      <Text style={styles.error}>{errors.newPassword}</Text>
                    )}

                    <Text style={styles.label}>Confirm Password</Text>
                    {/* <TextInput
                    style={styles.input}
                    placeholderTextColor={'black'}
                    placeholder="Enter confirm password"
                    secureTextEntry
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                  /> */}
                    <InputField
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      placeholder="Enter confirm password"
                      style={{}}
                      icon={true}
                      initialSecureState={true}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.error}>{errors.confirmPassword}</Text>
                    )}
                    {error && (
                      <View>
                        <Text style={{textAlign: 'center', color: 'red'}}>
                          {error}
                        </Text>
                      </View>
                    )}
                    <View style={styles.modalButtonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {borderRadius: 30, alignSelf: 'center'},
                        ]}
                        onPress={() => {
                          handleSubmit(values, formikActions);
                        }}>
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.buttonText}>Submit</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>

      <UpdateEmailModal
        isVisible={isEditEmailOpen}
        onClose={() => setIsEditModal(false)}
        onResponse={handleResponse}
      />
      <VerifyEmailModal
        isVisible={isVerifyModalVisible}
        onClose={handleCloseVerifyModal}
        responseData={responseData}
        renSendOtp={handleResendOtp}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    fontSize: width * 0.037,
    fontWeight: '400',
    marginBottom: height * 0.01,
    color: 'grey',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderRadius: 5,
    color: 'black',
    fontSize: width * 0.04,
  },
  error: {
    color: 'red',
    fontSize: width * 0.03,
  },
  button: {
    backgroundColor: '#6A2382',
    padding: width * 0.03,
    borderRadius: 5,
    alignItems: 'center',
    width: width * 0.4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.04,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'white',
    padding: width * 0.05,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    marginBottom: height * 0.02,
    color: 'grey',
  },
  modalButtonContainer: {
    marginTop: height * 0.02,
  },
});

export default MyAccount;
