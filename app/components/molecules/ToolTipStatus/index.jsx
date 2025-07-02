import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TOOL_TIP_PATHWAY_STATUS} from '../../../utils/constant';
import {Scale} from '../../../styles';
import BottomModalContainer from '../../atoms/BottomModalContainer';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
import {useSelector} from 'react-redux';
import T from '../../atoms/T';

const ToolTipStatus = ({visible, onClose}) => {
  const data = useSelector(selectOverViewData);
  if (!data) {
    return null;
  }

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const renderStatusItem = (status, index) => {
    const statusName = Object.keys(TOOL_TIP_PATHWAY_STATUS).find(
      key => TOOL_TIP_PATHWAY_STATUS[key] === status,
    );
    const formattedStatusName = statusName
      .split('_')
      .map(capitalizeFirstLetter)
      .join(' ');
    let isStatusChecked = false;
    if (status === '7') {
      isStatusChecked = data?.pending_task === 0;
    } else if (status === '4') {
      isStatusChecked =
        data?.pending_task === 0 &&
        data?.pathway_status?.includes('2') &&
        data?.pathway_status?.includes('3');
    } else if (status === '5' && data?.pathway_status?.includes('6')) {
      isStatusChecked = data?.pending_task === 0;
    } else {
      isStatusChecked = data?.pathway_status?.includes(status);
    }

    return (
      <View key={status} style={styles.itemContainer}>
        <View style={styles.columnContainer}>
          <View
            style={[
              styles.circle,
              isStatusChecked ? styles.checkedCircle : null,
            ]}>
            <T
              title={isStatusChecked ? '✓' : index + 1}
              style={[styles.tick, isStatusChecked ? styles.checkedTick : null]}
            />
          </View>
          {index + 1 !== 6 && (
            <View style={styles.dotsContainer}>
              <View
                style={[isStatusChecked ? styles.checkDots : styles.dots]}
              />
              <View
                style={[isStatusChecked ? styles.checkDots : styles.dots]}
              />
              <View
                style={[isStatusChecked ? styles.checkDots : styles.dots]}
              />
            </View>
          )}
        </View>
        <View
          style={{alignItems: 'center', justifyContent: 'center', height: 35}}>
          <T
            title={formattedStatusName}
            style={[isStatusChecked ? styles.checkedItemText : styles.itemText]}
          />
        </View>
      </View>
    );
  };

  const pathwayOrder = ['1', '3', '2', '4', '5', '6'];

  return (
    <BottomModalContainer
      visible={visible}
      onClose={onClose}
      onSwapClose={onClose}
      Modalstyle={{minHeight: '65%', maxHeight: '70%'}}>
      <View style={styles.modalContent}>
        {pathwayOrder.map((status, index) => renderStatusItem(status, index))}
      </View>
    </BottomModalContainer>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '100%',
    padding: Scale.moderateScale(20),
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#2A2F45',
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    backgroundColor: '#6A2382',
  },
  itemText: {
    fontSize: 17,
    paddingLeft: 20,
    color: 'black',
    fontFamily: 'Inter-Regular',
  },
  checkedItemText: {
    fontSize: 17,
    paddingLeft: 20,
    color: '#6A2382',
    fontFamily: 'Inter-Bold',
  },
  dotsContainer: {},
  checkDots: {
    height: 5,
    width: 5,
    backgroundColor: '#6A2382',
    marginTop: 3,
    borderRadius: 10,
    margin: 5,
  },
  dots: {
    height: 5,
    width: 5,
    backgroundColor: 'grey',
    marginTop: 3,
    borderRadius: 10,
    margin: 5,
  },
  tick: {
    color: 'white',
    fontSize: 20,
  },
  checkedTick: {
    fontSize: 15,
    color: 'white',
  },
});

export default ToolTipStatus;
