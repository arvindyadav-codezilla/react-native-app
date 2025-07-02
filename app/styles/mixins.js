import { StyleSheet } from 'react-native';
import Colors from './colors';
import Typography from './typography';

const styles = StyleSheet.create({
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnCenterAlignStart: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  columnBetweenAlignTop: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  columnBetweenAlignEnd: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAroundAlignBase: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
  },
  rowBetweenAlignBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  rowBetweenAlignStart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circle: (size, color) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  headingTitle: (color) => ({
    ...Typography.style.headingU(),
    color: color || Colors.primaryColor,
    marginHorizontal: 15,
  }),
  indicator: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { styles };
