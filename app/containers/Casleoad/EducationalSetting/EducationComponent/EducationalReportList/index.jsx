import React from 'react';
import {View, FlatList, RefreshControl, StyleSheet} from 'react-native';
import AccordionItem from '../../../../../components/organisms/AccordianItem';
import {Scale} from '../../../../../styles';
import T from '../../../../../components/atoms/T';

const EducationalReportList = ({
  educationalData,
  expanded,
  toggleExpand,
  loading,
  EducationalSettingList,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        data={educationalData?.schoolReport?.filter(item => !item.isDraft)}
        scrollEnabled
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <T
              title={'Education report not submitted'}
              style={styles.emptyText}
            />
          </View>
        }
        renderItem={({item}) => (
          <AccordionItem
            item={item}
            expanded={expanded[item?.id]}
            toggleExpand={() => toggleExpand(item?.id)}
            style={styles.accordionItem}
            type={'Education'}
          />
        )}
        keyExtractor={item => item?.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={EducationalSettingList}
            colors={['#6A2382']}
            tintColor="#6A2382"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Scale.moderateScale(400),
  },
  emptyContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6A2382',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  accordionItem: {
    marginBottom: '10%',
  },
});

export default EducationalReportList;
