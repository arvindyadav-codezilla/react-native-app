import {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectPatientData} from '../../../Dashboad/DashboadSlice';
import {schoolReportDetails} from '../../../../services/educationalSettingServices';
import {
  selectOverViewData,
  setOverviewDetils,
} from '../../Overview/OverViewSlice';
import {getDocumentList} from '../../../../services/documentServices';
import {
  downloadPDF,
  getFileExtension,
  pdfDownloadDocument,
} from '../../../../utils/common';
import {storageRead} from '../../../../utils/storageUtils';
import {useFocusEffect} from '@react-navigation/native';
import {
  refreshCaseloadCard,
  selectCaseloadCardData,
} from '../../CaseLoadLayout/slectedCaseloadDetails';
import {ROLE} from '../../../../utils/constant';
import {
  getPdfServices,
  patientServices,
} from '../../../../services/patientServices';

export const useEducationalSetting = () => {
  const [educationalData, setEducationalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState('');
  const [documents, setDocuments] = useState({});
  const [renderPng, setRenderPng] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState(null);
  const [caseload, setCaseload] = useState(null);

  const dispatch = useDispatch();
  const {cardSelected} = useSelector(selectPatientData);
  const overViewData = useSelector(selectOverViewData);
  const {cardData} = useSelector(selectCaseloadCardData);

  // Fetch the user token and details
  const userToken = async () => {
    let token = await storageRead('accessToken');
    let userDetails = await storageRead('userDetails');
    setUser(userDetails);
    setToken(token);
  };

  // Fetch educational data
  const EducationalSettingList = async () => {
    if (!overViewData?.isHomeSchooling) {
      return;
    }

    setLoading(true);
    try {
      const response = await schoolReportDetails(cardSelected);
      if (response.data.status === 200) {
        setEducationalData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching educational data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle document fetching
  const fetchDocumentsFromAPI = async () => {
    setLoading(true);
    try {
      const response = await getDocumentList({
        id: overViewData?.id,
        isDownload: false,
      });
      if (response?.data?.data?.caseload_documents[0]?.url) {
        getDocumentUrl(response?.data?.data?.caseload_documents[0]?.url);
        const data = response?.data?.data?.caseload_documents.filter(
          item => item.uploadType === 'education-report',
        );
        if (data) {
          setDocuments(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = async url => {
    try {
      const extension = await getFileExtension(url);
      setRenderPng(extension === 'png');
    } catch (error) {
      setRenderPng(false);
    }
  };

  // Handle PDF generation
  const handleCreatePDF = async () => {
    setDisable(true);
    if (educationalData?.schoolReport?.length === 0) {
      setDisable(false);
      return;
    }

    // const report_type = 'education';
    // const unique_id = educationalData?.schoolReport[0]?.id;
    // const caseload_id = cardData?.id;

    // try {
    //   const response = await getPdfServices(
    //     report_type,
    //     unique_id,
    //     caseload_id,
    //   );
    //   const filePath = await downloadPDF({
    //     fileName: response.hedaer,
    //     fileData: response.data,
    //   });
    //   console.log('PDF downloaded:', filePath);
    // } catch (error) {
    //   console.error('Failed to create PDF:', error);
    // } finally {
    //   setDisable(false);
    // }
    try {
      const response = await getDocumentList({
        id: overViewData?.id,
        isDownload: true,
      });

      const urlData = response?.data?.data?.caseload_documents?.filter(
        item => item.uploadType === 'education-report',
      );
      let data = await pdfDownloadDocument(
        urlData[0]?.url,
        urlData[0]?.uploadType,
        setDisable,
      );
    } catch (error) {
      setLoading(false);
    }
  };

  // Handle expanding and collapsing sections
  const toggleExpand = key => {
    setExpanded(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Focus effect for refreshing data on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchDocumentsFromAPI();
      caseLoadsDetails();
    }, []),
  );

  // Fetch case load data
  const caseLoadsDetails = async () => {
    setLoading(true);
    let token = await storageRead('accessToken');

    try {
      const response = await patientServices(overViewData?.id, token);
      const patientOverViewData = response.data.data;
      dispatch(refreshCaseloadCard(patientOverViewData));

      if (response.data.status === 200) {
        dispatch(setOverviewDetils(patientOverViewData));
        setCaseload(patientOverViewData);
      }
    } catch (error) {
      console.error('Error fetching caseload data:', error);
    } finally {
      setLoading(false);
    }
  };

  const findRole = caseload?.caseload_members.find(
    item => item?.user?.id === user?.id,
  )?.role;

  const getUserRoles = findRole === ROLE?.RESTRICTED_ACCESS;

  useEffect(() => {
    EducationalSettingList();
    userToken();
  }, []);
  const handleCloseAlert = () => {
    setAlertVisible(false);
    // setTimeout(() => {
    openModal();
    // }, 2000);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    EducationalSettingList();
    fetchDocumentsFromAPI();
    setModalVisible(false);
    setTimeout(() => {
      caseLoadsDetails();
    }, 500);
  };
  const showAlert = () => {
    setAlertVisible(true);
  };
  return {
    educationalData,
    loading,
    expanded,
    toggleExpand,
    modalVisible,
    setModalVisible,
    alertVisible,
    setAlertVisible,
    handleCreatePDF,
    documents,
    renderPng,
    setRenderPng,
    user,
    caseload,
    getUserRoles,
    pdfLoading,
    disable,
    cardData,
    overViewData,
    handleCloseAlert,
    closeModal,
    EducationalSettingList,
    showAlert,
    openModal,
  };
};
