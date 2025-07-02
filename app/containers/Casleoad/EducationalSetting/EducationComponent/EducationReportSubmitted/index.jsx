import {ScrollView, StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import T from '../../../../../components/atoms/T';

const EducationReportSubmitted = () => (
  <ScrollView
    nestedScrollEnabled
    contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.centeredContainer}>
      <Ionicons name={'document-text-outline'} size={90} color={'grey'} />
      <T
        title={'Education Report Submitted'}
        style={styles.reportSubmittedText}
      />
    </View>
  </ScrollView>
);

export default EducationReportSubmitted;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  reportSubmittedText: {
    paddingVertical: 15,
    color: '#6A2382',
    fontSize: 16,
  },
});
