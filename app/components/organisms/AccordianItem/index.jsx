import React, {useLayoutEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BreakSectionLine from '../../molecules/BreakSectionLine';
import T from '../../atoms/T';
import {
  camelCaseToUpperWords,
  formatIsoDateToDDMMYYYY,
  replaceText,
  transformCamelCaseToSpaces,
} from '../../../utils/common';
import {selectPatientData} from '../../../containers/Dashboad/DashboadSlice';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
const AccordionItem = ({item, type, toggleExpand}) => {
  const [expanded, setExpanded] = useState({});
  useLayoutEffect(() => {
    const initialExpandedState = {};
    Object.entries(item.data).forEach((_, index) => {
      initialExpandedState[index] = false;
    });
    setExpanded(initialExpandedState);
  }, [toggleExpand]);
  // const {cardSelected} = useSelector(selectPatientData);
  const cardSelected = useSelector(selectOverViewData);

  const toggleExpands = index => {
    setExpanded(prevExpanded => {
      const newExpandedState = {...prevExpanded};
      newExpandedState[index] = !newExpandedState[index];
      return newExpandedState;
    });
  };
  const convertToCamelCase = str => {
    return str
      .replace(/_([a-z])/g, function (g) {
        return ' ' + g[1].toUpperCase();
      })
      .replace(/^\w/, c => c.toUpperCase())
      .replace(/_/g, ' ');
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlashList
          nestedScrollEnabled
          estimatedItemSize={47}
          data={Object.entries(item.data).map(([key, value]) => ({
            key: convertToCamelCase(key),
            data: value,
          }))}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={{}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 3,
                    padding: 8,
                    alignItems: 'center',
                    paddingHorizontal: '6%',
                  }}
                  onPress={() => toggleExpands(index)}>
                  <Text style={styles.sectionHeader}>
                    {index + 1}.{' '}
                    {transformCamelCaseToSpaces(
                      replaceText(type, item.key?.toString(), cardSelected),
                    )}
                  </Text>

                  <SimpleLineIcons
                    name={expanded[index] ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={'black'}
                  />
                </TouchableOpacity>

                {expanded[index] && (
                  <FlashList
                    estimatedItemSize={92}
                    data={item?.data}
                    renderItem={({item, index}) => {
                      return (
                        <View key={index} style={styles.question}>
                          <T
                            title={`Q${item?.question_number}. ${replaceText(
                              type,
                              item?.question?.toString(),
                              cardSelected,
                            )}`}
                            style={{fontWeight: 'bold'}}
                          />
                          <View style={{}}>
                            <>
                              {typeof item?.answer === 'string' ? (
                                <View style={{flexDirection: 'row'}}>
                                  <T
                                    title={'Ans.'}
                                    style={{fontWeight: 'bold'}}
                                  />
                                  <T
                                    title={
                                      item.type == 'date'
                                        ? item?.answer
                                        : item?.answer
                                    }
                                    style={styles.answerText}
                                  />
                                </View>
                              ) : (
                                <View>
                                  {/* <T
                                    title={'Ans.'}
                                    style={{fontWeight: 'bold'}}
                                  /> */}
                                  {item?.answer?.map((item, index) => {
                                    return (
                                      <View style={{flexDirection: 'row'}}>
                                        {/* <T
                                          title={`${item?.name}: `}
                                          style={{
                                            fontWeight: 'bold',
                                            fontSize: 13,
                                            color: 'black',
                                          }}
                                        /> */}

                                        <T
                                          title={
                                            item?.type == 'date'
                                              ? formatIsoDateToDDMMYYYY(
                                                  item.answer,
                                                )
                                              : item.answer
                                          }
                                          style={{fontSize: 13, color: 'black'}}
                                        />
                                      </View>
                                    );
                                  })}
                                </View>
                              )}

                              {/* ----------------------------------------------- Education report nested filed*/}

                              <>
                                {item?.isAdditional &&
                                  type === 'Education' &&
                                  typeof item?.isAdditionalStructure ===
                                    'object' &&
                                  item?.isAdditionalStructure?.answer && (
                                    <View style={{}}>
                                      <Text
                                        style={{
                                          color: 'black',
                                          fontWeight: 'bold',
                                        }}>
                                        {item?.isAdditionalStructure
                                          ?.question != 'Details' &&
                                          item?.isAdditionalStructure
                                            ?.question != 'Please describe:' &&
                                          item?.isAdditionalStructure
                                            ?.question != 'More Details' &&
                                          item?.isAdditionalStructure?.question}
                                      </Text>
                                      <Text
                                        style={{
                                          color: 'black',
                                          // marginHorizontal: 10,
                                          maxWidth: '70%',
                                        }}>
                                        {`Ans. ${replaceText(
                                          type,
                                          item?.isAdditionalStructure?.answer.toString(),
                                          cardSelected,
                                        )}`}
                                      </Text>
                                    </View>
                                  )}
                              </>

                              <>
                                {/* ----------------------------------------------- parent report nested filed*/}
                                {item?.nesting &&
                                  type === 'parent' &&
                                  item?.nestingObj?.onetype?.map(
                                    (nestingItem, index) => {
                                      if (nestingItem?.answer)
                                        return (
                                          <View style={{flexDirection: 'row'}}>
                                            <Text
                                              style={{
                                                color: 'black',
                                                fontWeight: 'bold',
                                              }}>
                                              {`${index + 1}. ${
                                                nestingItem?.name !=
                                                  'Details' &&
                                                nestingItem?.name != 'X' &&
                                                nestingItem?.name !=
                                                  'Please describe:' &&
                                                nestingItem?.name !=
                                                  'More Details' &&
                                                nestingItem?.name
                                              }`}
                                            </Text>
                                            <Text
                                              style={{
                                                color: 'black',
                                                marginHorizontal: 10,
                                                maxWidth: '70%',
                                              }}>
                                              {replaceText(
                                                type,
                                                nestingItem?.answer.toString(),
                                                cardSelected,
                                              )}
                                            </Text>
                                          </View>
                                        );
                                    },
                                  )}

                                {/* -------------------------------------------------------------- */}
                              </>
                            </>
                          </View>
                          <BreakSectionLine
                            style={{marginTop: 10, height: 0.3}}
                          />
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index?.toString()}
                  />
                )}
              </View>
            );
          }}
          keyExtractor={(item, index) => index?.toString()}
        />
      </View>
    </View>
  );
};

export default AccordionItem;

const styles = StyleSheet.create({
  container: {},
  key: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 5,
    color: '#6A2382',
    fontFamily: 'Inter-SemiBold',
  },
  question: {
    backgroundColor: 'white',

    padding: 8,
    // paddingHorizontal: 15,
    paddingHorizontal: '8%',
  },
  questionText: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 5,
    color: '#101828',
    fontFamily: 'Inter-Bold',
  },
  answerText: {
    fontSize: 14,
    color: '#444C55',
    fontWeight: '400',
    paddingLeft: 5,
    paddingTop: 2,
    fontFamily: 'Inter-Medium',
  },
});
