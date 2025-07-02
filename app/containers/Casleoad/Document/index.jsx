import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import {getDocumentList} from '../../../services/documentServices';
import SelectDocumentModal from '../../../components/organisms/SelectDocumentModal';
import UploadDocument from '../../../components/organisms/UploadDocument';
import T from '../../../components/atoms/T';
import {
  getDateString,
  getFileExtension,
  getTimeString,
  handleDownloadDocument,
} from '../../../utils/common';
import ViewDocumentModal from '../../../components/organisms/ViewDocumentModal';
import UploadVideo from '../../../components/organisms/UploadVideo';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {selectOverViewData} from '../Overview/OverViewSlice';
import ShowVideoModal from '../../../components/organisms/ShowVideoModal';
import {SvgXml} from 'react-native-svg';
import DocxIcon from '../../../assets/SvgImages/Docx';
import {FlashList} from '@shopify/flash-list';
import {selectCaseloadCardData} from '../CaseLoadLayout/slectedCaseloadDetails';
import {Scale} from '../../../styles';
const Document = () => {
  const [selectDocumentModal, setSelectDocumentModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const overViewData = useSelector(selectOverViewData);
  const [modalVisible, setModalVisible] = useState(false);
  const [documentView, setDocumentView] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [handleSelectVideos, setHandleSelectVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const {cardData} = useSelector(selectCaseloadCardData);

  const toggleVideoView = () => {
    setShowVideo(!showVideo);
  };

  useEffect(() => {
    if (overViewData?.id && overViewData?.id != undefined) {
      fetchDocumentsFromAPI();
    }
  }, [overViewData?.id]);

  const fetchDocumentsFromAPI = async () => {
    setLoading(true);
    try {
      const response = await getDocumentList({
        id: overViewData?.id,
        isDownload: false,
      });
      setDocuments(response.data.data.caseload_documents);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching documents:', error);
    }
  };

  const toggleModal = () => {
    setSelectDocumentModal(!selectDocumentModal);
  };

  const handleSelectDocument = () => {
    setTimeout(() => {
      setModalVisible(!modalVisible);
    }, 500);

    toggleModal();
  };

  const toggleVideoModal = () => {
    fetchDocumentsFromAPI();
    setHandleSelectVideo(!handleSelectVideos);
  };

  const handleSelectVideo = () => {
    setLoading(true);
    toggleModal();

    setTimeout(() => {
      setHandleSelectVideo(!handleSelectVideos);
      setLoading(false);
    }, 500);
  };

  const handleViewDocument = document => {
    setSelectedDocumentUrl(document.url);
    setDocumentView(!documentView);
  };

  const closeModal = () => {
    fetchDocumentsFromAPI();
    setModalVisible(false);
  };

  const onCloseDocumentView = () => {
    fetchDocumentsFromAPI();
    setDocumentView(false);
  };

  const renderDocumentItem = (item, index) => {
    let result = getFileExtension(item?.url);
    return (
      <View key={index} style={styles.docsCard}>
        <View style={styles.documentHeader}>
          <View style={styles.iconContainer}>
            <SvgXml xml={DocxIcon()} />
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionIcon, {marginTop: 3}]}
              onPress={() => handleViewDocument(item)}>
              <Ionicons name="eye-outline" size={15} color="#6A2382" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              style={[styles.actionIcon, styles.downloadIcon]}
              onPress={() => handleDownloadDocument(item, setDisable)}>
              <AntDesign name="download" size={15} color="#6A2382" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.documentDetails}>
          <T
            numberOfLines={1}
            title={`${item?.document_name}.${result}`}
            style={styles.cardTitle}
          />
        </View>
        <View style={styles.uploadDetails}>
          <T title={'By:'} style={styles.uploadByText} />
          <T title={item?.uploadedBy?.first_name} style={styles.uploadedBy} />
        </View>
        <View style={styles.separator} />
        <View style={styles.dateTimeContainer}>
          <T
            title={getDateString(item?.createdAt)}
            style={styles.dateTimeText}
          />
          <T
            title={getTimeString(item?.createdAt)}
            style={styles.dateTimeText}
          />
        </View>
      </View>
    );
  };

  const renderVideoItem = (item, index) => {
    const videoUrl = item.url;
    let result = getFileExtension(item?.url);

    return (
      <View key={index} style={styles.card}>
        <TouchableOpacity
          onPress={() => {
            setVideoData(item);
            toggleVideoView();
          }}
          style={styles.videoThumbnail}>
          <Video
            source={{uri: videoUrl}}
            style={styles.videoThumbnailImage}
            paused={true}
            resizeMode="cover"
          />
          <View style={styles.playButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setVideoData(item);
                toggleVideoView();
              }}>
              <Ionicons name="play-circle" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.videoDetailsContainer}>
          <View style={{marginTop: 4, left: -5}}>
            <T
              numberOfLines={1}
              title={`${item.document_name}.${result}`}
              style={styles.cardTitle}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 2,
              marginTop: 3,
              left: -5,
            }}>
            <T title={'By:'} style={styles.uploadByText} />
            <T title={item?.uploadedBy?.first_name} style={styles.uploadedBy} />
          </View>
          <View style={styles.separator} />
          <View style={[styles.dateTimeContainer, {left: -5, top: -3}]}>
            <T
              title={getDateString(item?.createdAt)}
              style={styles.dateTimeText}
            />
            <T
              title={getTimeString(item?.createdAt)}
              style={styles.dateTimeText}
            />
          </View>
        </View>
      </View>
    );
  };

  let checkVideoData = documents?.filter(
    item => item?.document_type === 'video',
  );

  let checkDocumentData = documents?.filter(
    item => item?.document_type !== 'video' && item?.uploadType === 'caseload',
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <>
          <View style={styles.container}>
            <ScrollView
              nestedScrollEnabled
              style={{
                marginTop: 10,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchDocumentsFromAPI}
                  colors={['#6A2382']}
                  tintColor="#6A2382"
                />
              }
              showsVerticalScrollIndicator={false}>
              {checkDocumentData?.length > 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Documents</Text>
                  </View>
                  {/* <FlatList
                  data={checkDocumentData}
                  renderItem={renderDocumentItem}
                  keyExtractor={item => item.id.toString()}
                  horizontal
                  contentContainerStyle={{paddingBottom: 20}}
                  showsHorizontalScrollIndicator={false}
                /> */}
                  {/* <ScrollViews
                  nestedScrollEnabled
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {checkDocumentData.map((item, index) => {
                    return renderDocumentItem(item, index);
                  })}
                </ScrollViews> */}
                  <FlashList
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    estimatedItemSize={396}
                    data={checkDocumentData}
                    renderItem={({item, index}) => {
                      return renderDocumentItem(item, index);
                    }}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{}}
                    // refreshControl={
                    //   <RefreshControl
                    //     refreshing={loading}
                    //     onRefresh={fetchDocumentsFromAPI}
                    //     colors={['#6A2382']}
                    //     tintColor="#6A2382"
                    //   />
                    // }
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
              {checkVideoData.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>Videos</Text>
                  </View>
                  {/* <FlatList
                  data={checkVideoData}
                  renderItem={renderVideoItem}
                  keyExtractor={item => item.id.toString()}
                  horizontal
                  contentContainerStyle={{paddingBottom: 40}}
                  showsHorizontalScrollIndicator={false}
                /> */}
                  {/* <ScrollViews horizontal showsHorizontalScrollIndicator={false}>
                  {checkVideoData.map((item, index) => {
                    return renderVideoItem(item, index);
                  })}
                </ScrollViews> */}
                  <FlashList
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    estimatedItemSize={396}
                    data={checkVideoData}
                    renderItem={({item, index}) => {
                      return renderVideoItem(item, index);
                    }}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{}}
                    showsVerticalScrollIndicator={false}
                  />
                </>
              )}
            </ScrollView>
            {checkVideoData.length === 0 && checkDocumentData?.length === 0 && (
              <View
                style={{
                  height:
                    Platform.OS == 'android'
                      ? Scale.moderateScale(550)
                      : Scale.moderateScale(300),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <T
                  title={'No Document Found'}
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: '#6A2382',
                  }}
                />
              </View>
            )}
            {selectDocumentModal && (
              <SelectDocumentModal
                onClose={toggleModal}
                visible={selectDocumentModal}
                onSelectDocument={handleSelectDocument}
                onSelectVideo={handleSelectVideo}
              />
            )}
            {modalVisible && (
              <UploadDocument visible={modalVisible} closeModal={closeModal} />
            )}
            {documentView && (
              <ViewDocumentModal
                visible={documentView}
                documentUrl={selectedDocumentUrl}
                onClose={onCloseDocumentView}
              />
            )}
            {handleSelectVideos && (
              <UploadVideo
                visible={handleSelectVideos}
                closeModal={toggleVideoModal}
              />
            )}
            {showVideo && (
              <ShowVideoModal
                visiable={showVideo}
                onClose={toggleVideoView}
                data={videoData}
              />
            )}
          </View>
          <ActivityIndicators
            size="large"
            color="#6A2382"
            visible={loading}
            style={styles.activityIndicator}
          />
        </>
        {cardData?.status != '2' && (
          <Pressable onPress={toggleModal} style={styles.uploadButtonContainer}>
            <View style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </View>
          </Pressable>
        )}
      </View>
      {disable && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
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
    </SafeAreaView>
  );
};

export default Document;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  sectionHeader: {
    paddingVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    padding: 20,
    height: Scale.moderateScale(230),
    width: Scale.moderateScale(220),
    borderWidth: 0.2,
    borderColor: '#6A238259',
  },
  docsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    padding: 15,
    height: Scale.moderateScale(165),
    width: Scale.moderateScale(220),
    borderWidth: 0.2,
    borderColor: '#6A238259',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 5,
    backgroundColor: '#6A2382',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 15,
    backgroundColor: '#6A238210',
    height: Scale.moderateScale(30),
    width: Scale.moderateScale(30),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    marginTop: Scale.moderateScale(5),
  },
  documentDetails: {
    marginTop: Scale.moderateScale(20),
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  uploadDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Scale.moderateScale(10),
  },
  uploadByText: {
    fontSize: 12,
    color: '#888',
  },
  uploadedBy: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    marginVertical: Scale.moderateScale(10),
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#888',
  },
  videoThumbnail: {
    position: 'relative',
    height: Scale.moderateScale(140),
    width: '122%',
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    left: -19,
    top: Scale.moderateScale(-20),
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
  videoDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadButtonContainer: {
    padding: 12,
    backgroundColor: '#6A2382',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '6%',
    width: '40%',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#6A2382',
    alignSelf: 'center',
    width: Scale.moderateScale(120),
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  activityIndicator: {
    backgroundColor: 'white',
  },
});
