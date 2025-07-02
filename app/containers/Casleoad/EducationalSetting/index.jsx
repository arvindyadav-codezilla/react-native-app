import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {downloadDocxFile} from '../../../utils/common';
import {useEducationalSetting} from './useEducationalSettingHook';
import {ROLE} from '../../../utils/constant';
import {
  HeaderText,
  EducationReportSubmitted,
  HomeSchoolingSection,
  PdfViewer,
  NoReportSubmitted,
  DownloadButton,
  AlertMessage,
  ReferralClosedText,
  EducationFormModal,
  DraftContinue,
  EducationalReportList,
} from './EducationComponent';

const EducationalSetting = () => {
  const {
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
  } = useEducationalSetting();
  return (
    <View style={styles.container}>
      <HeaderText />
      {cardData?.status != ROLE.REJECTED && (
        <View style={styles.contentContainer}>
          {!overViewData?.isHomeSchooling &&
            overViewData?.pathway_status?.includes('2') &&
            educationalData?.schoolReport?.length > 0 && (
              <>
                <EducationReportSubmitted />
              </>
            )}
          {overViewData?.isHomeSchooling &&
            overViewData?.pathway_status?.includes('2') &&
            getUserRoles && (
              <>
                <EducationReportSubmitted />
              </>
            )}
          {overViewData?.isHomeSchooling &&
            !documents?.url &&
            !overViewData?.pathway_status?.includes('2') &&
            !getUserRoles &&
            !educationalData?.schoolReport[0]?.isDraft && (
              <NoReportSubmitted
                downloadDocxFile={downloadDocxFile}
                showAlert={showAlert}
                isSubmitted={educationalData?.schoolReport?.length > 0}
                isEnableFormButton={true}
              />
            )}

          {!overViewData?.isHomeSchooling &&
            !overViewData?.pathway_status?.includes('2') &&
            !getUserRoles && (
              <NoReportSubmitted
                downloadDocxFile={downloadDocxFile}
                showAlert={showAlert}
                isSubmitted={educationalData?.schoolReport?.length > 0}
                isEnableFormButton={false}
              />
            )}
          {overViewData?.isHomeSchooling &&
            !overViewData?.pathway_status?.includes('2') &&
            getUserRoles && (
              <NoReportSubmitted
                downloadDocxFile={downloadDocxFile}
                showAlert={showAlert}
                isSubmitted={educationalData?.schoolReport?.length > 0}
                isEnableFormButton={false}
              />
            )}

          {!overViewData?.isHomeSchooling &&
            overViewData?.pathway_status?.includes('2') &&
            !getUserRoles &&
            educationalData?.schoolReport?.length == undefined && (
              <NoReportSubmitted
                downloadDocxFile={downloadDocxFile}
                showAlert={showAlert}
                isSubmitted={overViewData?.pathway_status?.includes('2')}
                isEnableFormButton={false}
              />
            )}

          {overViewData?.isHomeSchooling &&
            educationalData?.schoolReport?.length > 0 && (
              <>
                {educationalData?.schoolReport[0]?.isDraft && !getUserRoles ? (
                  <DraftContinue openModal={openModal} />
                ) : (
                  !getUserRoles && (
                    <EducationalReportList
                      educationalData={educationalData}
                      expanded={expanded}
                      toggleExpand={toggleExpand}
                      loading={loading}
                      EducationalSettingList={EducationalSettingList}
                    />
                  )
                )}
              </>
            )}

          {overViewData?.isHomeSchooling &&
            documents?.uploadType === 'education-report' &&
            documents?.url &&
            educationalData?.schoolReport?.length === 0 && (
              <>
                {!renderPng && documents?.url ? (
                  <PdfViewer documents={documents} pdfLoading={pdfLoading} />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 70,
                    }}>
                    <Image
                      source={{uri: documents?.url}}
                      style={{height: '80%', width: '90%'}}
                    />
                  </View>
                )}
              </>
            )}
        </View>
      )}
      <AlertMessage
        alertVisible={alertVisible}
        handleCloseAlert={handleCloseAlert}
      />
      <ReferralClosedText cardData={cardData} />
      <EducationFormModal modalVisible={modalVisible} closeModal={closeModal} />
      {educationalData?.schoolReport?.length > 0 &&
        overViewData?.isHomeSchooling &&
        !educationalData?.schoolReport[0].isDraft &&
        cardData?.status != '3' &&
        !getUserRoles && (
          <DownloadButton disable={disable} handleCreatePDF={handleCreatePDF} />
        )}
    </View>
  );
};

export default EducationalSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    marginVertical: 10,
    marginBottom: 30,
  },
});
