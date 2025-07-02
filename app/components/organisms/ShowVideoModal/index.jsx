import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CaseLoadInfoHeader from '../../molecules/CaseLoadInfoHeader';
import {handleDownloadDocument} from '../../../utils/common';

const ShowVideoModal = ({visible, data, onClose}) => {
  const videoRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(true);
  const [disable, setDisable] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const handleVideoPress = () => {
    setShowControls(prevShowControls => !prevShowControls);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.dismissFullscreenPlayer();
        videoRef.current.seek(0);
      }
    };
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      const {width, height} = Dimensions.get('window');
      setIsPortrait(height > width);
    };

    Dimensions.addEventListener('change', updateOrientation);
    return () => {};
  }, []);

  const handleModalClose = () => {
    videoRef.current?.pause();
    onClose();
  };

  const handleDownload = async () => {
    try {
      await handleDownloadDocument(data, setDisable);
    } catch (error) {
      setDisable(false);
    }
  };

  if (!data?.url) {
    return null;
  }

  return (
    <Modal visible={visible} transparent onRequestClose={handleModalClose}>
      <View style={styles.modalContainer}>
        <SafeAreaView style={{flex: 1}}>
          <CaseLoadInfoHeader
            iconFirstPress={() => {
              handleModalClose();
            }}
            iconFirst={'chevron-left'}
            name={'Video'}
            iconSize={34}
            iconColor={'black'}
          />

          <View
            style={[
              styles.videoContainer,
              {height: isPortrait ? '40%' : '80%'},
            ]}>
            {isBuffering && (
              <ActivityIndicator
                size="large"
                color="#6A2382"
                style={styles.loadingIndicator}
              />
            )}

            <Video
              rate={0.7}
              selectedVideoTrack={{
                type: 'resolution',
                value: 240,
              }}
              ref={videoRef}
              source={{
                uri: data?.url,
                cache: {size: 500, expiresIn: 3600},
              }}
              style={styles.video}
              resizeMode="cover"
              controls={true}
              paused={false}
              onLoadStart={() => setIsBuffering(true)}
              onBuffer={({isBuffering}) => setIsBuffering(isBuffering)}
              onLoad={() => setIsBuffering(false)}
              onError={error => {
                console.error('Video Error:', error);
              }}
            />
          </View>
          <TouchableOpacity
            disabled={disable}
            onPress={() => {
              videoRef.current?.pause();
              handleDownload();
            }}
            style={styles.downloadButton}>
            <AntDesign name="download" size={20} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
      {disable && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={{color: 'white', fontSize: 22}}>Downlading...</Text>
          </View>
          <ActivityIndicator
            size="large"
            color="#6A2382"
            style={styles.loadingIndicator}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
  },
  downloadButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'flex-end',
    padding: 10,
    margin: 10,
    borderRadius: 30,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
});

export default ShowVideoModal;
