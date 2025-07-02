// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Modal,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import {useSelector} from 'react-redux';
// import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
// import CaseLoadInfoHeader from '../../molecules/CaseLoadInfoHeader';
// import ActivityIndicators from '../../atoms/ActivityIndicators';
// import {SvgXml} from 'react-native-svg';
// import {uploadIcon} from '../../../assets/SvgImages';
// import ToastHandler from '../../atoms/ToastHandler';
// import {uploadDocumet} from '../../../services/documentServices';

// const UploadDocument = ({visible, closeModal}) => {
//   const overViewData = useSelector(selectOverViewData);
//   const caseloadId = overViewData?.id;
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [fileExtension, setFileExtension] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (visible) {
//       setFile(null);
//       setFileName('');
//       setFileExtension('');
//     }
//   }, [visible]);

//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.pickSingle({
//         type: [
//           DocumentPicker.types.pdf,
//           DocumentPicker.types.images,
//           DocumentPicker.types.docx,
//         ],
//       });
//       setFile(result);
//       const fileNameParts = result.name.split('.');
//       const extension = fileNameParts[fileNameParts.length - 1];
//       setFileExtension(extension);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//       } else {
//         throw err;
//       }
//     }
//   };

//   const uploadDocument = async () => {
//     if (!fileName) {
//       return Alert.alert('MyCareBridge', 'please enter the file name');
//     }
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('document_name', fileName);
//     formData.append('uploadType', 'caseload');
//     formData.append('caseload_id', caseloadId);
//     let headers = {
//       'Content-Type': 'multipart/form-data',
//     };
//     try {
//       const response = await uploadDocumet(formData, headers);
//       if (response) {
//         ToastHandler(`${response?.data?.document_type} Uplaoded successfully`);
//         setFile(null);
//         setFileName('');
//         setFileExtension('');
//         closeModal();
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error(error);
//     }
//   };
//   const buttonEnable = file && fileName;

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={closeModal}>
//       <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
//         <CaseLoadInfoHeader
//           iconFirstPress={closeModal}
//           iconFirst={'chevron-left'}
//           icon={'chevron-down'}
//           name={'Upload Document'}
//           iconSize={34}
//           iconColor={'black'}
//         />
//         <View style={styles.container}>
//           <View style={styles.formContainer}>
//             {/* <Text style={styles.label}>Select File</Text> */}
//             <TouchableOpacity
//               onPress={pickDocument}
//               style={styles.fileContainer}>
//               {file ? (
//                 <>
//                   <View
//                     style={{
//                       marginHorizontal: 10,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Text style={styles.fileText}>Selected File:</Text>
//                     <Text style={styles.fileText}>{file.name}</Text>
//                   </View>
//                 </>
//               ) : (
//                 <TouchableOpacity
//                   style={styles.uploadButton}
//                   onPress={pickDocument}>
//                   <SvgXml xml={uploadIcon()} width={60} height={60} />
//                   <View style={styles.uploadTextContainer}>
//                     <Text style={styles.uploadText}>Browse files</Text>
//                     <Text style={styles.supportedFormats}>
//                       Support format: JPEG, PNG, PDF, WORD
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             </TouchableOpacity>
//             <Text style={styles.label}>File Name</Text>
//             <TextInput
//               placeholder="Enter File Name"
//               placeholderTextColor={'#666'}
//               value={fileName}
//               onChangeText={text => setFileName(text)}
//               style={styles.input}
//             />
//             <TouchableOpacity
//               style={[
//                 styles.uploadButton,
//                 {backgroundColor: buttonEnable ? '#6A2382' : '#ccc'},
//               ]}
//               onPress={uploadDocument}
//               disabled={!buttonEnable}>
//               <Text style={styles.buttonText}>Upload Document</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <ActivityIndicators
//           size="large"
//           color="#6A2382"
//           visible={loading}
//           style={{backgroundColor: 'white'}}
//         />
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   formContainer: {
//     width: '90%',
//     padding: 20,
//     marginTop: 80,
//   },
//   label: {
//     padding: 5,
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//     color: 'black',
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 10,
//     borderRadius: 5,
//     color: 'black',
//   },
//   fileContainer: {
//     marginTop: 10,
//     marginBottom: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: 'black',
//     height: 150,
//     width: '100%',
//     justifyContent: 'center',
//     borderRadius: 3,
//     padding: 10,
//   },
//   uploadButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   uploadTextContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   uploadText: {
//     color: '#6A2382',
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//   },
//   supportedFormats: {
//     color: '#2A2F45',
//     textAlign: 'center',
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//   },
//   buttonText: {
//     color: 'white',
//     fontFamily: 'Inter-Medium',
//   },
//   fileText: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: 'black',
//   },
// });

// export default UploadDocument;

import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
import CaseLoadInfoHeader from '../../molecules/CaseLoadInfoHeader';
import ActivityIndicators from '../../atoms/ActivityIndicators';
import {SvgXml} from 'react-native-svg';
import {uploadIcon} from '../../../assets/SvgImages';
import ToastHandler from '../../atoms/ToastHandler';
import {uploadDocumet} from '../../../services/documentServices';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {selectNetworkError} from '../../../containers/Authentication/Login/networkSlice';
import NetWorkErrorToast from '../NetWorkErrorToast';

const UploadDocument = ({visible, closeModal}) => {
  const overViewData = useSelector(selectOverViewData);
  const caseloadId = overViewData?.id;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setFile(null);
      setFileName('');
      setFileExtension('');
    }
  }, [visible]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
      setFile(result);
      const fileNameParts = result.name.split('.');
      const extension = fileNameParts[fileNameParts.length - 1];
      setFileExtension(extension);
      setPickerVisible(false);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        // throw err;
      }
    }
  };

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });
      if (image) setFile(image);
      const fileNameParts = image.path.split('/');
      const name = fileNameParts[fileNameParts.length - 1];
      const extension = name.split('.').pop();
      setFileExtension(extension);
      setPickerVisible(false);
    } catch (err) {}
  };

  const uploadDocument = async () => {
    if (!fileName) {
      return Alert.alert('MyCareBridge', 'please enter the file name');
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: file.path || file.uri,
      type: file.mime || file.type,
      name: file.name || file.path.split('/').pop(),
    });
    formData.append('document_name', fileName);
    formData.append('uploadType', 'caseload');
    formData.append('caseload_id', caseloadId);
    let headers = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const response = await uploadDocumet(formData, headers);
      if (response) {
        ToastHandler(`${response?.data?.document_type} Uplaoded successfully`);
        setFile(null);
        setFileName('');
        setFileExtension('');
        closeModal();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const buttonEnable = file && fileName;
  const isNetworkError = useSelector(selectNetworkError);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <CaseLoadInfoHeader
          iconFirstPress={closeModal}
          iconFirst={'chevron-left'}
          icon={'chevron-down'}
          name={'Upload Document'}
          iconSize={34}
          iconColor={'black'}
        />
        <View style={{marginHorizontal: '2%'}}>
          <Text
            style={{
              color: 'grey',
              padding: 4,
              textAlign: 'left',
              marginTop: 5,
              marginBottom: 5,
              letterSpacing: 0.8,
              marginHorizontal: 5,
            }}>
            Please upload any relevant supporting information you wish to share
            with our clinical team in this section. For example, you may wish to
            share reports from other NHS or private health professionals, or
            reports from other professionals or volunteers who know your child
            well (for example, tutors, club leaders or other mentors). If your
            child attends more than one education setting, additional reports
            from these settings can also be added here.
          </Text>
        </View>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          behavior="padding">
          <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
              <View style={styles.formContainer}>
                <TouchableOpacity
                  onPress={() => setPickerVisible(true)}
                  style={styles.fileContainer}>
                  {file ? (
                    <>
                      <View
                        style={{
                          marginHorizontal: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.fileText}>Selected File:</Text>
                        <Text style={styles.fileText}>
                          {file.name || file.path.split('/').pop()}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => setPickerVisible(true)}>
                      <SvgXml xml={uploadIcon()} width={60} height={60} />
                      <View style={styles.uploadTextContainer}>
                        <Text style={styles.uploadText}>
                          Choose File: JPEG,JPG,PDF
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                <Text style={styles.label}>File Name</Text>
                <TextInput
                  placeholder="Enter File Name"
                  placeholderTextColor={'#666'}
                  value={fileName}
                  onChangeText={text => setFileName(text)}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    {backgroundColor: buttonEnable ? '#6A2382' : '#ccc'},
                  ]}
                  onPress={uploadDocument}
                  disabled={!buttonEnable}>
                  <Text style={styles.buttonText}>Upload Document</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <ActivityIndicators
          size="large"
          color="#6A2382"
          visible={loading}
          style={{backgroundColor: 'white'}}
        />
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerOptions}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={pickDocument}>
              <Text style={styles.pickerButtonText}>Select Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
              <Text style={styles.pickerButtonText}>Select Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {isNetworkError?.isNetworkError && <NetWorkErrorToast />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    width: '90%',
    // padding: 20,
    // marginTop: 80,
  },
  label: {
    padding: 5,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    color: 'black',
  },
  fileContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
    height: 150,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 3,
    padding: 10,
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#6A2382',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
  },
  fileText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'black',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerOptions: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  pickerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#6A2382',
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

export default UploadDocument;
