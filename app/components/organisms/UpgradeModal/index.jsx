import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const UpgradeModal = ({showUpgradeModal, onUpgrade}) => {
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showUpgradeModal) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      bounceValue.setValue(1);
    }
  }, [showUpgradeModal]);

  return (
    <Modal visible={showUpgradeModal} transparent={true} animationType="none">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Animated.View style={{transform: [{scale: bounceValue}]}}>
            <Icon name="update" size={50} color="black" style={styles.icon} />
          </Animated.View>
          <Text style={styles.titleText}>New Version Available!</Text>
          <Text style={styles.descriptionText}>
            Upgrade to the latest version for new features and improvements.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onUpgrade}>
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay for more focus
  },
  modalContainer: {
    width: 320,
    padding: 30,
    backgroundColor: 'white', // Custom background color
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10, // Add shadow on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 22, // Larger font size for title
    color: 'black', // Black text color for contrast
    fontWeight: 'bold', // Make title bold
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16, // Font size for description
    color: 'black', // Black text color for contrast
    marginBottom: 25,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6A2382', // Button background color
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white', // Text color for the button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpgradeModal;
