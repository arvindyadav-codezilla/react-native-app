import {View, Text} from 'react-native';
import React from 'react';
import UserHeader from '../../../components/molecules/userHeader';
import ResourceTabContainer from '../../../components/organisms/ResourceTabContainer';

const ResourceLayout = props => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingHorizontal: 3,
          paddingTop: 5,
        }}>
        <View style={{padding: 15, backgroundColor: 'white'}}>
          <UserHeader navigation={props.navigation} />
        </View>
        <View style={{flex: 1}}>
          <ResourceTabContainer
            onChatPress={() => {
              // data={overViewData}
              props.navigation.navigate('DashboadStack', {
                screen: 'chatLayout',
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ResourceLayout;
