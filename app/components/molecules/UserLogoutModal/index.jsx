import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const CustomModal = ({visible, onClose, children, title}) => {
  return (
    <Modal
      onRequestClose={onClose}
      onTouchCancel={onClose}
      transparent
      visible={visible}
      animationType="fade">
      {/* Close the modal when clicking outside */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          {/* Prevent clicks inside the modal content from closing it */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {title && (
                <View>
                  <Text style={styles.modalTitle}>{title}</Text>
                </View>
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 90 : 130,
    right: 10,
    backgroundColor: 'white',
    // padding: 20,
    borderRadius: 5,
    elevation: 10,
    width: '45%',
    height: '18%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#6A2382',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default CustomModal;
