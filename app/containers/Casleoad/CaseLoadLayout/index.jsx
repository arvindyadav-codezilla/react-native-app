import {View, Alert, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import CaseLoadInfoHeader from '../../../components/molecules/CaseLoadInfoHeader';
import CaseLoadStatus from '../../../components/molecules/CaseLoadStatus';
import CaseLoadTabContainer from '../../../components/organisms/CaseLoadTabContainer';
import ToolTipStatus from '../../../components/molecules/ToolTipStatus';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import useCaseLoadLogicHook from './useCaseLoadLogicHook';
import {useRoute} from '@react-navigation/native';
import T from '../../../components/atoms/T';
import {Colors, Scale} from '../../../styles';

const CaseLoadLayout = props => {
  const {
    loading,
    refreshing,
    isModalVisible,
    overViewData,
    nextMileStone,
    toggleModal,
    onRefresh,
    formattedNextUncheckedStatus,
    formattedLastCheckedStatus,
    progressBar,
    nextMileStoneStatus,
  } = useCaseLoadLogicHook(props);
  const {params} = useRoute();
  const data = params?.data;
  const backHandler = () => {
    const navigationState = props.navigation.getState();
    const currentRouteName = navigationState.routes[navigationState.index].name;
    if (currentRouteName && currentRouteName.includes('CaseLoadLayout')) {
      props.navigation.goBack();
      return true;
    } else {
      props.navigation.goBack();
    }
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {data?.status !== '3' ? (
        <>
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
          <CaseLoadStatus
            iconPress={() => {
              toggleModal();
            }}
            icon={'info'}
            caseloadTitle={formattedNextUncheckedStatus?.status}
            nextMilestone={nextMileStoneStatus?.status}
            progress={progressBar}
          />

          <CaseLoadTabContainer
            data={overViewData}
            onChatPress={() => {
              if (overViewData?.conversationId) {
                props.navigation.navigate('DashboadStack', {
                  screen: 'chatMainScreen',
                  params: {data: {id: overViewData?.conversationId}},
                });
              } else {
                Alert.alert(
                  'MyCareBridge',
                  'Chat has not been initiated from the admin side. Once it is, it will be reflected.',
                );
              }
            }}
          />
          <ToolTipStatus
            visible={isModalVisible}
            onClose={toggleModal}
            nextMilestone={res => {}}
            currentMilestone={res => {}}
          />
        </>
      ) : (
        <>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <T
              title={'Rejected'}
              style={{
                color: Colors.dangerRed,
                fontSize: Scale.moderateScale(24),
                marginHorizontal: Scale.moderateScale(12),
              }}
            />
            <T title={'This Referral has been Rejected by Admin'} />
          </View>
        </>
      )}
      <ActivityIndicators
        size="large"
        color="#6A2382"
        visible={loading}
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      />
    </View>
  );
};

export default CaseLoadLayout;
