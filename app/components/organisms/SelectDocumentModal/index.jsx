import {View, Text, Platform} from 'react-native';
import React from 'react';
import BottomModalContainer from '../../atoms/BottomModalContainer';
import Button from '../../atoms/Button';

const SelectDocumentModal = ({
  visible,
  onClose,
  onSelectDocument,
  onSelectVideo,
}) => {
  return (
    <BottomModalContainer
      visible={visible}
      onClose={onClose}
      onSwapClose={onClose}
      Modalstyle={{
        minHeight: Platform.OS === 'android' ? '28%' : '30%',
        maxHeight: '100%',
      }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: 'black',
          padding: 18,
          fontSize: 16,
        }}>
        Choose For Attach File{' '}
      </Text>

      <Button
        startIcon={'video'}
        onPress={onSelectVideo}
        iconSource={'chevron-right'}
        title={'Upload Video'}
        backgroundColor={'white'}
        style={{
          borderRadius: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 18,
          paddingHorizontal: 10,
        }}
        textStyle={{
          color: '#6A2382',
          padding: 12,
          fontSize: 14,
          fontFamily: 'Inter-SemiBold',
        }}
        iconColor="#6A2382"
        iconSize={15}
      />
      <View style={{paddingVertical: 10}}>
        <Button
          startIcon={'docs'}
          onPress={onSelectDocument} // Call onSelectDocument when this button is pressed
          iconSource={'chevron-right'}
          title={'Upload Document'}
          backgroundColor={'white'}
          style={{
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 18,
            paddingHorizontal: 10,
          }}
          textStyle={{
            color: '#6A2382',
            padding: 12,
            fontSize: 14,
            fontFamily: 'Inter-SemiBold',
          }}
          iconColor="#6A2382"
          iconSize={15}
        />
      </View>
    </BottomModalContainer>
  );
};

export default SelectDocumentModal;
