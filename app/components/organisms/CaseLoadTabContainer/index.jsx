import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {TabView} from 'react-native-tab-view';
import Overview from '../../../containers/Casleoad/Overview';
import EducationalSetting from '../../../containers/Casleoad/EducationalSetting';
import ParentCarrierReport from '../../../containers/Casleoad/ParentCarrierReport';
import Document from '../../../containers/Casleoad/Document';
import MyTask from '../../../containers/Casleoad/MyTask';
import ClinicalReview from '../../../containers/Casleoad/ClinicalReview';
import {chatIcon} from '../../../assets/SvgImages';
import {SvgXml} from 'react-native-svg';

import timerImage from '../../../assets/SvgImages/timer';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCaseLoadTabs from './useCaseLoadTabs';
const CaseLoadTabContainer = ({onChatPress, data, type}) => {
  const [routes] = useState([
    {key: 'overview', title: 'Overview'},
    {key: 'educational', title: 'Educational Setting Report'},
    {key: 'parentCarrier', title: 'Parent Carer Report'},
    {key: 'uploads', title: 'Uploads'},
    {key: 'myTask', title: 'My Task'},
    {key: 'clinical', title: 'Clinical Review'},
  ]);

  const {
    index,
    setIndex,
    scrollViewRef,
    overViewData,
    selectRefreshCaseloadCard,
    enableButton,
    cardSelected,
    cardData,
    isUnread,
  } = useCaseLoadTabs(data);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'overview':
        return (
          <View style={{paddingTop: 8, flex: 1}}>
            <Overview />
          </View>
        );
      case 'educational':
        return (
          <View style={{flex: 1}}>
            <EducationalSetting />
          </View>
        );
      case 'parentCarrier':
        return (
          <View style={{flex: 1, marginTop: -14}}>
            <ParentCarrierReport />
          </View>
        );
      case 'uploads':
        return (
          <View style={{paddingTop: 48, flex: 1}}>
            <Document />
          </View>
        );
      case 'myTask':
        return (
          <View style={{paddingTop: 48, flex: 1}}>
            <MyTask />
          </View>
        );
      case 'clinical':
        return (
          <View style={{paddingTop: 48, flex: 1}}>
            <ClinicalReview />
          </View>
        );
      default:
        return <Overview />;
    }
  };
  const CustomTabBar = ({navigationState, position}) => {
    const isParentEducationNotFilled =
      !selectRefreshCaseloadCard?.pathway_status?.includes('2');
    const isParentFormNotFilled =
      !selectRefreshCaseloadCard?.pathway_status?.includes('3');
    const isTaskAssigned = selectRefreshCaseloadCard?.pending_task !== 0;
    const enableClinicalTab =
      overViewData?.pathway_status?.includes('5') &&
      overViewData?.pending_task === 0;
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
        <View style={{flexDirection: 'row'}}>
          {navigationState.routes.map((item, i) => {
            const isDisabled =
              (item.key === 'clinical' && !enableButton) ||
              (item.key === 'clinical' && !enableClinicalTab);
            let showQuestionMark = false;
            if (item.key === 'educational' && isParentEducationNotFilled) {
              showQuestionMark = true;
            } else if (item.key === 'parentCarrier' && isParentFormNotFilled) {
              showQuestionMark = true;
            } else if (item.key === 'myTask' && isTaskAssigned) {
              showQuestionMark = true;
            }
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() =>
                  !isDisabled && setIndex(navigationState.routes.indexOf(item))
                }
                disabled={isDisabled || i === navigationState.index}>
                <View
                  style={{
                    backgroundColor: index === i ? '#6A238213' : 'white',
                    padding: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 120,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      styles.tabLabel,
                      i === navigationState.index && {color: '#6A2382'},
                      isDisabled && {color: 'gray'},
                    ]}>
                    {item.title}
                  </Text>
                  {item.key === 'educational' &&
                    overViewData?.isHomeSchooling === true &&
                    (showQuestionMark && isParentEducationNotFilled ? (
                      <SvgXml
                        xml={timerImage()}
                        height={20}
                        width={20}
                        color={'red'}
                        style={{marginLeft: 7}}
                      />
                    ) : (
                      <Icon
                        name="check"
                        size={20}
                        color="green"
                        style={{marginLeft: 7}}
                      />
                    ))}
                  {item.key === 'parentCarrier' &&
                    (showQuestionMark && isParentFormNotFilled ? (
                      <SvgXml
                        xml={timerImage()}
                        height={20}
                        width={20}
                        color={'red'}
                        style={{marginLeft: 7}}
                      />
                    ) : (
                      <Icon
                        name="check"
                        size={20}
                        color="green"
                        style={{marginLeft: 7}}
                      />
                    ))}
                  {item.key === 'myTask' && (
                    <Text style={{marginLeft: 5, color: '#6A2382'}}>
                      {` ${selectRefreshCaseloadCard?.completed_task}/${
                        selectRefreshCaseloadCard?.completed_task +
                        selectRefreshCaseloadCard?.pending_task
                      }`}
                    </Text>
                  )}
                </View>
                {i === navigationState.index && (
                  <View style={styles.tabIndicatorContainer}>
                    <View
                      style={[styles.tabItemIndicator, styles.tabItemFocused]}
                    />
                    <View style={styles.triangle} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };
  return (
    <>
      <View style={{flex: 1}}>
        <TabView
          // swipeEnabled={swapEnable}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={CustomTabBar}
          lazy={true}
        />
        {cardData?.status != '2' && (
          <TouchableOpacity
            onPress={onChatPress}
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              bottom: '4%',
              backgroundColor: '#6A2382',
              borderRadius: 120,
              padding: 15,
              right: 20,
              shadowColor: 'grey',
              shadowOpacity: 0.7,
              shadowOffset: {height: 1, width: 2},
            }}>
            {isUnread && (
              <View
                style={{
                  backgroundColor: 'red',
                  height: 12,
                  width: 12,
                  position: 'absolute',
                  marginTop: 10,
                  marginLeft: 10,
                  zIndex: 1000,
                  borderRadius: 10,
                }}></View>
            )}
            <SvgXml xml={chatIcon()} height={30} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default CaseLoadTabContainer;

const styles = StyleSheet.create({
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
    height: 48,
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
