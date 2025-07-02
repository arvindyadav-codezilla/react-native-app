import React from 'react';
import {View, StyleSheet} from 'react-native';
import T from '../../atoms/T';
import {SvgXml} from 'react-native-svg';
import {userIcon} from '../../../assets/SvgImages';
import {formatIsoDateToDDMMYYYY} from '../../../utils/common';
const UserCard = ({
  imageSource,
  gender,
  dob,
  milestone,
  parentReport,
  name,
  status,
}) => {
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 10, marginTop: 6}}>
        <View style={styles.imageContainer} />
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <SvgXml xml={userIcon()} height={50} width={50} />
            <T
              title={
                status === '3'
                  ? 'Rejected'
                  : status == '2'
                  ? 'Closed'
                  : 'Ongoing'
              }
              style={[styles.statusText, {color: 'white'}]}
              containerStyle={[
                styles.statusContainer,
                status == '1'
                  ? {backgroundColor: 'orange'}
                  : status == '2' || status == '3'
                  ? {backgroundColor: '#C41E3A'}
                  : {backgroundColor: 'green'},
              ]}
            />
          </View>
          <View style={styles.rowContainer}>
            <T title={name} style={styles.name} />
          </View>
          <View style={styles.rowContainer}>
            <View style={{flexDirection: 'row'}}>
              <T title={'Gender :  '} style={styles.lable} />
              <T title={gender} style={styles.value} />
            </View>
            <View style={{flexDirection: 'row'}}>
              <T title={'DOB :  '} style={styles.lable} />
              <T title={formatIsoDateToDDMMYYYY(dob)} style={styles.value} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomRowContainer} />
      <View style={styles.bottomContent}>
        <T title={'Current Milestone:'} style={styles.lable} />
        <T title={milestone?.status} style={styles.value} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 3,
    overflow: 'hidden',
    // marginTop: 20,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  imageContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  smallImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eadfed',
    padding: 10,
  },
  statusText: {
    color: '#E19B32',
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  name: {
    color: '#101828',
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  lable: {
    color: '#101828',
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  value: {
    color: '#101828',
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  statusContainer: {
    backgroundColor: '#f5ecdf',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
export default UserCard;
