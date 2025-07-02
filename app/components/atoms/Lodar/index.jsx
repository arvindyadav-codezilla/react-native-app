import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6A2382" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  loader: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,

    alignItems: 'center',
  },
});

export default Loader;
