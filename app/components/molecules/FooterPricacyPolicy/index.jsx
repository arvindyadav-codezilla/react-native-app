import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import T from '../../atoms/T';
import Pdf from 'react-native-pdf';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';

const FooterPrivacyPolicy = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState('');
  const navigation = useNavigation();

  const openPdf = async type => {
    let filePath;
    let sourcePath;

    if (type === 'privacy') {
      filePath = 'PRIVACYNOTICE.pdf';
    } else {
      filePath = 'TERMSANDCONDITIONS.pdf';
    }

    // Set sourcePath based on platform
    if (Platform.OS === 'android') {
      sourcePath = `bundle-assets://utils/${filePath}`;
    } else if (Platform.OS === 'ios') {
      sourcePath = `${RNFS.MainBundlePath}/${filePath}`;
    } else {
      sourcePath = `${RNFS.DocumentDirectoryPath}/${filePath}`;
    }

    // Construct the PDF source based on platform
    const pdfPath = {
      uri: sourcePath,
    };

    // Set PDF source and show modal
    setPdfSource(pdfPath);
    setModalVisible(true);
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => {}}>
        <T title={'Terms & Conditions'} style={styles.footerLink} />
      </TouchableOpacity>
      <T title={'||'} style={{paddingHorizontal: 5, fontSize: 16}} />
      <TouchableOpacity onPress={() => openPdf('privacy')}>
        <T title={'Privacy & Policy'} style={styles.footerLink} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <StatusBar
            barStyle={
              Platform.OS === 'android' ? 'dark-content' : 'light-content'
            }
          />
          {pdfSource ? (
            <Pdf
              trustAllCerts={false}
              source={pdfSource}
              onLoadComplete={(numberOfPages, filePath) => {}}
              onPageChanged={(page, numberOfPages) => {}}
              onError={error => {}}
              style={styles.pdf}
            />
          ) : null}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <T title="Close" style={styles.closeButtonText} />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default FooterPrivacyPolicy;

const styles = StyleSheet.create({
  footerLink: {
    fontSize: 14,
    color: '#101828',
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A238217',
    paddingVertical: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
