import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CaseLoadInfoHeader from '../../components/molecules/CaseLoadInfoHeader';
import {selectOverViewData} from '../Casleoad/Overview/OverViewSlice';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

const NotificationScreen = props => {
  const overViewData = useSelector(selectOverViewData);

  return (
    <View>
      <CaseLoadInfoHeader
        icon={'chevron-down'}
        name={overViewData?.patient_name}
        iconSize={34}
        iconColor={'black'}
        iconFirstPress={() => {
          props.navigation.goBack();
        }}
        iconFirst={'chevron-left'}
      />
    </View>
  );
};

export default NotificationScreen;
