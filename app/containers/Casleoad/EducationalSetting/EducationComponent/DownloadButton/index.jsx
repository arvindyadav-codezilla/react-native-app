// DownloadButton.js
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import T from '../../../../../components/atoms/T';

const DownloadButton = ({disable, handleCreatePDF}) => {
  return (
    disable !== undefined && (
      <TouchableOpacity
        disabled={disable}
        style={{
          backgroundColor: disable ? 'grey' : '#6A2382',
          alignItems: 'center',
          alignSelf: 'center',
          position: 'absolute',
          zIndex: 1000,
          borderRadius: 30,
          bottom: '6%',
          width: '40%',
        }}
        onPress={handleCreatePDF}>
        {disable ? (
          <View>
            <ActivityIndicator size={'large'} color={'white'} />
          </View>
        ) : (
          <T
            title={'Download pdf'}
            style={{
              color: 'white',
              padding: 12,
              width: 140,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}
          />
        )}
      </TouchableOpacity>
    )
  );
};

export default DownloadButton;
