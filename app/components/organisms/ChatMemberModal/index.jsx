import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatMemberModal = ({ visible, onClose, members, onSelectUser }) => {
  const handleMemberPress = member => {
    onSelectUser(member);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalHeaderText}>Select a Member</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {members?.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={styles.memberButton}
                onPress={() => handleMemberPress(member)}>
                <Text style={styles.memberButtonText}>
                  {member?.first_name} {member?.last_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '88%',
    maxHeight: '80%', // Set maximum height to 80% of the screen height
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'black',
  },
  scrollView: {
    width: '100%',
  },
  memberButton: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  memberButtonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 5,
  },
});

export default ChatMemberModal;
