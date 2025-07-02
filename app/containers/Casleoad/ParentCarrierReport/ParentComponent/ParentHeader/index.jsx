import {Text, View} from 'react-native';

const ParentHeader = () => {
  return (
    <View style={{fontFamily: 'Inter-Medium', marginTop: '20%'}}>
      <Text
        style={{
          color: 'grey',
          textAlign: 'left',
          // marginBottom: '13%',
          letterSpacing: 0.8,
          marginHorizontal: 15,
          fontSize: 12.8,
        }}>
        The person assigned on MyCareBridge as the 'primary parent / carer' for
        the child or young person will automatically be asked to complete the
        Parent / Carer Report for them. We understand that sometimes additional
        parents and carers may also wish to share a Parent / Carer Report with
        our clinical team to give us further information about the child or
        young person's needs. If you wish to do this, please download the
        Microsoft Word template from the Parent/Carer Report section, fill it
        in, and then add this document to the Upload section.
      </Text>
    </View>
  );
};

export default ParentHeader;
