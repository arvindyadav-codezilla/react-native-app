import React from 'react';
import {Image, StyleSheet} from 'react-native';

const Images = ({source, headerImgStyle, resizeMode}) => {
  return (
    <Image source={source} style={headerImgStyle} resizeMode={resizeMode} />
  );
};

export default Images;
