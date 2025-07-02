import {StyleSheet, View} from 'react-native';
import T from '../../../../../components/atoms/T';

const HeaderText = () => (
  <View style={styles.headerContainer}>
    <T
      title={`Your child / young person's education setting have been asked to complete a report about your child's needs and behaviour. When this is uploaded by your child's / young person's education setting, the report information will appear here.`}
      style={styles.headerText}
    />
  </View>
);

export default HeaderText;

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: '4%',
  },
  headerText: {
    color: 'grey',
    textAlign: 'left',
    marginTop: '18%',
    marginBottom: 5,
    letterSpacing: 0.8,
    fontSize: 12.8,
  },
});
