import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import Modal from 'react-native-modal';

const BottomModalContainer = ({
  visible,
  onClose,
  children,
  Modalstyle,
  onSwapClose,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, Modalstyle]}>
            <View style={{padding: 10, alignItems: 'center'}}>
              <View style={styles.topLine}></View>
            </View>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  topContainer: {
    zIndex: 1000,
    position: 'absolute',
    top: 240,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topLine: {
    padding: 2.5,
    backgroundColor: 'black',
    width: 85,
    borderRadius: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '70%',
    maxHeight: '100%',
  },
});

export default BottomModalContainer;
