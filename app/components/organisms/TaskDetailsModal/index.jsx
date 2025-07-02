import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {getDateString} from '../../../utils/common';
import Button from '../../atoms/Button';
import Modal from 'react-native-modal';

const TaskDetailsModal = ({visible, onClose, task}) => {
  return (
    <Modal isVisible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Task Details</Text>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{task.description}</Text>
          <Text style={styles.label}>Assigned By:</Text>
          <Text
            style={
              styles.text
            }>{`${task?.assignedBy?.first_name} ${task?.assignedBy?.last_name}`}</Text>
          <Text style={styles.label}>Assigned To:</Text>
          <Text
            style={
              styles.text
            }>{`${task?.assignedTo?.first_name} ${task?.assignedTo?.last_name}`}</Text>
          <Text style={styles.label}>Completion Date:</Text>
          <Text style={styles.text}>
            {task?.completion_date ? getDateString(task?.completion_date) : '-'}
          </Text>
          <Button
            onPress={onClose}
            title={'Close'}
            textStyle={styles.buttonText}
            style={[styles.viewButton]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    margin: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#101828',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  viewButton: {
    backgroundColor: '#6A2382',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    padding: 10,
  },
});

export default TaskDetailsModal;
