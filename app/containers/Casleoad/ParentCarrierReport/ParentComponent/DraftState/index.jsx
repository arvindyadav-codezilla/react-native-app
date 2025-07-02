import {View, Image, StyleSheet} from 'react-native';
import DownloadTemplate from '../DownloadTemplate';
import Button from '../../../../../components/atoms/Button';
import T from '../../../../../components/atoms/T';
import {Scale} from '../../../../../styles';

const DraftState = ({openModal, downloadDocxFile}) => (
  <View style={{height: '100%', justifyContent: 'center'}}>
    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
      <Image
        source={require('../../../../../assets/images/imptyfile.png')}
        style={{height: 100, width: 100, tintColor: '#D3D3D3'}}
        resizeMode="contain"
      />
    </View>
    <T
      title="Continue Filling Report"
      style={{textAlign: 'center', color: 'grey', marginTop: '2%'}}
    />

    <Button
      title={'Continue'}
      backgroundColor={'#6A2382'}
      textStyle={styles.buttonText}
      style={styles.button}
      onPress={openModal}
    />
    <DownloadTemplate downloadDocxFile={downloadDocxFile} />
  </View>
);
export default DraftState;

const styles = StyleSheet.create({
  buttonText: {
    padding: 5,
    fontSize: 14,
  },
  button: {
    alignSelf: 'center',
    borderRadius: 30,
    padding: 7,
    width: Scale.moderateScale(180),
    marginVertical: '2%',
  },
});
