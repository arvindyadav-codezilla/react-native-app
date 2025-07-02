import {View, Text} from 'react-native';
import React from 'react';
import ActivityIndicators from '../../../components/atoms/ActivityIndicators';
import ParentForm from '../../../components/organisms/ParentForm';
import MyCareBridgeAlert from '../../../components/molecules/MyCareBridgeAlert';
import {downloadDocxFile} from '../../../utils/common';
import {
  DraftState,
  EmptyState,
  ParentHeader,
  ReferalRejected,
  ReportList,
  SubmitButton,
} from './ParentComponent';
import {useParentCarrierReport} from './useParentCarrierReportHook';

const ParentCarrierReport = () => {
  const {
    parentData,
    loading,
    disable,
    modalVisible,
    alertVisible,
    containsData,
    expanded,
    handleCloseAlert,
    handleCreatePDF,
    openModal,
    closeModal,
    toggleExpand,
    cardData,
    getUserRoles,
    showAlert,
    ParentDetailsList,
  } = useParentCarrierReport();

  return (
    <View style={{flex: 1}}>
      <ParentHeader />
      <>
        <View style={{flex: 1}}>
          {cardData?.status != '3' && (
            <>
              {!getUserRoles ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                    }}>
                    <View style={{flex: 1}}>
                      {containsData ? (
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              marginVertical: 10,
                              marginBottom: 80,
                              flex: 1,
                            }}>
                            {parentData?.parentReport[0]?.isDraft ? (
                              <DraftState
                                openModal={openModal}
                                downloadDocxFile={downloadDocxFile}
                              />
                            ) : (
                              <ReportList
                                data={parentData?.parentReport?.filter(
                                  item => !item.isDraft,
                                )}
                                loading={loading}
                                ParentDetailsList={ParentDetailsList}
                                expanded={expanded}
                                toggleExpand={toggleExpand}
                              />
                            )}
                          </View>
                        </View>
                      ) : (
                        <>
                          <EmptyState
                            downloadDocxFile={downloadDocxFile}
                            showAlert={showAlert}
                            isReport={false}
                          />
                        </>
                      )}
                    </View>
                    <ActivityIndicators
                      size="large"
                      color="#6A2382"
                      visible={loading}
                      style={{backgroundColor: 'white'}}
                    />
                  </View>
                  {containsData && !parentData?.parentReport[0].isDraft && (
                    <SubmitButton
                      disable={disable}
                      handleCreatePDF={handleCreatePDF}
                      loading={loading}
                    />
                  )}

                  {alertVisible && (
                    <MyCareBridgeAlert
                      visible={alertVisible}
                      headerText="Important Notice !"
                      onClose={handleCloseAlert}>
                      <View style={{padding: 7}}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            paddingBottom: 5,
                          }}>
                          Before you begin filling out this form, please be
                          aware of the following:
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            paddingBottom: 7,
                          }}>
                          1. Time Required: The form will take approximately
                          40-50 minutes to complete.
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            paddingBottom: 7,
                          }}>
                          2.Save function: You are able to save your information
                          as you go by pressing the 'save' button at the bottom
                          of the form. Using the save function means that you
                          can exit this form and return to continue it later on
                          if you need more time or to gather more information.
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'black',
                            paddingBottom: 7,
                          }}>
                          To avoid any inconvenience, we recommend having all
                          necessary information and documents ready before you
                          start.
                          <Text>
                            Thank you for your understanding and cooperation.
                          </Text>
                        </Text>
                      </View>
                    </MyCareBridgeAlert>
                  )}
                </>
              ) : (
                <>
                  <EmptyState
                    downloadDocxFile={downloadDocxFile}
                    showAlert={showAlert}
                    isReport={parentData?.parentReport?.length > 0}
                    userRole={getUserRoles}
                  />
                </>
              )}
            </>
          )}
          {cardData?.status === '3' && <ReferalRejected />}
        </View>
        {modalVisible && (
          <ParentForm isVisible={modalVisible} onClose={closeModal} />
        )}
      </>
    </View>
  );
};

export default ParentCarrierReport;
