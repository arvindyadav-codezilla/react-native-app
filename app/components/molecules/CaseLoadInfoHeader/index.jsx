import React from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import T from '../../atoms/T';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SvgXml} from 'react-native-svg';
import LeftArrow from '../../../assets/SvgImages/leftArrow';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CaseLoadInfoHeader = ({
  icon,
  name,
  iconSize,
  iconColor,
  iconFirst,
  iconFirstPress,
  chatIcon,
  chatIconPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {iconFirst && (
          // <View style={styles.iconFirstContainer}>
          //   <Pressable onPress={iconFirstPress}>
          //     <Icon name={iconFirst} size={20} color={iconColor} />
          //   </Pressable>
          // </View>
          <Pressable
            onPress={iconFirstPress}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 5,
            }}>
            <SvgXml xml={LeftArrow()} />
          </Pressable>
        )}
        <T title={name} style={styles.name} />
      </View>

      <View style={styles.rightContainer}>
        {chatIcon && (
          <Pressable onPress={chatIconPress}>
            <MaterialCommunityIcons
              name={chatIcon}
              size={iconSize}
              style={styles.image}
              color={iconColor}
            />
          </Pressable>
        )}
        {/* {icon && (
          <Icon
            name={icon}
            size={iconSize}
            style={styles.image}
            color={iconColor}
          />
        )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconFirstContainer: {
    backgroundColor: 'white',
    borderWidth: 0.6,
    borderColor: '#CCCCCC',
    borderRadius: 3,
    marginRight: 12,
    elevation: 3,
    paddingBottom: 6,
  },
  rightContainer: {
    flexDirection: 'row',
    // paddingRight: '5%',
  },
  image: {
    // marginBottom: 3,
    // top:3
  },
  name: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
    left: 10,
  },
});

export default CaseLoadInfoHeader;
