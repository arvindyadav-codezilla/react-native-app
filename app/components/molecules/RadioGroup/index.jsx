import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const RadioGroup = ({options, onPress, defaultValue, disable}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = option => {
    if (typeof option == 'object') {
      setSelectedOption(option);
      onPress(option.name);
    } else {
      setSelectedOption(option);
      onPress(option);
    }
  };

  useEffect(() => {
    options.forEach(item => {
      if (item.name == defaultValue || item == defaultValue) {
        setSelectedOption(defaultValue);
      }
    });
  }, [defaultValue, options]);

  return (
    <View style={{flexDirection: 'row'}}>
      {options &&
        options.map((option, index) => {
          const isSelected =
            selectedOption === option.name || selectedOption === option;

          return (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center', padding: 3}}>
              <TouchableOpacity
                disabled={disable}
                onPress={() => handleOptionSelect(option)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: isSelected ? 5 : 2,
                    borderColor: isSelected ? '#6A2382' : '#667085',
                    marginRight: 8,
                  }}>
                  {/* {isSelected && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 29,
                        backgroundColor: '#6A2382',
                      }}
                    />
                  )} */}
                </View>
                <TouchableOpacity onPress={() => handleOptionSelect(option)}>
                  <Text
                    style={{
                      color: isSelected ? '#6A2382' : '#667085',
                    }}>
                    {option.name || option}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
};

export default RadioGroup;
