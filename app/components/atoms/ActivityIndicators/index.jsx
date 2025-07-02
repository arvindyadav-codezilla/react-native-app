import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const ActivityIndicators = ({size, color, visible, style}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, {...style}]}>
      <ActivityIndicator size={size || 'large'} color={color || '#0000ff'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default ActivityIndicators;
