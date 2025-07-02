import {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {selectPatientData} from '../../../Dashboad/DashboadSlice';
import {patientReportDetails} from '../../../../services/patientReportDetailsServices';
import {selectOverViewData} from '../../Overview/OverViewSlice';
import {getDocumentList} from '../../../../services/documentServices';
import {
  refreshCaseloadCard,
  selectCaseloadCardData,
  setCardDetails,
} from '../../CaseLoadLayout/slectedCaseloadDetails';
import {storageRead} from '../../../../utils/storageUtils';
import {ROLE} from '../../../../utils/constant';
import {
  getPdfServices,
  patientServices,
} from '../../../../services/patientServices';
import {downloadPDF, pdfDownloadDocument} from '../../../../utils/common';

export const useParentCarrierReport = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [downloadLoader, setDownloader] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState();
  const [caseload, setCaseload] = useState();

  const cardSelected = useSelector(selectPatientData)?.cardSelected;
  const overViewData = useSelector(selectOverViewData);
  const cardData = useSelector(selectCaseloadCardData)?.cardData;

  useEffect(() => {
    fetchParentDetails();
  }, []);

  const fetchParentDetails = async () => {
    setLoading(true);
    try {
      const response = await patientReportDetails(cardSelected);
      if (response.data.status === 200) {
        setParentData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFocused) {
      setExpanded({});
    }
  }, [isFocused]);

  const toggleExpand = key => {
    setExpanded(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  useEffect(() => {
    fetchDocumentData();
    fetchUserToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDocumentData();
      fetchCaseloadDetails();
    }, []),
  );

  const fetchDocumentData = async () => {
    try {
      const response = await getDocumentList({
        id: overViewData?.id,
        isDownload: false,
      });
      if (response.data.status === 200) {
        setDocuments(response.data.data.caseload_documents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCaseloadDetails = async () => {
    setLoading(true);
    try {
      const token = await storageRead('accessToken');
      const response = await patientServices(overViewData?.id, token);
      if (response.data.status === 200) {
        dispatch(refreshCaseloadCard(response.data.data));
        setCaseload(response.data.data);
        dispatch(setCardDetails(response.data.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserToken = async () => {
    const userDetails = await storageRead('userDetails');
    setUser(userDetails);
  };

  const findRole = caseload?.caseload_members.find(
    member => member?.user?.id === user?.id,
  )?.role;

  const handleCreatePDF = async () => {
    setDisable(true);
    // try {
    //   const reportType = 'parent';
    //   const uniqueId = parentData?.parentReport[0]?.id;
    //   const caseloadId = cardData?.id;

    //   const response = await getPdfServices(reportType, uniqueId, caseloadId);
    //   if (response?.data) {
    //     const fileName = response.hedaer;
    //     await downloadPDF({fileName, fileData: response.data});
    //   }
    // } catch (error) {
    //   console.error('PDF creation failed:', error);
    // } finally {
    //   setDisable(false);
    // }
    try {
      const response = await getDocumentList({
        id: overViewData?.id,
        isDownload: true,
      });
      const filteredDocumente =
        response?.data?.data?.caseload_documents?.filter(
          item => item.uploadType === 'parent-report',
        );

      let url = filteredDocumente[0]?.url;
      let data = await pdfDownloadDocument(
        url,
        filteredDocumente[0]?.uploadType,
        setDisable,
      );
    } catch (error) {
      setLoading(false);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    fetchParentDetails();
    fetchDocumentData();
    setModalVisible(false);
    setTimeout(fetchCaseloadDetails, 500);
  };
  const getUserRoles = findRole === ROLE?.RESTRICTED_ACCESS;

  const showAlert = () => {
    setAlertVisible(true);
  };

  const dataArray = parentData?.parentReport[0]?.data;

  let containsData = false;

  if (dataArray) {
    for (const key in dataArray) {
      if (Array?.isArray(dataArray[key]) && dataArray[key]?.length > 0) {
        containsData = true;
        break;
      }
    }
  }

  useEffect(() => {
    ParentDetailsList();
  }, []);

  const ParentDetailsList = async () => {
    setLoading(true);
    try {
      const response = await patientReportDetails(cardSelected);
      let ParentData = response?.data?.data;
      if (response.data.status === 200) {
        setParentData(ParentData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleCloseAlert = () => {
    setAlertVisible(false);
    openModal();
  };
  return {
    parentData,
    loading,
    expanded,
    modalVisible,
    alertVisible,
    documents,
    disable,
    findRole,
    toggleExpand,
    openModal,
    closeModal,
    handleCreatePDF,
    setAlertVisible,
    cardData,
    getUserRoles,
    showAlert,
    containsData,
    ParentDetailsList,
    handleCloseAlert,
  };
};
