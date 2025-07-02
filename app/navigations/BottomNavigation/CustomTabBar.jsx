import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {AppImages} from '../../styles/images';
import { SvgXml } from 'react-native-svg';
import BottomTabIcon from '../../assets/SvgImages/BottomTabIcon';
const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused ? styles.tabItemFocused : styles.tabItemUnFocused,
            ]}>
            
            <SvgXml xml={isFocused? BottomTabIcon('#6A2382'): BottomTabIcon("#243641")} />
            <Text style={[styles.tabLabel,isFocused&& {color:'#6A2382'}]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CustomTabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#6A238220',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabItemFocused: {
    // borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A238210',
    
  },
  tabItemUnFocused: {
    // borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '500',
    color:'black',
    marginLeft: 10
  },
});
