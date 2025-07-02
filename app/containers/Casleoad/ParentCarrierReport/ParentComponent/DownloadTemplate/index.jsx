import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import T from '../../../../../components/atoms/T';

const DownloadTemplate = ({downloadDocxFile}) => (
  // <TouchableOpacity
  //   onPress={() => downloadDocxFile('Parent')}
  //   style={styles.sampleDownloadButton}>
  //   <T
  //     title={'SAMPLE TEMPLATE DOWNLOAD'}
  //     style={styles.sampleDownloadText}
  //     textDecorationLine="underline"
  //   />
  // </TouchableOpacity>
  <></>
);
export default DownloadTemplate;

const styles = StyleSheet.create({
  sampleDownloadButton: {
    backgroundColor: '#6A238213',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  sampleDownloadText: {
    color: '#6A2382',
  },
});
