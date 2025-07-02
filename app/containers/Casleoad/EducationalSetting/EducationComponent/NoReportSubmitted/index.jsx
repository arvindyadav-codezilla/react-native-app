import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import T from '../../../../../components/atoms/T';
import Button from '../../../../../components/atoms/Button';

const NoReportSubmitted = ({
  downloadDocxFile,
  showAlert,
  isSubmitted,
  isEnableFormButton,
}) => (
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.centeredContainer}>
      <Image
        source={require('../../../../../assets/images/imptyfile.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <T
        title={
          isSubmitted
            ? 'Education Report Submitted'
            : 'Education Report Not Submitted'
        }
        style={styles.noReportText}
      />
      {isEnableFormButton && (
        <Button
          title="CLICK TO COMPLETE EDUCATION SETTING REPORT"
          backgroundColor="#6A2382"
          textStyle={styles.buttonText}
          style={styles.completeReportButton}
          onPress={showAlert}
        />
      )}
      {/* <TouchableOpacity
        onPress={() => downloadDocxFile('Education')}
        style={[
          styles.sampleDownloadButton,
          isEnableFormButton ? {marginVertical: 15} : {marginVertical: 6},
        ]}>
        <T
          title={'SAMPLE TEMPLATE DOWNLOAD'}
          style={styles.sampleDownloadText}
          textDecorationLine="underline"
        />
      </TouchableOpacity> */}
      {/* <T
        title={
          '(VIEW ONLY - Do Not Use For Submission Unless Instructed By The Admin Team)'
        }
        style={styles.viewOnlyText}
      /> */}
    </View>
  </ScrollView>
);

export default NoReportSubmitted;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyImage: {
    height: 100,
    width: 100,
    tintColor: '#D3D3D3',
  },
  noReportText: {
    paddingVertical: 15,
    color: '#6A2382',
    fontSize: 16,
    textAlign: 'center',
  },
  sampleDownloadButton: {
    backgroundColor: '#6A238213',
    alignSelf: 'center',
    borderRadius: 5,
  },
  sampleDownloadText: {
    color: '#6A2382',
    padding: 10,
  },
  completeReportButton: {
    alignSelf: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 10,
    padding: 12,
  },
  viewOnlyText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 8,
  },
});
