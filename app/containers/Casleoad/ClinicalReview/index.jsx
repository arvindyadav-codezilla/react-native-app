import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {selectOverViewData} from '../Overview/OverViewSlice';
import {CLINICAL_REVIEW} from '../../../utils/constant';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {getDocumentList} from '../../../services/documentServices';
import {
  downloadPDF,
  formatDate,
  formatIsoDateToDDMMYYYY,
  getTimeString,
  handleDownloadDocument,
} from '../../../utils/common';
import T from '../../../components/atoms/T';
import {selectCaseloadCardData} from '../CaseLoadLayout/slectedCaseloadDetails';
import RNFetchBlob from 'react-native-blob-util';
import {getPdfServices} from '../../../services/patientServices';
import {Scale} from '../../../styles';

const {width} = Dimensions.get('window');

const ClinicalReview = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const overViewData = useSelector(selectOverViewData);
  const {cardData} = useSelector(selectCaseloadCardData);

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
      let result = response.data.data.caseload_documents.filter(
        (item, index) => item.uploadType === 'mdt-review',
      );
      console.log('response', response.data.data);
      setDocuments(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching documents:', error);
    }
  };
  const {clinical_review_accepted, result1, comment, outcome_date} =
    overViewData || {};
  const shouldDisplayReview = !clinical_review_accepted && result1 !== null;
  const pathWayStatus = cardData?.pathway_status?.includes('6');

  const handleCreatePDF = async () => {
    setDisable(true);

    const report_type = 'mdt';
    const unique_id = null;
    const caseload_id = cardData?.id;
    const ismdt = true;

    try {
      const response = await getPdfServices(
        report_type,
        unique_id,
        caseload_id,
        ismdt,
      );

      if (!response || !response.data) {
        console.error('Failed to fetch PDF data');
        setDisable(false);
        return;
      }

      const fileName = response.hedaer;

      // Call the common function to handle the download
      const filePath = await downloadPDF({
        fileName,
        fileData: response.data,
      });

      console.log('PDF downloaded and opened successfully:', filePath);
    } catch (error) {
      console.error('Failed to create or download PDF:', error);
    } finally {
      setDisable(false);
    }
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        // flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      {/* <ScrollView showsVerticalScrollIndicator={false} style={{}}> */}
      <View style={styles.container}>
        {pathWayStatus && (
          <>
            <View style={styles.headerSection}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    comment
                      ? require('../../../assets/images/docsxIcon.png')
                      : require('../../../assets/images/imptyfile.png')
                  }
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Comment:</Text>
                  <Text style={styles.tableValue}>{comment}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Date:</Text>
                  <Text style={styles.tableValue}>
                    {formatIsoDateToDDMMYYYY(outcome_date)}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableLabel}>Time:</Text>
                  <Text style={styles.tableValue}>
                    {' '}
                    {getTimeString(outcome_date)}
                  </Text>
                </View>
              </View>
            </View>

            {shouldDisplayReview && (
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewText}>
                  MDT Review Rejected with the following reason:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {CLINICAL_REVIEW[result1] || 'Unknown review'}
                  </Text>
                </Text>
              </View>
            )}
          </>
        )}
        <ActivityIndicators
          size="large"
          color="#6A2382"
          visible={loading}
          style={{backgroundColor: 'white'}}
        />
        {!CLINICAL_REVIEW[result1] && !pathWayStatus && (
          <View>
            <T title={'Clinical Review Pending'} style={styles.emptyText} />
          </View>
        )}
        {pathWayStatus && (
          <TouchableOpacity
            onPress={() => {
              handleDownloadDocument(documents[0], status => {
                setDisable(status);
              });
            }}
            style={styles.button}>
            {disable ? (
              <View>
                <ActivityIndicator size={'small'} color={'white'} />
              </View>
            ) : (
              <Text style={styles.buttonText}>DOWNLOAD OUTCOME LETTER</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Scale.moderateScale(550),
    padding: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  imageContainer: {
    // marginRight: 15,
  },
  image: {
    height: 80,
    width: 80,
    tintColor: '#D3D3D3',
    borderRadius: 10,
  },
  tableContainer: {
    // flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: 240,
  },
  tableLabel: {
    color: 'grey',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  tableValue: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 2,
  },
  reviewContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
  },
  reviewText: {
    fontSize: 14,
    color: '#6A2382',
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#6A2382',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6A2382',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ClinicalReview;
