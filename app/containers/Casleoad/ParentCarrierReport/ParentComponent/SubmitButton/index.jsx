import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import T from '../../../../../components/atoms/T';

const SubmitButton = ({disable, handleCreatePDF, loading}) => (
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
      <ActivityIndicator size="large" color="white" />
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
);

export default SubmitButton;
