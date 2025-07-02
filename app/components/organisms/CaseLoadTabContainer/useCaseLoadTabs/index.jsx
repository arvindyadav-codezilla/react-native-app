import {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {storageRead} from '../../../../utils/storageUtils';
import {patientServices} from '../../../../services/patientServices';

import {selectCaseloadData} from '../../../../containers/Casleoad/CaseLoadLayout/caseloadSelectedSlice';
import {
  selectCaseloadCardData,
  selectRefreshCaseloadCardData,
} from '../../../../containers/Casleoad/CaseLoadLayout/slectedCaseloadDetails';
import {selectOverViewData} from '../../../../containers/Casleoad/Overview/OverViewSlice';
import {selectPatientData} from '../../../../containers/Dashboad/DashboadSlice';
const useCaseLoadTabs = data => {
  const [index, setIndex] = useState(0);
  const [isUnread, setIsUnread] = useState(false);
  const scrollViewRef = useRef(null);
  const hasNavigatedInitially = useRef(false); // Track if navigation happened once

  const {cardData} = useSelector(selectCaseloadCardData);

  const overViewData = useSelector(selectOverViewData);
  const selectRefreshCaseloadCard = useSelector(selectRefreshCaseloadCardData);
  const selectedCard = useSelector(selectCaseloadData);
  const {cardSelected} = useSelector(selectPatientData);

  const enableButton =
    overViewData?.pathway_status?.includes('2') &&
    overViewData?.pathway_status?.includes('3') &&
    overViewData?.pending_task === 0;

  const chatnavigate =
    data?.pending_task !== 0 &&
    data?.pending_task !== undefined &&
    selectedCard?.type === 'overview';

  const getCaseLoadData = async () => {
    try {
      const token = await storageRead('accessToken');
      const response = await patientServices(overViewData?.id, token);
      const patientOverViewData = response.data.data?.isUnreadMessage;
      setIsUnread(patientOverViewData);
    } catch (error) {
      console.error('Error fetching case load data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (overViewData) {
        getCaseLoadData();
      }
    }, [overViewData]),
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index === 1 ? index * -20 : index * 130,
        animated: true,
      });
    }
  }, [index]);

  // useEffect(() => {
  //   const scrollToIndex = tabIndex => {
  //     if (scrollViewRef.current) {
  //       scrollViewRef.current.scrollTo({
  //         x: tabIndex * 130,
  //         animated: true,
  //       });
  //     }
  //   };

  //   if (chatnavigate) {
  //     setIndex(4);
  //     scrollToIndex(4);
  //   } else if (selectedCard?.type === 'School-Report') {
  //     setIndex(1);
  //     scrollToIndex(1);
  //   } else if (selectedCard?.type === 'Document') {
  //     setIndex(3);
  //     scrollToIndex(3);
  //   } else if (selectedCard?.type === 'MyTask') {
  //     setIndex(4);
  //     scrollToIndex(4);
  //   } else if (selectedCard?.type === 'Clinician' && !enableButton) {
  //     setIndex(5);
  //     scrollToIndex(5);
  //   }
  // }, [data]);
  useEffect(() => {
    const scrollToIndex = tabIndex => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: tabIndex * 130,
          animated: true,
        });
      }
    };

    if (chatnavigate && !hasNavigatedInitially.current) {
      setIndex(4);
      scrollToIndex(4);
      hasNavigatedInitially.current = true; // Mark as navigated
    } else {
      switch (selectedCard?.type) {
        case 'School-Report':
          setIndex(1);
          scrollToIndex(1);
          break;
        case 'Document':
          setIndex(3);
          scrollToIndex(3);
          break;
        case 'MyTask':
          setIndex(4);
          scrollToIndex(4);
          break;
        case 'Clinician':
          if (!enableButton) {
            setIndex(5);
            scrollToIndex(5);
          }
          break;
        default:
          break;
      }
    }
  }, [data]);

  useEffect(() => {
    if (!enableButton && index === 5) {
      setIndex(4);
    }
  }, [index]);

  return {
    index,
    setIndex,
    isUnread,
    scrollViewRef,
    overViewData,
    selectRefreshCaseloadCard,
    enableButton,
    cardSelected,
    cardData,
  };
};

export default useCaseLoadTabs;
