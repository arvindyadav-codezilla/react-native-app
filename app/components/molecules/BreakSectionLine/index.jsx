import React from 'react';
import { StyleSheet, View } from 'react-native';

const BreakSectionLine = ({ style }) => {
   
  return (
    <View style={[styles.line,{...style}]} />
  );
};

export default BreakSectionLine;

const styles=StyleSheet.create({
    line:{ height: 0.5, backgroundColor: 'grey'}
})