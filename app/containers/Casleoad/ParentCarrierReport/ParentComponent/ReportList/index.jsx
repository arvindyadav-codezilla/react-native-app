import {FlashList} from '@shopify/flash-list';
import {View, Image, RefreshControl} from 'react-native';
import AccordionItem from '../../../../../components/organisms/AccordianItem';

const ReportList = ({
  data,
  loading,
  ParentDetailsList,
  expanded,
  toggleExpand,
}) => (
  <FlashList
    nestedScrollEnabled
    data={data}
    estimatedItemSize={361}
    renderItem={({item, index}) => (
      <AccordionItem
        item={item}
        expanded={expanded[index]}
        toggleExpand={() => toggleExpand(index)}
        type={'parent'}
      />
    )}
    keyExtractor={item => item.id}
    refreshControl={
      <RefreshControl
        refreshing={loading}
        onRefresh={ParentDetailsList}
        colors={['#6A2382']}
      />
    }
    showsVerticalScrollIndicator={false}
  />
);

export default ReportList;
