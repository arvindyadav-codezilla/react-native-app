import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {Colors} from '../../styles';
import {updateEmail, verifyupdateEmailOtp} from '../../services/authServices';
import {
  storageDelete,
  storageRead,
  storageWrite,
} from '../../utils/storageUtils';
import Icon from 'react-native-vector-icons/Entypo'; // Or use another icon set like FontAwesome

const VerifyEmailModal = ({isVisible, onClose, renSendOtp, navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(9);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendDisiable, setResendDisiable] = useState(false);
  useEffect(() => {
    if (isVisible) {
      setResendTimer(60);
    }
  }, [isVisible]);
  useEffect(() => {
    let countdown;
    if (isSuccess && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      onClose();
      navigation?.navigate('Auth');
    }
    return () => clearInterval(countdown);
  }, [isSuccess, timer]);

  useEffect(() => {
    let countdown;
    if (resendTimer > 0) {
      countdown = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [resendTimer, isVisible]);

  const handleOtpInput = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    setError('');

    // Validate OTP fields
    if (otp.some(digit => digit === '')) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    const enteredOtp = otp.join('');
    try {
      const getData = await storageRead('updateEmailData');
      const data = {
        token: getData?.data?.token,
        otp: enteredOtp,
      };

      const response = await verifyupdateEmailOtp(data);

      // Clear stored data after successful verification
      await storageDelete('EditUserPrevious');
      await storageDelete('updateEmailData');
      await storageDelete('accessToken');
      await storageDelete('userDetails');

      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    }
  };

  const resendOtp = async () => {
    setResendDisiable(true);
    try {
      const EditUserPrevious = await storageRead('EditUserPrevious');
      const data = {
        new_email: EditUserPrevious?.new_email,
        password: EditUserPrevious?.password,
      };

      const response = await updateEmail(data);
      renSendOtp(response.data);
      setResendTimer(60);
      setResendDisiable(false);
      await storageWrite('updateEmailData', response?.data);

      Alert.alert('MyCareBridge', 'OTP sent to the new email successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    }
  };
  const isOtpValid = otp.some(digit => digit === '');

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(60);
    setTimer(9);
    onClose();
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            {!isSuccess ? (
              <Text style={styles.title}>Verify OTP</Text>
            ) : (
              <Text style={styles.title}>Success</Text>
            )}
            {!isSuccess && (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.body}>
            {isSuccess ? (
              <>
                <Text style={styles.successMessage}>
                  Your email address has been successfully updated. You will be
                  redirected to the login page in a moment.
                </Text>
                <Text style={styles.timerText}>
                  Closing in {timer} seconds...
                </Text>
              </>
            ) : (
              <>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={value => handleOtpInput(value, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      ref={ref => (inputRefs.current[index] = ref)}
                      onKeyPress={e => handleKeyPress(e, index)}
                    />
                  ))}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.actions}>
                  <TouchableOpacity
                    disabled={isOtpValid}
                    style={[
                      styles.actionButton,
                      isOtpValid && {backgroundColor: 'grey'},
                    ]}
                    onPress={verifyOtp}>
                    <Text style={styles.actionButtonText}>Verify OTP</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: 'grey',
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      paddingVertical: 10,
                    }}>
                    Didn't get the OTP?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      disabled={resendTimer > 0 || resendDisiable}
                      style={{justifyContent: 'center', paddingHorizontal: 5}}
                      onPress={resendOtp}>
                      <Text
                        style={[
                          {color: '#6A2382'},
                          resendTimer > 0 && {
                            color: Colors.disabledGrey,
                          },
                        ]}>
                        Resend
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        {color: 'grey'},
                        resendTimer > 0 && {
                          color: Colors.disabledGrey,
                        },
                      ]}>
                      it again
                    </Text>
                  </View>
                </View>
                {resendTimer !== 0 && (
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Icon name="stopwatch" size={20} color="#6A2382" />

                    <Text
                      style={{
                        color: '#6A2382',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingHorizontal: 6,
                      }}>
                      {resendTimer} Second
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textColor,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#6A2382',
    borderRadius: 50,
    width: 45,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  body: {
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 16,
    color: Colors.textColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textColor,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 46,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.textColor,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
    color: Colors.textColor,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  actionButton: {
    backgroundColor: '#6A2382',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 18,
    textAlign: 'center',
  },
});

export default VerifyEmailModal;
