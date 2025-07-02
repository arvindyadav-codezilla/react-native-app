// import React from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import {Colors} from '../../../styles';
// import useUpdateEmailHook from '../../../containers/Authentication/MyAccount/useUpdateEmailHook';

// const UpdateEmailModal = ({isVisible, onClose, onResponse}) => {
//   const {
//     newEmail,
//     currentPassword,
//     isLoading,
//     handleNewEmailChange,
//     handleCurrentPasswordChange,
//     resetFields,
//     submitUpdateEmail,
//   } = useUpdateEmailHook();

//   const handleClose = () => {
//     resetFields();
//     onClose();
//   };

//   const handleSubmit = async () => {
//     let res = await submitUpdateEmail();
//     if (res?.status === 200) {
//       onResponse(res.data);
//     } else {
//       console.error('Error:', res?.message || 'Failed to update email');
//     }
//     resetFields();
//   };

//   return (
//     <Modal transparent visible={isVisible} animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Update Email</Text>
//             <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
//               <Text style={styles.closeButtonText}>×</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.body}>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter New Email"
//               value={newEmail}
//               onChangeText={handleNewEmailChange}
//               keyboardType="email-address"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Current Password"
//               value={currentPassword}
//               onChangeText={handleCurrentPasswordChange}
//               secureTextEntry
//             />
//           </View>
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               newEmail && currentPassword
//                 ? styles.activeButton
//                 : styles.disabledButton,
//             ]}
//             onPress={handleSubmit}
//             disabled={!newEmail || !currentPassword || isLoading}>
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Submit</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.textPrimary,
//   },
//   closeButton: {
//     padding: 10,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.textSecondary,
//   },
//   body: {
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.borderColor,
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 14,
//     color: Colors.textPrimary,
//   },
//   submitButton: {
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   activeButton: {
//     backgroundColor: '#6A2382',
//   },
//   disabledButton: {
//     backgroundColor: Colors.disabledGrey,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default UpdateEmailModal;

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Colors} from '../../../styles';
import {Formik} from 'formik';
import * as Yup from 'yup';
import useUpdateEmailHook from '../../../containers/Authentication/MyAccount/useUpdateEmailHook';

const UpdateEmailModal = ({isVisible, onClose, onResponse}) => {
  const {
    newEmail,
    currentPassword,
    isLoading,
    handleNewEmailChange,
    handleCurrentPasswordChange,
    resetFields,
    submitUpdateEmail,
    error,
    clearError,
  } = useUpdateEmailHook();

  const handleSubmit = async (values, {setSubmitting, resetForm}) => {
    clearError();
    try {
      const res = await submitUpdateEmail(
        values.newEmail,
        values.currentPassword,
      );
      console.log('res', res);
      if (res?.status === 200) {
        onResponse(res.data);
      } else {
        console.error('Error:', res?.message || 'Failed to update email');
      }
    } catch (error) {
      console.error('Error:', error.message || 'An error occurred');
    } finally {
      // setSubmitting(false);
      // resetForm();
    }
  };

  const validationSchema = Yup.object().shape({
    newEmail: Yup.string()
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Invalid email address (spaces are not allowed)',
      )
      .email('Invalid email address')
      .required('Email is required'),
    currentPassword: Yup.string()
      .required('Password is required')
      .matches(/^\S*$/, 'Password cannot contain spaces'),
  });
  const oncloseRequest = () => {
    clearError();
    onClose();
  };
  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Email</Text>
            <TouchableOpacity
              onPress={oncloseRequest}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <Formik
            initialValues={{newEmail: '', currentPassword: ''}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={styles.body}>
                  <View>
                    <Text style={styles.label}>New Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={'black'}
                      placeholder="Enter New Email"
                      value={values.newEmail}
                      onChangeText={handleChange('newEmail')}
                      onBlur={handleBlur('newEmail')}
                      keyboardType="email-address"
                    />
                    {touched.newEmail && errors.newEmail && (
                      <Text style={styles.errorText}>{errors.newEmail}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={'black'}
                      placeholder="Enter Current Password"
                      value={values.currentPassword}
                      onChangeText={handleChange('currentPassword')}
                      onBlur={handleBlur('currentPassword')}
                      secureTextEntry
                    />
                    {touched.currentPassword && errors.currentPassword && (
                      <Text style={styles.errorText}>
                        {errors.currentPassword}
                      </Text>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                    textAlign: 'center',
                    paddingBottom: 10,
                  }}>
                  {error}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    values.newEmail && values.currentPassword && !isSubmitting
                      ? styles.activeButton
                      : styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={
                    !values.newEmail || !values.currentPassword || isSubmitting
                  }>
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  body: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: Colors.black,
  },
  errorText: {
    fontSize: 12,
    color: Colors.dangerRed,
    marginBottom: 10,
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#6A2382',
  },
  disabledButton: {
    backgroundColor: Colors.disabledGrey,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateEmailModal;
