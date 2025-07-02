import React, {useState} from 'react';
import Input from '../../atoms/Input';

const InputField = props => {
  const {
    value,
    onChangeText,
    onBlur,
    icon,
    placeholder,
    initialSecureState,
    onSubmitEditing,
    keyboardType,
    editable,
  } = props;
  const [isSecure, setIsSecure] = useState(initialSecureState ?? true);
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      keyboardType={keyboardType}
      secureTextEntry={isSecure}
      style={{borderRadius: 25}}
      icon={icon}
      onPressIcon={() => setIsSecure(!isSecure)}
      InputStyle={{fontFamily: 'Inter-Regular'}}
      onSubmitEditing={onSubmitEditing}
      editable={editable}
    />
  );
};
export default InputField;
