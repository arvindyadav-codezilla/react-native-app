import {View, Image, StyleSheet, ScrollView} from 'react-native';
import T from '../../../../../components/atoms/T';
import Button from '../../../../../components/atoms/Button';
import DownloadTemplate from '../DownloadTemplate';
import {Scale} from '../../../../../styles';
const EmptyState = ({downloadDocxFile, showAlert, isReport, userRole}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View
      style={{
        justifyContent: 'center',
        height: Scale.moderateScale(270),
      }}>
      <View style={{alignSelf: 'center', paddingBottom: 10}}>
        <Image
          source={
            isReport
              ? require('../../../../../assets/images/docsxIcon.png')
              : require('../../../../../assets/images/imptyfile.png')
          }
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <T
          title={
            isReport ? 'Parent Report Submitted' : 'Parent Report Not Submitted'
          }
          style={{textAlign: 'center', color: '#6A2382', paddingVertical: 7}}
        />
        {!isReport && !userRole && (
          <Button
            title="CLICK TO COMPLETE PARENT/CARER REPORT"
            backgroundColor="#6A2382"
            onPress={showAlert}
            textStyle={styles.buttonText}
            style={styles.completeReportButton}
          />
        )}

        {/* <DownloadTemplate downloadDocxFile={downloadDocxFile} /> */}
        {/* <T
          title={
            '(VIEW ONLY - Do Not Use For Submission Unless Instructed By The Admin Team)'
          }
          style={styles.viewOnlyText}
        /> */}
      </View>
    </View>
  </ScrollView>
);

export default EmptyState;

const styles = StyleSheet.create({
  emptyImage: {
    height: 100,
    width: 100,
    tintColor: '#D3D3D3',
    alignSelf: 'center',
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
