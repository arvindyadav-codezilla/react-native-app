import React, {forwardRef} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Input = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  icon,
  onPressIcon,
  style,
  forwardedRef,
  InputStyle,
  onSubmitEditing,
  onFocus,
  editable = true,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        ref={forwardedRef} // Forwarding the ref to the TextInput component
        value={value}
        placeholderTextColor={'grey'}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, InputStyle]}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        editable={editable}
      />
      {icon && (
        <TouchableOpacity style={styles.iconContainer} onPress={onPressIcon}>
          <Icon
            name={secureTextEntry ? 'eye-slash' : 'eye'}
            size={24}
            color={secureTextEntry ? 'grey' : '#303030'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Forwarding ref
export default forwardRef((props, ref) => (
  <Input {...props} forwardedRef={ref} />
));

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 10,
  },
  iconContainer: {
    paddingRight: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    start: 5,
    color: 'black',
    fontFamily: 'Inter-Regular',
  },
});
