import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Button from '../../../../../components/atoms/Button';
import {downloadDocxFile} from '../../../../../utils/common';
import T from '../../../../../components/atoms/T';
import {Scale} from '../../../../../styles';

const DraftContinue = ({openModal}) => {
  console.log('HHHHHH');
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../../../assets/images/imptyfile.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <T
        title={'Continue Filling Report'}
        style={styles.text}
        containerStyle={styles.textContainer}
      />
      <Button
        title={'Continue'}
        backgroundColor={'#6A2382'}
        textStyle={styles.buttonText}
        style={styles.button}
        onPress={openModal}
      />
      <View style={styles.footerContainer}>
        {/* <TouchableOpacity
          onPress={() => downloadDocxFile('Education')}
          style={styles.sampleDownloadButton}>
          <Text style={styles.sampleText}>Sample Template Download</Text>
        </TouchableOpacity> */}
        <Text style={styles.disclaimerText}>
          (VIEW ONLY - Do Not Use for Submission unless instructed by the admin
          team)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    paddingBottom: 10,
  },
  image: {
    height: 100,
    width: 100,
    tintColor: '#D3D3D3',
  },
  text: {
    textAlign: 'center',
    color: 'grey',
  },
  textContainer: {
    paddingBottom: 10,
  },
  buttonText: {
    padding: 5,
    fontSize: 14,
  },
  button: {
    alignSelf: 'center',
    borderRadius: 30,
    padding: 7,
    width: Scale.moderateScale(180),
  },
  footerContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sampleDownloadButton: {
    backgroundColor: '#6A238213',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 5,
  },
  sampleText: {
    color: '#6A2382',
    padding: 10,
    fontFamily: 'Inter-Regular',
  },
  disclaimerText: {
    color: 'red',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    marginHorizontal: 10,
    marginTop: 8,
  },
});

export default DraftContinue;
