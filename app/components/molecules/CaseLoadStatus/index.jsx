import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as Progress from 'react-native-progress';
import ProgressBar from '../../atoms/ProgressBar';

const CaseLoadStatus = ({
  nextMilestone,
  caseloadTitle,
  icon,
  iconPress,
  progress,
  questionrange,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', width: '95%'}}>
            <Text style={styles.statusText}>{caseloadTitle}</Text>

            <Pressable onPress={iconPress} style={styles.iconContainer}>
              <Icon name={icon} size={13} color="#03A9F4" />
            </Pressable>
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingTop: 10, width: '90%'}}>
          {nextMilestone && (
            <>
              <Text style={styles.milestoneBoldText}>Next Milestone:</Text>
              <Text style={styles.milestoneNormalText}> {nextMilestone}</Text>
            </>
          )}
          {questionrange && (
            <>
              <Text style={[styles.milestoneNormalText, {fontWeight: 'bold'}]}>
                {' '}
                {`Total Questions ${questionrange}`}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={{paddingTop: 10, width: '100%', paddingHorizontal: 10}}>
        <ProgressBar
          progress={progress}
          width={315}
          height={9}
          unfilledColor={'#EFEFEF'}
          color={'#6A2382'}
          borderColor={'#EFEFEF'}
          borderRadius={15}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    paddingVertical: 17,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    // borderWidth: 1,
    borderTopColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 5,
    left: 7,
    bottom: 3,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6A2382',
    lineHeight: 18,
    maxWidth: '90%',
  },
  milestoneNormalText: {
    color: 'black',
    fontSize: 10.9,
    lineHeight: 10.9,
    textAlign: 'left',
    maxWidth: '90%',
    top: 1,
  },
  milestoneBoldText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 12.6,
    lineHeight: 12.6,
  },
});

export default CaseLoadStatus;
