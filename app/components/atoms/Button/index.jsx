import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Button = ({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  backgroundColor,
  iconSource,
  iconSize = 25,
  iconColor = 'black',
  startIcon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {backgroundColor},
        style,
        {
          borderWidth: 0.3,
          borderColor: 'grey',
          justifyContent: 'space-between',
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {startIcon == 'docs' && (
          <Image
            source={require('../../../assets/images/docsxIcon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
        {startIcon == 'video' && (
          <Image
            source={require('../../../assets/images/viedoIcon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </View>
      <View>
        {iconSource && (
          <Icon
            name={iconSource}
            size={iconSize}
            color={iconColor}
            style={{fontWeight: 'bold', marginHorizontal: 5}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // marginBottom: 20,
    // paddingVertical: 7,
    // paddingHorizontal: 10,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    height: 30,
    width: 30,
  },
});

export default Button;
