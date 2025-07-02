import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {selectPatientData} from '../../Dashboad/DashboadSlice';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROLE, SCOPE} from '../../../utils/constant';
import {Scale} from '../../../styles';
import T from '../../../components/atoms/T';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BreakSectionLine from '../../../components/molecules/BreakSectionLine';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {selectOverViewData} from './OverViewSlice';
import {SvgXml} from 'react-native-svg';
import EducationIcon from '../../../assets/SvgImages/EducationImage';
import ParentIcon from '../../../assets/SvgImages/ParentIcon';
import {selectCaseloadCardData} from '../CaseLoadLayout/slectedCaseloadDetails';
import {
  Gesture,
  GestureDetector,
  ScrollView as ScrollViews,
} from 'react-native-gesture-handler';
import {storageRead} from '../../../utils/storageUtils';

const {width} = Dimensions.get('window');

const Overview = props => {
  let {cardSelected} = useSelector(selectPatientData);
  let overViewDetails = useSelector(selectOverViewData);
  let selectCaseload = useSelector(selectCaseloadCardData);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const separateDataByScope = data => {
    const separatedData = {};
    data?.forEach(entry => {
      const scope = entry.user.scope;
      const scopeName = Object.keys(SCOPE).find(key => SCOPE[key] === scope);

      if (!separatedData[scopeName]) {
        separatedData[scopeName] = [];
      }
      if (separatedData[scopeName].length < 3) {
        separatedData[scopeName].push(entry);
      }
    });

    return separatedData;
  };

  const separatedData = separateDataByScope(overViewDetails?.caseload_members);
  let clinicData = separatedData?.CLINICIAN;
  let parentData = separatedData?.PARENT?.sort((a, b) => {
    if (a.role === '1' && b.role !== '1') {
      return -1; // a comes before b
    }
    if (a.user.scope !== '1' && b.user.scope === '1') {
      return 1; // b comes before a
    }
    return 0; // leave them unchanged relative to each other
  });
  let schoolData = separatedData?.SCHOOL;
  const getRoleName = roleValue => {
    switch (roleValue) {
      case ROLE.ALL_ACCESS:
        return 'All Access';
      case ROLE.RESTRICTED_ACCESS:
        return 'Restricted';
      case ROLE.VIEW_ACCESS:
        return 'View Access';
      default:
        return 'UNKNOWN_ROLE';
    }
  };

  const scrollViewRef = React.useRef(null);

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationDotsContainer}>
        {parentData?.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              {backgroundColor: index === activeIndex ? '#6A2382' : '#C4C4C4'},
            ]}
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: index * width,
                animated: true,
              });
              setActiveIndex(index);
            }}
          />
        ))}
      </View>
    );
  };
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUserData = async () => {
      let userData = await storageRead('userDetails');
      let data = [];

      if (userData) {
        data.push({
          first_name: `${userData?.first_name}`,
          last_name: `${userData?.last_name}`,
          phone: `${userData?.phone_no}`,
          email: `${userData?.email}`,
        });
      }

      setUser(data);
    };

    getUserData();
  }, []);

  const renderParentData = () => {
    return user?.map((item, index) => (
      <View key={index} style={styles.parentCard}>
        <View style={styles.cardTextContainer}>
          <T title={'Name:'} style={styles.boldText} />
          <View style={{flexDirection: 'row'}}>
            <T title={item?.first_name} style={styles.normalText} />
            {item?.last_name !== null && (
              <T
                title={item?.last_name}
                style={[styles.normalText, {marginLeft: 5}]}
              />
            )}
          </View>
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Email:'} style={styles.boldText} />

          <T title={item?.email} style={styles.normalText} />
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Contact Number:'} style={styles.boldText} />

          <T title={item?.phone ? item?.phone : 0} style={styles.normalText} />
        </View>
      </View>
    ));
  };
  const renderSchoolData = () => {
    return schoolData?.map((item, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.cardTextContainer}>
          <T title={'Name:'} style={styles.boldText} />

          <T title={item?.user?.school_name} style={styles.normalText} />
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Contact Person:'} style={styles.boldText} />
          <View style={{flexDirection: 'row'}}>
            <T title={item?.user?.first_name} style={styles.normalText} />
            <T title={item?.user?.last_name} style={styles.normalText} />
          </View>
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Contact Email:'} style={styles.boldText} />

          <T title={item?.user?.email} style={styles.normalText} />
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Contact Number:'} style={styles.boldText} />

          <T title={item?.user?.phone_no} style={styles.normalText} />
        </View>
        <BreakSectionLine />
        <View style={styles.cardTextContainer}>
          <T title={'Address:'} style={styles.boldText} />
          <T title={item?.user?.address} style={styles.normalText} />
        </View>
      </View>
    ));
  };
  const renderClinicData = () => {
    return clinicData?.map((item, index) => {
      return (
        <View key={index} style={{}}>
          {index != 0 && <BreakSectionLine />}
          <View
            style={{
              // flexDirection: 'row',
              justifyContent: 'space-between',
              // marginHorizontal:5
              // alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <T title={'Clinicians Name'} style={styles.boldText} />
              <T title={item?.user?.first_name} style={styles.normalText} />
            </View>
            <BreakSectionLine />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <T title={'Email Address'} style={styles.boldText} />

              <T
                title={item?.user?.email}
                style={[
                  styles.normalText,
                  {textAlign: 'center', marginLeft: 30},
                ]}
              />
            </View>
            <BreakSectionLine />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <T title={'Job Role'} style={styles.boldText} />

              <T title={item?.user?.jobRole} style={styles.normalText} />
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginHorizontal: '4%', fontFamily: 'Inter-Medium'}}>
        <Text
          style={{
            color: 'grey',

            // padding: 4,
            textAlign: 'left',
            marginTop: '18%',
            marginBottom: 5,
            letterSpacing: 0.8,
          }}>
          {`Please check your child / young Person’s details and contact our administration team if anything needs to be updated by emailing at {dynamic email for organisation support email}.`}
        </Text>
      </View>
      <ScrollView
        nestedScrollEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // flex: 1,
          backgroundColor: 'white',
          maxHeight: '200%',
          minHeight: !overViewDetails?.isHomeSchooling ? '120%' : '70%',
          paddingBottom: 130,
          // marginTop: 40,
        }}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                flexDirection: 'row',

                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SvgXml xml={ParentIcon()} />
                <T title={'Parent/Carer Details'} style={styles.hederText} />
              </View>
            </View>
          </View>
          <View style={{marginBottom: 15}}>
            <ScrollViews
              nestedScrollEnabled
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={event => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(contentOffsetX / width);
                setActiveIndex(index);
              }}>
              {renderParentData()}
            </ScrollViews>
            {/* {parentData?.length > 1 && (
              <View style={{paddingBottom: 12}}>{renderPaginationDots()}</View>
            )} */}
          </View>

          <>
            {schoolData?.length != 0 && schoolData && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <SvgXml xml={EducationIcon()} />
                      <T
                        title={'Education Setting Details'}
                        style={styles.hederText}
                      />
                    </View>
                  </View>
                </View>

                {!overViewDetails?.isHomeSchooling && (
                  <View style={{}}>{renderSchoolData()}</View>
                )}
              </>
            )}

            {overViewDetails?.isHomeSchooling && (
              <View
                style={[
                  styles.card,
                  {
                    height: Platform.OS === 'android' ? '15%' : '22%',
                    justifyContent: 'center',
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,

                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="home-city-outline"
                    size={20}
                    color={'#6A2382'}
                  />
                  <T
                    title={'Elective Home Education'}
                    style={{
                      fontFamily: 'Inter-Regular',
                      color: '#6A2382',
                      fontSize: 14,
                      paddingHorizontal: 10,
                    }}
                  />
                </View>
              </View>
            )}
          </>
        </View>
      </ScrollView>
      <ActivityIndicators
        size="large"
        color="#6A2382"
        visible={loading}
        style={{backgroundColor: 'white'}}
      />
    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  parentCard: {
    marginVertical: Scale.moderateScale(10),
    borderRadius: Scale.moderateScale(4),
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0.3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 0.25,
    elevation: Scale.moderateScale(1),
    // marginHorizontal: '2%',
    width: width - 30, // Adjust the card width based on the screen width
  },

  card: {
    marginVertical: Scale.moderateScale(10),
    borderRadius: Scale.moderateScale(4),
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0.3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 0.25,
    elevation: Scale.moderateScale(1),
  },
  cardTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  boldText: {
    color: 'black',
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  normalText: {
    color: 'black',
    fontWeight: '400',
    color: 'black',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  hederText: {
    paddingLeft: 10,
    fontFamily: 'Inter-Bold',
    color: '#101828',
    fontSize: 16,
  },
  verfied: {color: 'green', paddingHorizontal: 5, fontSize: 13, marginTop: 3},
  verifiedContainer: {flexDirection: 'row'},
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});
