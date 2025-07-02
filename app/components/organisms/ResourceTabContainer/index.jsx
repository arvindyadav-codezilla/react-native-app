import React, {useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Documents from '../../../containers/Resource/Documents';
import Videos from '../../../containers/Resource/Videos';

const {width: screenWidth} = Dimensions.get('window');

const DocumentsRoute = () => (
  <View style={{paddingTop: 60, flex: 1}}>
    <Documents />
  </View>
);
const VideosRoute = () => (
  <View style={{paddingTop: 60, flex: 1}}>
    <Videos />
  </View>
);

const ResourceTabContainer = ({onChatPress}) => {
  const [index, setIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [routes] = useState([
    {key: 'documents', title: 'Documents'},
    {key: 'videos', title: 'Videos'},
  ]);

  const renderScene = SceneMap({
    documents: DocumentsRoute,
    videos: VideosRoute,
  });

  const CustomTabBar = ({navigationState, position}) => {
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          position: 'absolute',
          height: 65,
          zIndex: 1000,
          backgroundColor: 'white',
        }}
        contentContainerStyle={{}}>
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: 'white',
          }}>
          {navigationState.routes.map((item, i) => {
            const isDisabled = item.key === 'clinical' && !enableButton;

            return (
              <TouchableOpacity
                key={item.key}
                // style={[styles.tabItem, {}]}
                onPress={() =>
                  !isDisabled && setIndex(navigationState.routes.indexOf(item))
                }
                disabled={isDisabled || i === navigationState.index}>
                <View
                  style={{
                    backgroundColor: index === i ? '#6A238213' : 'white',
                    // height: 50,
                    padding: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 200,
                  }}>
                  <Text
                    style={[
                      styles.tabLabel,
                      i === navigationState.index && {color: '#6A2382'},
                      isDisabled && {color: 'gray'},
                    ]}>
                    {item.title}
                  </Text>
                </View>
                <View style={{}}>
                  {i === navigationState.index && (
                    <View style={styles.tabIndicatorContainer}>
                      <View
                        style={[styles.tabItemIndicator, styles.tabItemFocused]}
                      />
                      <View style={styles.triangle} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        // initialLayout={{width: screenWidth}}
        renderTabBar={CustomTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // width: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabItemFocused: {
    borderBottomColor: '#6A2382',
    borderBottomWidth: 2,
  },
  tabLabel: {
    color: 'black',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    fontSize: 14,
    // width: 100,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6A2382',

    // position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
  tabBarScroll: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // paddingHorizontal: 12, // Add padding to the sides
    height: 48, // Set the height of the tab bar
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: '#6A2382',
    borderBottomWidth: 2,
  },

  tabIndicatorContainer: {
    marginTop: 1,
  },
});

export default ResourceTabContainer;
