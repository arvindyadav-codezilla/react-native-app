import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {selectOverViewData} from '../../Casleoad/Overview/OverViewSlice';
import {useSelector} from 'react-redux';
import {
  getDateString,
  getFileExtension,
  getTimeString,
  handleDownloadDocument,
} from '../../../utils/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import T from '../../../components/atoms/T';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {viewVideoDocumentResource} from '../../../services/documentServices';
import ViewDocumentModal from '../../../components/organisms/ViewDocumentModal';
import ToastHandler from '../../../components/atoms/ToastHandler';
import DocxIcon from '../../../assets/SvgImages/Docx';
import {SvgXml} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const overViewData = useSelector(selectOverViewData);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [documentView, setDocumentView] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    fetchDocumentsFromAPI();
  }, []);

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

  const renderDocumentItem = ({item}) => {
    let result = getFileExtension(item?.url);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            {/* <Entypo name="text-document" size={20} color="#6A2382" /> */}
            <SvgXml xml={DocxIcon()} />
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleViewDocument(item)}>
              <Ionicons name="eye-outline" size={15} color="#6A2382" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disable}
              style={[styles.iconButton, styles.downloadButton]}
              onPress={() =>
                handleDownloadDocument(item, status => {
                  setDisable(status);
                })
              }>
              <AntDesign name="download" size={15} color="#6A2382" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContent}>
          <T
            title={`${item.document_name}.${result}`}
            style={styles.cardTitle}
          />
        </View>
        <View style={styles.uploadedByContainer}>
          <T title={'By:'} style={styles.byText} />
          <T title={item?.uploadedBy?.first_name} style={styles.uploaderName} />
        </View>
        <View style={styles.divider} />
        <View style={styles.dateContainer}>
          <T title={getDateString(item?.createdAt)} style={styles.dateText} />
          <T title={getTimeString(item?.createdAt)} style={styles.timeText} />
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={documents?.filter(item => item.document_type !== 'video')}
          renderItem={renderDocumentItem}
          showsVerticalScrollIndicator={false}
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
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Documents Found</Text>
            </View>
          )}
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
        style={styles.activityIndicator}
      />
    </>
  );
};

export default Documents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'ios' ? '10%' : '5%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    width: width * 0.45,
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
    padding: 7,
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
  iconButton: {
    marginLeft: 15,
    backgroundColor: '#6A238210',
    height: 30,
    width: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    marginLeft: 7,
  },
  cardContent: {
    paddingHorizontal: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  uploadedByContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 2,
  },
  byText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  uploaderName: {
    padding: 3,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#6A2382',
    height: 0.4,
  },
  dateContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    paddingLeft: 5,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  timeText: {
    paddingLeft: 5,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  activityIndicator: {
    backgroundColor: 'white',
  },
  emptyContainer: {
    height: 580,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6A2382',
  },
});
