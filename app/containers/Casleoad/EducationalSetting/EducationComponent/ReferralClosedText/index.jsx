// ReferralClosedText.js
import React from 'react';
import {View, Text} from 'react-native';
import {Scale} from '../../../../../styles';
import {ROLE} from '../../../../../utils/constant';

const ReferralClosedText = ({cardData}) => {
  return (
    cardData?.status == ROLE.REJECTED && (
      <View style={{flex: 1}}>
        <Text
          style={{
            color: '#6A2382',
            fontSize: 16,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: Scale.moderateScale(170),
          }}>
          Referral Decline
        </Text>
      </View>
    )
  );
};

export default ReferralClosedText;
