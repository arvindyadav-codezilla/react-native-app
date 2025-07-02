import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({documents, pdfLoading}) => (
  <ScrollView
    nestedScrollEnabled
    contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.pdfContainer}>
      {pdfLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6A2382" />
        </View>
      )}
      {documents?.url && (
        <Pdf source={{uri: documents?.url}} style={styles.pdfStyle} />
      )}
    </View>
  </ScrollView>
);

export default PdfViewer;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  pdfContainer: {
    flex: 1,
  },
  pdfStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: '50%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
