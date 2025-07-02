import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

const T = ({
  title,
  style,
  containerStyle,
  numberOfLines,
  textDecorationLine,
  color,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[styles.text, style, {textDecorationLine: textDecorationLine}]}
        numberOfLines={numberOfLines}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
  container: {},
});

export default T;
