import React from 'react';
import {View, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressBar = ({
  progress,
  width,
  height,
  unfilledColor,
  color,
  borderColor,
  borderRadius,
}) => {
  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={width}
        unfilledColor={unfilledColor}
        height={height}
        color={color}
        borderColor={borderColor}
        borderRadius={borderRadius}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 1,
  },
});

export default ProgressBar;
