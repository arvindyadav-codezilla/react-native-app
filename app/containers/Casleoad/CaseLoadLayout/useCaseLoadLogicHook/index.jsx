import {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectOverViewData,
  setOverviewDetils,
} from '../../Overview/OverViewSlice';
import {setSelectedPatient} from '../../../Dashboad/DashboadSlice';
import {patientServices} from '../../../../services/patientServices';
import {storageRead} from '../../../../utils/storageUtils';
import {PATHWAY_STATUS} from '../../../../utils/constant';
import {refreshCaseloadCard, setCardDetails} from '../slectedCaseloadDetails';
import {setCaseloadDetails} from '../caseloadSelectedSlice';
import {getPathWayStatus, getStatusText} from '../../../../utils/common';

const useCaseLoadLogicHook = props => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const overViewData = useSelector(selectOverViewData);

  const data = props?.route?.params;
  const {cardInfo} = data?.data;

  useEffect(() => {
    if (cardInfo) {
      caseLoadsDetails();
      dispatch(setSelectedPatient(cardInfo));
      dispatch(setCaseloadDetails(data?.data));
    }
  }, [cardInfo]);

  const caseLoadsDetails = async () => {
    setLoading(true);
    const token = await storageRead('accessToken');

    try {
      const response = await patientServices(cardInfo, token);
      const patientOverViewData = response.data.data;

      if (response.data.status === 200) {
        dispatch(setOverviewDetils(patientOverViewData));
        dispatch(setCardDetails(patientOverViewData));
        dispatch(refreshCaseloadCard(patientOverViewData));
      }
    } catch (error) {
      console.error('Error fetching caseload details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    PathWayStatus();
  }, [cardInfo]);

  const nextMileStone = () => {
    let data = overViewData?.pathway_status;
    const expectedValues = ['1', '3', '2', '4', '5', '6'];

    for (let value of expectedValues) {
      if (data?.includes('6')) {
        return '6';
      } else if (!data?.includes(value)) {
        return value;
      }
    }

    return null;
  };

  let nextMile = nextMileStone();

  const getStatusTextsss = status => {
    switch (status) {
      case PATHWAY_STATUS.CASELOAD_CREATED:
        return {id: '0.3', status: 'Referral Received'};
      case PATHWAY_STATUS.PARENT_REPORT_RECEIVED:
        return {id: '0.8', status: 'Parent/Carer Report '};
      case PATHWAY_STATUS.SCHOOL_REPORT_RECEIVED:
        return {id: '1.8', status: 'Educational Report '};
      case PATHWAY_STATUS.TASK:
        return {id: '2.9', status: 'Task'};
      case PATHWAY_STATUS.READY_FOR_MDT_REVIEW:
        return {id: '3.9', status: 'Ready For Clinical Review'};
      case PATHWAY_STATUS.CASELOAD_CLOSED:
        return {id: '6', status: 'Referral Closed'};
      default:
        return 'Unknown Status';
    }
  };

  let nextMileStoneStatus = getStatusTextsss(nextMile);
  let progressBar = nextMileStoneStatus?.id / 6;

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    caseLoadsDetails();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const PathWayStatus = () => {
    let milestoneDetails;
    if (overViewData) {
      let result = overViewData?.pathway_status;
      if (result && result.length > 0) {
        let lastIndex = result.length - 1;
        let lastItem = result[lastIndex];
        if (lastItem === '4') {
          milestoneDetails = getPathWayStatus('5');
        } else {
          milestoneDetails = getPathWayStatus(lastItem);
        }
      }
    }

    return milestoneDetails;
  };

  const nextMileStones = () => {
    let data = overViewData?.pathway_status;
    const expectedValues = ['1', '2', '3', '4', '5', '6'];

    for (let value of expectedValues) {
      if (!data?.includes(value)) {
        return value;
      }
    }

    return null;
  };

  let lastCheckedIndex = overViewData?.pathway_status?.length - 1;
  let lastCheckedStatus = overViewData?.pathway_status?.[lastCheckedIndex];
  let nextUncheckedStatus = nextMileStones();
  let titlePathway =
    overViewData?.pathway_status?.includes('6') &&
    overViewData?.pathway_status?.includes('2') &&
    overViewData?.pathway_status?.includes('3');
  let formattedLastCheckedStatus = PathWayStatus(lastCheckedStatus);
  let formattedNextUncheckedStatus = getStatusText(
    titlePathway ? '6' : nextUncheckedStatus,
  );

  return {
    loading,
    refreshing,
    isModalVisible,
    overViewData,
    nextMileStone,
    toggleModal,
    onRefresh,
    formattedNextUncheckedStatus,
    formattedLastCheckedStatus,
    progressBar,
    nextMileStoneStatus,
  };
};

export default useCaseLoadLogicHook;
