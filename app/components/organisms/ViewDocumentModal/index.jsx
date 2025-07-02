import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {getFileExtension} from '../../../utils/common';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SvgUri from 'react-native-svg-uri';
import {SvgXml} from 'react-native-svg';
import RNFS from 'react-native-fs';

const ViewDocumentModal = ({visible, onClose, documentUrl}) => {
  const [localFilePath, setLocalFilePath] = useState(null);
  const [rotateDeg, setRotateDeg] = useState(0);
  const extension = getFileExtension(documentUrl);
  const [loading, setLoading] = useState(true);

  const [svgContent, setSvgContent] = React.useState('');

  useEffect(() => {
    if (localFilePath && extension === 'svg') {
      const readSvgFile = async () => {
        try {
          const fileContent = await RNFS.readFile(localFilePath, 'utf8');
          setSvgContent(fileContent);
        } catch (error) {
          console.error('Error reading SVG file:', error);
        }
      };

      readSvgFile();
    }
  }, [localFilePath, extension]);

  const onBuffer = () => {
    setLoading(true);
  };

  const videoError = () => {
    setLoading(false);
  };
  const handleClose = () => {
    setLoading(true);
    onClose();
    setLocalFilePath(null);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      setLocalFilePath(null);
    }
  }, [visible, documentUrl]);

  const renderDocumentContent = () => {
    if (!documentUrl || !extension) {
      return null;
    }

    if (extension === 'pdf') {
      return (
        <View style={{flex: 1}}>
          {documentUrl ? (
            <View
              style={{
                backgroundColor: 'white',
              }}>
              <Pdf
                onLoadProgress={pre => {}}
                trustAllCerts={false}
                source={{uri: documentUrl}}
                onLoadComplete={(numberOfPages, filePath) => {}}
                onPageChanged={(page, numberOfPages) => {}}
                onError={error => {}}
                onPressLink={uri => {}}
                style={{
                  height: '95%',
                  width: Platform.OS === 'ios' ? 310 : 330,
                }}
              />
            </View>
          ) : (
            <Text style={{textAlign: 'center', color: 'black', width: 330}}>
              Loading...
            </Text>
          )}
        </View>
      );
    } else if (
      extension === 'png' ||
      extension === 'jpg' ||
      extension === 'jpeg'
    ) {
      return (
        <>
          {documentUrl ? (
            <Image
              source={{uri: documentUrl}}
              style={{height: '90%', width: '100%'}}
              resizeMode="stretch"
            />
          ) : (
            <Text style={{textAlign: 'center', color: 'black', width: 330}}>
              Loading...
            </Text>
          )}
        </>
      );
    } else if (extension === 'svg') {
      return (
        <>
          {svgContent ? (
            <SvgXml xml={svgContent} width={320} height="100%" />
          ) : (
            <Text style={{textAlign: 'center', color: 'black', width: 330}}>
              Loading SVG...
            </Text>
          )}
        </>
      );
    } else if (extension === 'docs' || extension === 'docx') {
      return (
        <Text style={{textAlign: 'center', width: 330}}>
          File not supported
        </Text>
      );
    } else if (extension === 'mp4' || extension === 'mov') {
      return (
        <View style={{height: '90%', width: '100%'}}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <Video
            source={{uri: documentUrl}}
            controls={true}
            style={styles.backgroundVideo}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const rotateVideo = () => {
    setRotateDeg(prevDeg => prevDeg + 90);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      animationType="slide"
      transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              backgroundColor: 'rgba(106,35,130,.102)',
            }}>
            <View
              style={{
                width: '55%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <Text style={styles.headerText}>View</Text>
            </View>
            <View style={{width: '54%', padding: 5}}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              height: '95%',
              justifyContent: 'center',
              alignItems: 'baseline',
              marginHorizontal: 10,
            }}>
            {renderDocumentContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: '70%',
    width: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: '#6A2382',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginRight: '18%',
  },
  rotateButton: {
    backgroundColor: '#6A2382',
    borderRadius: 50,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ViewDocumentModal;
