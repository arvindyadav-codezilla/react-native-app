import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import T from '../../../../../components/atoms/T';

const HomeSchoolingSection = ({educationalData, downloadDocxFile}) => (
  <View style={styles.centeredContainer}>
    <Image
      source={require('../../../../../assets/images/imptyfile.png')}
      style={styles.emptyImage}
      resizeMode="contain"
    />
    <T
      title={
        educationalData?.schoolReport?.length > 0
          ? 'Education report submitted'
          : 'Education report not submitted'
      }
      style={styles.emptyText}
    />
    {/* <TouchableOpacity
      onPress={() => downloadDocxFile('Education')}
      style={styles.sampleDownloadButton}>
      <T title={'Sample Template Download'} style={styles.sampleDownloadText} />
    </TouchableOpacity> */}
    {/* <T
      title={
        '(VIEW ONLY - Do Not Use for Submission unless instructed by the admin team)'
      }
      style={styles.viewOnlyText}
    /> */}
  </View>
);

const styles = StyleSheet.create({
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
  emptyText: {
    textAlign: 'center',
    color: 'grey',
  },
  sampleDownloadButton: {
    backgroundColor: '#6A238213',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 5,
  },
  sampleDownloadText: {
    color: '#6A2382',
    padding: 10,
  },
  viewOnlyText: {
    marginTop: 8,
  },
});

export default HomeSchoolingSection;
