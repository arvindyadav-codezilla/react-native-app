import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {get} from '../../../utils/api';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {selectOverViewData} from '../../Casleoad/Overview/OverViewSlice';
import {useSelector} from 'react-redux';
import {
  getDateString,
  getFileExtension,
  getTimeString,
} from '../../../utils/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import T from '../../../components/atoms/T';
import {viewVideoDocumentResource} from '../../../services/documentServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewDocumentModal from '../../../components/organisms/ViewDocumentModal';
import Video from 'react-native-video';
import ShowVideoModal from '../../../components/organisms/ShowVideoModal';

const {width} = Dimensions.get('window');

const Videos = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const overViewData = useSelector(selectOverViewData);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [documentView, setDocumentView] = useState(false);
  const [disable, setDisable] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    fetchDocumentsFromAPI();
  }, []);

  const toggleVideoView = () => {
    setShowVideo(!showVideo);
  };

  const fetchDocumentsFromAPI = async () => {
    let data = await AsyncStorage.getItem('userDetails');
    let userData = JSON.parse(data);

    setLoading(true);
    try {
      const response = await viewVideoDocumentResource();
      setDocuments(response.data.data.resources);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching documents:', error);
    }
  };

  const handleViewDocument = document => {
    setSelectedDocumentUrl(document.url);
    setDocumentView(!documentView);
  };

  const onCloseDocumentView = () => {
    fetchDocumentsFromAPI();
    setDocumentView(false);
  };

  const renderVideoItem = ({item}) => {
    const videoUrl = item.url;
    let result = getFileExtension(item?.url);
    return (
      <View style={[styles.card]}>
        {/* <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Entypo name="text-document" size={20} color="#6A2382" />
          </View>
          <View style={styles.iconActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleViewDocument(item)}>
              <Ionicons name="eye-outline" size={20} color="#6A2382" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              style={[styles.iconButton, styles.downloadButton]}
              onPress={() =>
                handleDownloadDocument(item, status => {
                  setDisable(status);
                })
              }>
              <AntDesign name="download" size={20} color="#6A2382" />
            </TouchableOpacity>
          </View>
        </View> */}
        <TouchableOpacity
          // onPress={() => handleViewDocument(item)}
          onPress={() => {
            toggleVideoView();
            setVideoData(item);
          }}
          style={styles.videoContainer}>
          <Video
            source={{uri: videoUrl}}
            style={styles.videoThumbnail}
            paused={true}
          />
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              // onPress={() => handleViewDocument(item)}
              onPress={() => {
                toggleVideoView();
                setVideoData(item);
              }}>
              <Ionicons name="play-circle" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <T
            title={`${item.document_name}.${result}`}
            style={styles.cardTitle}
          />
          <View style={styles.cardFooter}>
            <T title={'By:'} style={styles.cardFooterText} />
            <T
              title={item?.uploadedBy?.first_name}
              style={styles.cardFooterAuthor}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.cardDates}>
            <T title={getDateString(item?.createdAt)} style={styles.cardDate} />
            <T title={getTimeString(item?.createdAt)} style={styles.cardDate} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={documents?.filter(item => item.document_type === 'video')}
          renderItem={renderVideoItem}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No video found</Text>
            </View>
          )}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchDocumentsFromAPI}
              colors={['#6A2382']}
              tintColor="#6A2382"
            />
          }
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <ViewDocumentModal
          visible={documentView}
          documentUrl={selectedDocumentUrl}
          onClose={onCloseDocumentView}
        />
      </View>
      <ActivityIndicators
        size="large"
        color="#6A2382"
        visible={loading}
        style={{backgroundColor: 'white'}}
      />
      {showVideo && (
        <ShowVideoModal
          visiable={showVideo}
          onClose={toggleVideoView}
          data={videoData}
        />
      )}
    </>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6A2382',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    width: width * 0.45,
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  iconContainer: {
    backgroundColor: '#D8BFD8',
    padding: 5,
    borderRadius: 5,
  },
  iconActions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#D8BFD8',
    padding: 5,
    borderRadius: 5,
  },
  downloadButton: {
    marginLeft: 7,
  },
  videoContainer: {
    width: '100%',
    // overflow: 'hidden',
    // top: -15,
  },
  // videoThumbnail: {
  //   height: 130,
  //   width: '100%',
  //   resizeMode: 'cover',
  // },
  // playButtonContainer: {
  //   position: 'absolute',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: '100%',
  //   height: '90%',
  // },
  videoThumbnail: {
    position: 'relative',
    height: 110, // Adjust height as needed
    width: '100%', // Set to 100% width
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    // left: -19,
    // top: -20,
  },
  videoThumbnailImage: {
    height: '100%',
    width: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    // paddingHorizontal: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    paddingBottom: 2,
    paddingHorizontal: 15,
  },
  cardFooterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cardFooterAuthor: {
    padding: 3,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  separator: {
    backgroundColor: '#6A2382',
    height: 0.8,
  },
  cardDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  cardDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});
