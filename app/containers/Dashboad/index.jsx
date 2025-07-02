import {View, Text, FlatList, Pressable, RefreshControl} from 'react-native';
import React from 'react';
import UserHeader from '../../components/molecules/userHeader';
import UserCard from '../../components/organisms/UserCard';
import {getStatusText} from '../../utils/common';

import MyCareBridgeAlert from '../../components/molecules/MyCareBridgeAlert';

import UpgradeModal from '../../components/organisms/UpgradeModal';
import {useDashboardHook} from './useDashboardHook';

const Dashboard = props => {
  const {navigation} = props;
  const {
    caseLoads,
    loading,
    sessionData,
    showUpgradeModal,
    loadCaseLoads,
    handleLogout,
    handleUpgrade,
  } = useDashboardHook(navigation);

  const renderItem = ({item}) => {
    let data = {
      cardInfo: item?.id,
      status: item.status,
      type: 'overview',
    };
    const handleUserCardPress = () => {
      navigation.navigate('DashboadStack', {
        screen: 'CaseLoadLayout',
        params: {data: data},
      });
    };
    let milestoneDetails;
    let result = item?.pathway_status;
    if (result && result?.length > 0) {
      result?.sort((a, b) => a - b);

      let lastIndex = result?.length - 1;
      let lastItem = result[lastIndex];
      milestoneDetails = getStatusText(lastItem);
    }
    return (
      <Pressable style={{paddingTop: 10}} onPress={handleUserCardPress}>
        <UserCard
          imageSource={item?.imageSource}
          gender={item?.patient_gender}
          dob={item?.patient_dob}
          milestone={milestoneDetails}
          parentReport={item?.parentReport}
          name={item?.patient_name}
          status={item?.status}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 18,
        paddingTop: 20,
      }}>
      <View style={{marginBottom: 10}}>
        <UserHeader navigation={navigation} />
      </View>
      <View style={{flex: 1}}>
        <View style={{fontFamily: 'Inter-Medium'}}>
          <Text
            style={{
              color: 'grey',
              textAlign: 'left',
              marginBottom: 5,
              letterSpacing: 0.8,
            }}>
            {`Please click on your child’s / young persons profile to review and add information.`}
          </Text>
        </View>
        <FlatList
          data={caseLoads}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadCaseLoads}
              colors={['#6A2382']}
              tintColor="#6A2382"
            />
          }
        />
      </View>
      {sessionData?.logoutSuccess && (
        <MyCareBridgeAlert
          visible={sessionData?.logoutSuccess}
          headerText="Session Expire!"
          onClose={handleLogout}>
          <View style={{padding: 7}}>
            <Text style={{fontSize: 18, color: 'black', paddingBottom: 5}}>
              Your session has expired. Please log in again.
            </Text>
          </View>
        </MyCareBridgeAlert>
      )}
      <UpgradeModal
        showUpgradeModal={showUpgradeModal}
        onUpgrade={handleUpgrade}
      />
    </View>
  );
};

export default Dashboard;
