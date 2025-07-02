import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import {
  selectPatientData,
  setSelectedPatient,
} from '../../Dashboad/DashboadSlice';
import {useDispatch, useSelector} from 'react-redux';
import MyTaskCard from '../../../components/molecules/MyTaskCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import T from '../../../components/atoms/T';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import {taskList, taskStatus} from '../../../services/taskServices';
import {patientServices} from '../../../services/patientServices';
import {setOverviewDetils} from '../Overview/OverViewSlice';
import {storageRead} from '../../../utils/storageUtils';
import TaskDetailsModal from '../../../components/organisms/TaskDetailsModal';
import TaskStatusChangeModal from '../../../components/organisms/TaskStatusChangeModal';
import ToastHandler from '../../../components/atoms/ToastHandler';
import {
  refreshCaseloadCard,
  selectCaseloadCardData,
} from '../CaseLoadLayout/slectedCaseloadDetails';

const MyTask = props => {
  const [loading, setLoading] = useState(false);
  const [myTask, setMyTask] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const {cardData} = useSelector(selectCaseloadCardData);

  let {cardSelected} = useSelector(selectPatientData);
  const dispatch = useDispatch();

  useEffect(() => {
    getMyTaskList();
  }, []);

  const getMyTaskList = async () => {
    let data = await AsyncStorage.getItem('userDetails');
    let userData = JSON.parse(data);
    setLoading(true);
    try {
      const response = await taskList(cardSelected);
      let myTask = response?.data?.data;
      if (response.data.status === 200) {
        let filterTask = myTask?.tasks?.filter(
          item => item?.assignedTo?.id === userData?.id,
        );
        setMyTask(filterTask);
        caseLoadsList();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const refreshTaskList = () => {
    getMyTaskList();
  };

  const caseLoadsList = async () => {
    setLoading(true);
    let token = await storageRead('accessToken');
    try {
      const response = await patientServices(cardSelected, token);
      let patientOverViewData = response?.data?.data;
      if (response.data.status === 200) {
        const data = {
          ...cardSelected,
          pending_task: patientOverViewData?.pending_task,
          pathway_status: patientOverViewData?.pathway_status,
        };
        dispatch(refreshCaseloadCard(patientOverViewData));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatus = async comment => {
    if (!comment) {
      return Alert.alert('Comments are required');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('result', comment);
      let headers = {
        'Content-Type': 'multipart/form-data',
      };
      await taskStatus(selectedTask?.id, formData, headers);
      ToastHandler('Task status updated');
      refreshTaskList();
    } catch (error) {
    } finally {
      setLoading(false);
      setShowChangeStatusModal(false);
      setSelectedTask(null);
    }
  };

  const renderItem = ({item}) => {
    return (
      <MyTaskCard
        task={item}
        refreshTaskList={refreshTaskList}
        setShowDetailsModal={setShowDetailsModal}
        setShowChangeStatusModal={setShowChangeStatusModal}
        setSelectedTask={setSelectedTask}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          If one of our clinical team requires any additional specific
          information, they can create a task on the portal for you to complete
          in this section of the portal. An email will be sent to you advising
          that there are tasks waiting for you on the portal and you will be
          able to view your task here. If nothing appears here, then you have no
          additional tasks to complete.
        </Text>
      </View>
      {cardData?.status != '2' && (
        <>
          <FlatList
            data={myTask}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexGrow: 1, paddingBottom: '23%'}}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshTaskList}
                colors={['#6A2382']}
                tintColor="#6A2382"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <T title={'No task Added'} style={styles.emptyText} />
              </View>
            }
          />
        </>
      )}

      {cardData?.status === '2' && (
        <View style={{flex: 1}}>
          <Text
            style={{
              marginTop: 200,
              color: '#6A2382',
              fontSize: 16,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            Referal Closed
          </Text>
        </View>
      )}
      {loading && (
        <ActivityIndicators
          size="large"
          color="#6A2382"
          visible={loading}
          style={{backgroundColor: 'white'}}
        />
      )}

      {showDetailsModal && (
        <TaskDetailsModal
          visible={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          task={selectedTask}
        />
      )}
      {showChangeStatusModal && (
        <TaskStatusChangeModal
          visible={showChangeStatusModal}
          onClose={() => setShowChangeStatusModal(false)}
          onSubmit={handleTaskStatus}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  infoContainer: {
    marginHorizontal: '4%',
  },
  infoText: {
    color: 'grey',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6A2382',
  },
});

export default MyTask;
