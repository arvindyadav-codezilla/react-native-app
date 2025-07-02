import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {TASK_STATUS} from '../../../utils/constant';
import T from '../../atoms/T';
import {getDateString} from '../../../utils/common';
import Button from '../../atoms/Button';
import ActivityIndicators from '../../atoms/ActivityIndicators';

const MyTaskCard = ({
  task,
  refreshTaskList,
  setShowDetailsModal,
  setShowChangeStatusModal,
  setSelectedTask,
}) => {
  const toggleDetailsModal = () => {
    setSelectedTask(task);
    setShowChangeStatusModal(false);
    setShowDetailsModal(true);
  };

  const toggleChangeStatusModal = () => {
    setSelectedTask(task);
    setShowDetailsModal(false);
    setShowChangeStatusModal(true);
  };

  const renderCompleteButton = () => {
    if (
      task?.status === TASK_STATUS.INPROGRESS ||
      task?.status === TASK_STATUS.PENDING
    ) {
      return (
        <Button
          title={'Mark as completed'}
          textStyle={styles.buttonText}
          style={[styles.button, styles.completeButton]}
          onPress={toggleChangeStatusModal}
        />
      );
    }
    return null;
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Task Details</Text>
          {task?.status === TASK_STATUS.DONE && (
            <View style={styles.verifiedContainer}>
              <Image
                source={require('../../../assets/images/verifiedIcon.png')}
                style={styles.verifiedIcon}
                resizeMode="contain"
              />
              <T
                title="Task completed"
                style={[styles.verified, {marginLeft: 5, color: 'green'}]}
              />
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Assigned By:</Text>
            <T
              title={`${task?.assignedBy?.first_name} ${task?.assignedBy?.last_name}`}
              style={styles.text}
            />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <T title={`${task?.assignedBy?.email}`} style={styles.text} />
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Assign Date:</Text>
            <T
              style={styles.text}
              title={task?.createdAt ? getDateString(task.createdAt) : null}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={toggleDetailsModal}
            title={'View Task'}
            textStyle={styles.buttonText}
            style={[styles.button, styles.viewButton]}
          />
          {renderCompleteButton()}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    paddingVertical: 3,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    left: -2,
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginRight: 10,
    color: 'black',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#101828',
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 7,
    borderRadius: 5,
  },
  viewButton: {
    backgroundColor: '#6A2382',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
  },
  verified: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verifiedContainer: {
    flexDirection: 'row',
  },
});

export default MyTaskCard;
