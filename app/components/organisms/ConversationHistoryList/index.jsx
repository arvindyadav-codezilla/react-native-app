// import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {getTimeString} from '../../../utils/common';
import typography from '../../../styles/typography';
import {useState} from 'react';

const ConversationHistoryList = ({conversations, onSelectChat, isLoading}) => {
  const [selectedId, setSelectedId] = useState(null);
  const handleSelectChat = chatData => {
    onSelectChat(chatData);
  };

  const renderConversationItem = ({item}) => {
    const filteredData = item?.participants?.filter(
      participant => participant.scope === '7',
    );
    return (
      <Pressable
        onPress={() => {
          handleSelectChat(item);
        }}
        onPressIn={() => setSelectedId(item.id)}
        onPressOut={() => setSelectedId(null)}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          backgroundColor: selectedId === item.id ? '#6A2382' : 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{position: 'absolute', zIndex: 1000}}>
              {item?.messageCount !== 0 && (
                <View
                  style={{
                    backgroundColor: '#6A2382',
                    borderRadius: 50,
                    width: 20,
                    height: 20,
                    bottom: 20,
                    alignItems: 'center',
                    // marginTop: -10,
                    // marginLeft: 30,
                    // margin: 10,
                  }}>
                  <Text style={{color: 'white'}}>{item?.messageCount}</Text>
                </View>
              )}
            </View>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${
                  filteredData[0]?.first_name
                }+${
                  filteredData[0]?.last_name === null
                    ? ''
                    : filteredData[0]?.last_name
                }&size=100`,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: selectedId === item.id ? 'white' : 'black',
                fontFamily: 'Inter-Bold',
                paddingHorizontal: 15,
              }}>{`${filteredData[0]?.first_name} ${
              filteredData[0]?.last_name === null
                ? ''
                : filteredData[0]?.last_name
            }`}</Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: selectedId === item.id ? 'white' : 'black',
              }}>
              {getTimeString(item.updatedAt)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={'large'} color={'#6A2382'} />
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View
            style={{
              height: 620,
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: '#6A2382',
                fontSize: 16,
                fontFamily: 'Inter-Regular',
              }}>
              No history found
            </Text>
            {/* <ActivityIndicator size={'large'} /> */}
          </View>
        )}
      />
    </View>
  );
};

export default ConversationHistoryList;
