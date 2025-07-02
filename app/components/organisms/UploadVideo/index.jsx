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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
import CaseLoadInfoHeader from '../../molecules/CaseLoadInfoHeader';
import ActivityIndicators from '../../atoms/ActivityIndicators';
import T from '../../atoms/T';
import ToastHandler from '../../atoms/ToastHandler';
import {uploadDocumet} from '../../../services/documentServices';
import {SvgXml} from 'react-native-svg';
import {uploadIcon} from '../../../assets/SvgImages';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NetWorkErrorToast from '../NetWorkErrorToast';
import {selectNetworkError} from '../../../containers/Authentication/Login/networkSlice';

const UploadVideo = ({visible, closeModal}) => {
  const overViewData = useSelector(selectOverViewData);
  const caseloadId = overViewData?.id;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (visible) {
      setFile('');
      setFileName('');
      setFileExtension('');
      setUploadProgress(0);
      setError(null);
    }
  }, [visible]);
  const pickDocument = async () => {
    setError(null);

    try {
      const result = await ImagePicker.openPicker({
        mediaType: 'video',
        compressVideoPreset: 'Passthrough',
      });
      if (result.size > 200 * 1024 * 1024) {
        // 200 MB in bytes
        Alert.alert(
          'MyCareBridge',
          'File size exceeds 200 MB. Please select a smaller file.',
        );
        return;
      }
      setFile(result);
      const fileNameParts = result.path.split('/');
      const fullName = fileNameParts[fileNameParts.length - 1];
      const extension = fullName.split('.').pop();

      setFileExtension(extension);
    } catch (err) {}
  };
  const uploadVideo = async () => {
    setError(null);
    if (!fileName) {
      return Alert.alert('MyCareBridge', 'please enter the file name');
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: file.path,
      type: file.mime,
      name: fileExtension,
    });
    formData.append('document_name', fileName);
    formData.append('uploadType', 'caseload');
    formData.append('caseload_id', caseloadId);
    let headers = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const response = await uploadDocumet(formData, headers, progressEvent => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
        setUploadProgress(progress);
      });
      console.log('response>>>>>>>>>', response);
      if (response && response.status) {
        ToastHandler(`${response?.data?.document_type} Uploaded successfully`);
        setFile('');
        setFileName('');
        setFileExtension('');
        closeModal();
      } else {
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
      <SafeAreaView style={{flex: 1}}>
        <CaseLoadInfoHeader
          iconFirstPress={closeModal}
          iconFirst={'chevron-left'}
          icon={'chevron-down'}
          name={'Upload Video'}
          iconSize={34}
          iconColor={'black'}
        />
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <View style={{marginHorizontal: '2%'}}>
              <Text
                style={{
                  color: 'grey',
                  padding: 4,
                  textAlign: 'left',
                  marginTop: 5,
                  marginBottom: 5,
                  letterSpacing: 0.8,
                }}>
                If you would like to support your written information with an
                optional video, please upload a short video{' '}
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                  }}>
                  (no more than 2 minutes)
                </Text>{' '}
                of{' '}
                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                  }}>{`${overViewData?.patient_name}`}</Text>{' '}
                playing and interacting. Please do not include other children in
                the video.
              </Text>
              <Text
                style={{
                  color: 'grey',
                  padding: 4,
                  textAlign: 'left',
                  marginTop: 5,
                  marginBottom: 5,
                  letterSpacing: 0.8,
                }}>
                {
                  'This video will be reviewed by our clinicians to help them understand your child/young person’s needs, and will be stored securely and confidentially in line with NHS guidelines.'
                }
              </Text>
            </View>
            <View style={styles.formContainer}>
              <View style={{alignSelf: 'flex-start'}}>
                <Text
                  style={{
                    padding: 5,
                    fontSize: 18,
                    fontFamily: 'Inter-Bold',
                    color: 'black',
                  }}>
                  Select Video File
                </Text>
              </View>
              <TouchableOpacity
                onPress={pickDocument}
                style={styles.fileContainer}>
                {file ? (
                  <>
                    <View
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fileText}>Selected Video File:</Text>
                      <Text style={styles.fileText}>
                        {file.path.split('/').pop()}
                      </Text>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={pickDocument}>
                    <SvgXml xml={uploadIcon()} />
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <T title={'Browse files '} style={{color: '#6A2382'}} />
                      <T
                        title={'Support format: MP4'}
                        style={{
                          textAlign: 'center',
                          color: '#2A2F45',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              <TextInput
                placeholder="Enter File Name"
                placeholderTextColor={'black'}
                value={fileName}
                onChangeText={text => setFileName(text)}
                style={styles.input}
              />
              {error && (
                <Text
                  style={{color: 'red', textAlign: 'center', marginTop: -10}}>
                  {error && 'Server Error! try again later'}
                </Text>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    {backgroundColor: buttonEnable ? '#6A2382' : '#ccc'},
                  ]}
                  onPress={uploadVideo}
                  disabled={!buttonEnable}>
                  <Text style={styles.buttonText}>Upload Video</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {loading && (
          <View style={styles.progressBar}>
            <View
              style={{
                width: `${uploadProgress}%`,
                height: 10,
                backgroundColor: '#6A2382',
                borderRadius: 5,
                marginBottom: -5,
              }}
            />
            <Text style={styles.progressText}>{`${uploadProgress}%`}</Text>
          </View>
        )}
        {isNetworkError?.isNetworkError && <NetWorkErrorToast />}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 50,
  },
  formContainer: {
    width: '90%',
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
  buttonContainer: {
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Inter-Medium',
  },
  fileContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 3,
  },
  fileText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'black',
  },
  progressBar: {
    marginTop: 50,
    width: '100%',
    height: 30,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Inter-Medium',
    color: '#6A2382',
  },
});

export default UploadVideo;
