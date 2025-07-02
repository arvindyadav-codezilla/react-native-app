import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import RadioGroup from '../../molecules/RadioGroup';
import CaseLoadInfoHeader from '../../molecules/CaseLoadInfoHeader';
import CaseLoadStatus from '../../molecules/CaseLoadStatus';
import {useSelector} from 'react-redux';
import {selectPatientData} from '../../../containers/Dashboad/DashboadSlice';
import {
  camelCaseToUpperWords,
  formatDate,
  formatIsoDateToDDMMYYYY,
  separateDataByScope,
} from '../../../utils/common';
import {EducationQuestionSet} from '../../../utils/EducationQuestion';
import {
  EducationFormSubmit,
  EducationFormUpdate,
  schoolReportDetails,
} from '../../../services/educationalSettingServices';
import Loader from '../../atoms/Lodar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {selectCaseloadCardData} from '../../../containers/Casleoad/CaseLoadLayout/slectedCaseloadDetails';
import {selectNetworkError} from '../../../containers/Authentication/Login/networkSlice';
import NetWorkErrorToast from '../NetWorkErrorToast';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
import {useFocusEffect} from '@react-navigation/native';
import _ from 'lodash';

const EducationForm = ({isVisible, onClose}) => {
  const [EducationQuestion, setEducationQuestion] = useState(
    _.cloneDeep(EducationQuestionSet),
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [progress, setProgress] = useState(0);
  const [newMemberCount, setNewMemberCount] = useState(2);
  const [trigger, settrigger] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const {cardData} = useSelector(selectCaseloadCardData);
  let {cardSelected} = useSelector(selectPatientData);
  const overViewData = useSelector(selectOverViewData);
  const [key, setKey] = useState(0);

  const [datePickers, setDatePickers] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const questionRefs = useRef([]);

  useEffect(() => {
    const updatedData = replacePatientName(
      EducationQuestion,
      overViewData?.patient_name,
    );
    setEducationQuestion(updatedData);
  }, []);

  const replacePatientName = (obj, name) => {
    const replaceInString = str => str.replace(/patient_name/g, name);
    const processObject = obj => {
      if (Array.isArray(obj)) {
        return obj.map(item => processObject(item));
      } else if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (key === 'isAdditionalStructure' && typeof value === 'object') {
            acc[key] = {
              ...value,
              question: replaceInString(value.question || ''),
            };
          } else {
            acc[key] =
              typeof value === 'string'
                ? replaceInString(value)
                : processObject(value);
          }
          return acc;
        }, {});
      }
      return obj;
    };

    return processObject(obj);
  };

  const handleCloseModal = () => {
    setAnswers({});
    onClose();
    setKey(prevKey => prevKey + 1);
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true});
    }
  };
  const [sections, setSections] = useState(() => {
    return [
      EducationQuestion?.personalDetail,
      EducationQuestion?.communication,
      EducationQuestion?.socialInteraction,
      EducationQuestion?.creativityImagination,
      EducationQuestion?.behaviour,
      EducationQuestion?.sensory,
      EducationQuestion?.attentionActivityLevels,
      EducationQuestion?.otherRelevantInformation,
    ];
  });
  console.log(
    'EducationQuestion?.socialInteraction',
    EducationQuestion?.socialInteraction,
  );
  useEffect(() => {
    setSections([
      EducationQuestion?.personalDetail,
      EducationQuestion?.communication,
      EducationQuestion?.socialInteraction,
      EducationQuestion?.creativityImagination,
      EducationQuestion?.behaviour,
      EducationQuestion?.sensory,
      EducationQuestion?.attentionActivityLevels,
      EducationQuestion?.otherRelevantInformation,
    ]);
  }, [EducationQuestion]);

  const separatedData = separateDataByScope(overViewData?.caseload_members);
  let parentData = separatedData?.PARENT?.sort((a, b) => {
    if (a.role === '1' && b.role !== '1') {
      return -1;
    }
    if (a.user.scope !== '1' && b.user.scope === '1') {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    if (cardData && parentData.length > 0) {
      const dateOfBirth = formatIsoDateToDDMMYYYY(cardData?.patient_dob);
      const completionDate = formatDate(new Date());

      setEducationQuestion(prevEducationQuestion => {
        const updatedPersonalDetail = prevEducationQuestion.personalDetail.map(
          question => {
            switch (question.question_id) {
              case 'ques1':
                return {
                  ...question,
                  answer: cardData?.patient_name || '',
                };
              case 'ques2':
                return {
                  ...question,
                  answer: dateOfBirth || '',
                };
              case 'ques6':
                return {
                  ...question,
                  answer: parentData[0]?.user?.email || '',
                };
              case 'ques8':
                return {
                  ...question,
                  answer: completionDate || '',
                };
              default:
                return question;
            }
          },
        );

        if (
          JSON.stringify(prevEducationQuestion.personalDetail) !==
          JSON.stringify(updatedPersonalDetail)
        ) {
          return {
            ...prevEducationQuestion,
            personalDetail: updatedPersonalDetail,
          };
        }

        return prevEducationQuestion;
      });
    }
  }, [cardData, parentData]);

  useEffect(() => {
    if (cardData && parentData.length > 0) {
      const completionDate = formatDate(new Date());
      const updatePersonalDetails = () => {
        setEducationQuestion(prevEducationQuestion => {
          const updatedPotherRelevantInformation =
            prevEducationQuestion?.otherRelevantInformation?.map(question => {
              switch (question?.question_id) {
                case 'ques73':
                  return {
                    ...question,
                    answer: completionDate || '',
                  };

                default:
                  return question;
              }
            });

          if (
            JSON.stringify(prevEducationQuestion.otherRelevantInformation) !==
            JSON.stringify(updatedPotherRelevantInformation)
          ) {
            return {
              ...prevEducationQuestion,
              otherRelevantInformation: updatedPotherRelevantInformation,
            };
          }

          return prevEducationQuestion;
        });
      };

      updatePersonalDetails();
    }
  }, [cardData, parentData]);
  useEffect(() => {
    const date = new Date(overViewData?.patient_dob);
    const dateOf_brith = date;
    let completionDate = new Date();

    const nameSplit = cardData?.patient_name.split(' ');
    if (cardData) {
      setAnswers({
        ques1: {
          1: cardData?.patient_name || '',
        },

        ques2: {
          2: dateOf_brith || '',
        },
        ques6: {
          6: parentData[0]?.user?.email || '',
        },
        ques8: {
          8: completionDate?.toDateString() || '',
        },
      });
    }
  }, [cardData, overViewData]);

  useEffect(() => {
    setEducationQuestion(prevState => ({
      ...prevState,
      personalDetail: prevState?.personalDetail?.map(question => ({
        ...question,
        answer: '',
      })),
      communication: prevState?.communication?.map(question => ({
        ...question,
        answer: '',
      })),
      socialInteraction: prevState?.socialInteraction?.map(question => ({
        ...question,
        answer: '',
      })),
      creativityImagination: prevState?.creativityImagination?.map(
        question => ({
          ...question,
          answer: '',
        }),
      ),
      behaviour: prevState?.behaviour?.map(question => ({
        ...question,
        answer: '',
      })),
      sensory: prevState?.sensory?.map(question => ({
        ...question,
        answer: '',
      })),
      attentionActivityLevels: prevState?.attentionActivityLevels?.map(
        question => ({
          ...question,
          answer: '',
        }),
      ),
      otherRelevantInformation: prevState?.otherRelevantInformation?.map(
        question => ({
          ...question,
          answer: '',
        }),
      ),
    }));
  }, []);

  useFocusEffect(
    useCallback(() => {
      EducationalSettingList();
      return () => {};
    }, [isVisible]),
  );

  const EducationalSettingList = async () => {
    try {
      const response = await schoolReportDetails(cardSelected);
      let EducationalData = response.data.data;
      if (response.data.status === 200) {
        if (EducationalData?.schoolReport[0]?.isDraft) {
          setEducationQuestion(EducationalData?.schoolReport[0].data);
          setCurrentSectionIndex(
            EducationalData?.schoolReport[0]?.actual_count,
          );
        }
        setData(EducationalData?.schoolReport);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchedQuestions = EducationQuestion;

    const initialStatus = {};

    Object.keys(fetchedQuestions).forEach(section => {
      fetchedQuestions[section].forEach(question => {
        if (question.type === 'radio' && question.answer === 'Yes') {
          initialStatus[question.question_id] = 'Yes';
        }
      });
    });

    setQuestionStatus(initialStatus);
  }, [EducationQuestion]);

  const totalSections = sections.length;

  const handleSaveAsDraft = async type => {
    if (type === 'Edit') {
      Alert.alert(
        'Save as Draft',
        'Do you want to save as a draft?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              await saveDraft(type);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      await saveDraft(type);
    }
  };

  const saveDraft = async type => {
    setLoading(true);
    let result;
    try {
      const payload = {
        data: EducationQuestion,
        caseload_id: cardData?.id,
        total_count: totalSections - 1,
        actual_count: currentSectionIndex,
        isFinalSubmit: type === 'Save' ? true : false,
      };
      const updatePayload = {
        data: EducationQuestion,
        total_count: totalSections - 1,
        actual_count: currentSectionIndex,
        isFinalSubmit: type === 'Save' ? true : false,
      };

      if (data?.length === 0) {
        result = await EducationFormSubmit(payload);
      } else {
        result = await EducationFormUpdate(updatePayload, data[0]?.id);
      }
      onClose();
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handleRadioChange = (
    value,
    questionId,
    fieldId,
    field,
    questionField,
  ) => {
    setQuestionStatus(prevStatus => {
      const updatedStatus = {...prevStatus};
      const specialCases = {
        ques58: ['C-Section', 'Ventouse/ Forceps'],
        ques59: [
          'Resuscitation needed',
          'Admitted to special care',
          'Feeding difficulties',
        ],
      };

      updatedStatus[`${questionId}_${fieldId}`] = value === 'Yes';
      const anyYes = Object.keys(updatedStatus).some(key => {
        const [qid, fid] = key.split('_');
        return qid === questionId && updatedStatus[key];
      });

      updatedStatus[questionId] = anyYes;

      if (!anyYes) {
        updatedStatus[questionId] = false;
      } else if (['No', 'Not Sure', 'None'].includes(value)) {
        const allNo = Object.keys(updatedStatus)
          .filter(key => key.startsWith(questionId + '_'))
          .every(key => !updatedStatus[key]);
        updatedStatus[questionId] = !allNo;

        clearError(questionId);
        if (field.isAdditional) {
          if (answers[questionId][field.isAdditionalStructure.question_id]) {
            delete answers[questionId][field.isAdditionalStructure.question_id];
            field.isAdditionalStructure.answer = '';
          }
          setAnswers(prevAnswers => {
            const updatedAnswers = {...prevAnswers};

            if (updatedAnswers[questionId]) {
              delete updatedAnswers[questionId][fieldId];
              if (Object.keys(updatedAnswers[questionId]).length === 0) {
                delete updatedAnswers[questionId];
              }
            }

            return {
              ...updatedAnswers,
              [`${questionId}_${fieldId}`]: {
                [fieldId]: value,
              },
            };
          });
        }

        if (value === 'No' && field.isAdditional) {
          const additionalKey = `${field?.isAdditionalStructure?.parent_id}_${field?.isAdditionalStructure?.question_number}`;
          setAnswers(prevAnswers => {
            const updatedAnswers = {...prevAnswers};
            if (updatedAnswers[additionalKey]) {
              delete updatedAnswers[additionalKey];
              if (Object.keys(updatedAnswers).length === 0) {
                delete updatedAnswers[questionId];
              }
            }
            return updatedAnswers;
          });
        }
      }

      const isSpecialCase =
        specialCases[questionId] && specialCases[questionId].includes(value);

      if (isSpecialCase) {
        updatedStatus[questionId] = true;
      }

      return updatedStatus;
    });

    clearError(`${questionId}`);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [`${questionId}`]: {
        ...prevAnswers[`${questionId}`],
        [fieldId]: value,
      },
    }));
    field['answer'] = value;
  };

  const handleNextSection = () => {
    scrollToTop();
    const currentSection = sections[currentSectionIndex];
    const newErrors = {};

    currentSection?.forEach(field => {
      if (field?.isAdditional && field?.isRequired) {
        const key = `${field.question_id}`;
        if (!answers[key]) {
          if (!field?.answer) {
            newErrors[key] = `${
              !field.name ? 'This field' : field.name
            } is required`;
          }
        }
      } else {
        const key = `${field?.question_id}`;
        if (!field?.answer) {
          newErrors[key] = `${
            !field?.name ? 'This field' : field?.name
          } is required`;
        }
      }
    });

    setErrors(newErrors);
    const firstErrorIndex = currentSection.findIndex(
      field => newErrors[`${field?.question_id}`],
    );

    if (firstErrorIndex !== -1 && questionRefs.current[firstErrorIndex]) {
      questionRefs.current[firstErrorIndex].measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({y: y - 20, animated: true});
        },
      );
    }
    if (Object.keys(newErrors).length === 0) {
      if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      } else {
        const newProgress = (currentSectionIndex + 1) / totalSections;
        setProgress(newProgress);
        Alert.alert(
          'MyCareBridge',
          'Thank you for submitting this information. Once we have both your report and your child’s / young person’s education setting report (if your child is in school, nursery, college, or another education setting), your information will be sent to our clinical team for review. It may take up to six weeks from completion of your report to hear the outcome of this review, and you will receive an email when there are any updates for you to view on the portal. While you are waiting, you can check the Resources section of the portal at any time in order to see what support you can access for you and your child.',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                handleSaveAsDraft('Save');
              },
            },
          ],
        );
      }
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex == 0) {
    } else {
      scrollToTop();
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
    const newProgress = (currentSectionIndex + 1) / totalSections;
    setProgress(newProgress);
  };

  const handleTextChange = (text, questionId, fieldId, field) => {
    clearError(questionId);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [fieldId]: text,
      },
    }));
    if (field.isAdditional) {
      field.isAdditionalStructure['answer'] = text;
    } else {
      field['answer'] = text;
    }
  };

  const handleSingleOptionChange = (option, questionId, fieldId, field) => {
    clearError(questionId);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [fieldId]: option,
      },
    }));
    field['answer'] = option;
  };

  const clearError = fieldKey => {
    setErrors(prevErrors => {
      const newErrors = {...prevErrors};
      if (fieldKey in newErrors) {
        delete newErrors[fieldKey];
        return newErrors;
      }
      return prevErrors;
    });
  };
  const handleDateChange = (date, questionId, fieldId, field) => {
    clearError(questionId);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [fieldId]: date,
      },
    }));
    field['answer'] = date;
  };
  const handleDateConfirm = (questionId, dates, field) => {
    const readOnlyFields = ['ques8', 'ques73'];
    const isEditable = !readOnlyFields.includes(questionId);
    // if(isEditable){
    //   return;
    // }
    setDatePickers(prevState => ({
      ...prevState,
      [questionId]: {
        ...prevState[questionId],
        dateOpen: false,
        selectedDate: dates,
      },
    }));
    handleDateChange(dates, questionId, field.question_number, field);
  };

  const openDatePicker = questionId => {
    setDatePickers(prevState => ({
      ...prevState,
      [questionId]: {
        ...prevState[questionId],
        dateOpen: true,
      },
    }));
  };

  const closeDatePicker = questionId => {
    setDatePickers(prevState => ({
      ...prevState,
      [questionId]: {
        ...prevState[questionId],
        dateOpen: false,
      },
    }));
  };

  const renderInputField = (field, questionId) => {
    const readOnlyFields = ['ques1', 'ques2', 'ques6', 'ques8', 'ques73'];
    const isEditable = !readOnlyFields.includes(questionId);
    const datePickerState = datePickers[questionId] || {
      dateOpen: false,
      selectedDate: null,
    };

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <View key={field.question_id}>
            <TextInput
              editable={
                isEditable &&
                !(
                  (field?.question_number === 1 && !field?.answer) ||
                  (field?.question_number === 2 && !field?.answer)
                )
              }
              multiline={field.type === 'textArea'}
              placeholderTextColor={isEditable ? '#667085' : '#667085'}
              numberOfLines={field.type === 'textArea' ? 4 : 1}
              placeholder={
                !field.placeholder
                  ? 'Please Enter'
                  : field?.placeholder?.replace(
                      'patient_name',
                      cardData?.patient_name,
                    )
              }
              onChangeText={text => {
                handleTextChange(
                  text,
                  field.question_id,
                  field.question_number,
                  field,
                );
              }}
              value={
                answers[field.question_id]?.[field.question_number] ||
                field?.answer
              }
              keyboardType={
                field.type === 'number'
                  ? 'numeric'
                  : field.type === 'email'
                  ? 'email-address'
                  : 'default'
              }
              style={[
                styles.inputField,
                {color: !isEditable ? '#667085' : 'black'},
              ]}
            />
            {!!errors[field.questionId] && (
              <Text style={{color: 'red'}}>{errors[field.questionId]}</Text>
            )}

            {field.isNested &&
              field.isNestedStructure.map((nestedFields, index) => {
                const selectedValue =
                  answers[field.question_id]?.[nestedFields.question_number];
                return (
                  <>
                    <Text
                      style={
                        styles.question
                      }>{`${nestedFields.question}`}</Text>
                    {nestedFields.isRequired && (
                      <RadioGroup
                        defaultValue={
                          answers[field?.question_id]?.[
                            nestedFields?.question_number
                          ] || nestedFields.answer
                        }
                        options={nestedFields.option}
                        onPress={value => {
                          handleRadioChange(
                            value,
                            field.question_id,
                            nestedFields.question_number,
                            nestedFields,
                          );
                        }}
                      />
                    )}
                    {(selectedValue === 'Below Average' ||
                      selectedValue === 'Above Average') && (
                      <RadioGroup
                        defaultValue={
                          answers[field.question_id]?.[
                            nestedFields.question_number + 1
                          ] || nestedFields?.answer
                        }
                        options={['2%', '10%', '25%']}
                        onPress={value => {
                          handleRadioChange(
                            value,
                            field.question_id,
                            nestedFields.question_number + 1,
                            field.isNestedStructure[1],
                          );
                        }}
                      />
                    )}
                  </>
                );
              })}
          </View>
        );
      case 'date':
        const dateValue =
          field?.question_id === 'ques73'
            ? new Date()
            : answers[field.question_id]?.[field.question_number];
        let displayDate;

        if (dateValue) {
          const parsedDate =
            field?.question_id === 'ques73' ? dateValue : new Date(dateValue);
          if (field?.question_id === 'ques73') {
            displayDate = formatIsoDateToDDMMYYYY(parsedDate);
          } else {
            displayDate = isNaN(parsedDate.getTime())
              ? 'Invalid Date'
              : parsedDate.toLocaleDateString('en-GB');
          }
        } else {
          displayDate = field?.question;
        }

        return (
          <>
            {datePickerState.dateOpen && (
              <DatePicker
                modal
                mode="date"
                date={
                  datePickerState.selectedDate || new Date() || field?.answer
                }
                open={datePickerState.dateOpen}
                onConfirm={dates => {
                  handleDateConfirm(questionId, dates, field);
                }}
                onCancel={() => {
                  closeDatePicker(questionId);
                }}
                style={{width: 200, marginTop: 10}}
              />
            )}
            <TouchableOpacity
              disabled={
                !isEditable &&
                !(
                  (field?.question_number === 73 && !field?.answer) ||
                  (field?.question_number === 2 && !field?.answer) ||
                  (field?.question_number === 8 && !field?.answer)
                )
              }
              onPress={() => openDatePicker(questionId)}>
              <Text
                style={[
                  styles.inputField,
                  {
                    textAlignVertical: 'center',
                    color: !isEditable ? 'grey' : 'black',
                  },
                ]}>
                {displayDate ||
                  formatIsoDateToDDMMYYYY(
                    datePickerState.selectedDate.toISOString().split('T')[0],
                  )}
              </Text>
            </TouchableOpacity>
            {!!errors[questionId] && (
              <Text style={{color: 'red'}}>{errors[questionId]}</Text>
            )}
          </>
        );

      case 'radio':
        if (field?.option && field?.option?.length > 0) {
          return (
            <View key={questionId}>
              <>
                <Text style={styles.leabel}>{field.name}</Text>
                <RadioGroup
                  defaultValue={
                    answers[field?.question_id]?.[field?.question_number] ||
                    field?.answer
                  }
                  options={field.option}
                  onPress={value => {
                    handleRadioChange(
                      value,
                      field.question_id,
                      field.question_number,
                      field,
                    );
                  }}
                />
              </>

              {questionStatus[field?.question_id] &&
                field?.isAdditionalStructure &&
                field?.isAdditionalStructure?.type === 'textArea' && (
                  <>
                    <View style={{paddingVertical: 10}}>
                      <Text style={styles.leabel}>{field?.question}</Text>
                    </View>
                    <TextInput
                      placeholder={'Please Enter'}
                      placeholderTextColor={'#667085'}
                      value={
                        answers[field?.isAdditionalStructure?.parent_id]?.[
                          field?.isAdditionalStructure?.question_id
                        ] || field?.isAdditionalStructure?.answer
                      }
                      onChangeText={text => {
                        handleTextChange(
                          text,
                          field?.isAdditionalStructure?.parent_id,
                          field?.isAdditionalStructure?.question_id,
                          field,
                        );
                      }}
                      keyboardType={
                        field?.isAdditionalStructure.type === 'number'
                          ? 'numeric'
                          : field.isAdditionalStructure.type === 'email'
                          ? 'email-address'
                          : 'default'
                      }
                      style={styles.textArea}
                    />
                  </>
                )}
            </View>
          );
        } else {
          return null;
        }
      case 'textArea':
        return (
          <View key={questionId}>
            <TextInput
              editable={isEditable}
              multiline={field.type === 'textArea'}
              numberOfLines={field.type === 'textArea' ? 4 : 1}
              placeholder={
                !field.placeholder
                  ? 'Please 500 Characters'
                  : field?.placeholder?.replace(
                      'patient_name',
                      cardData?.patient_name,
                    )
              }
              onChangeText={text => {
                handleTextChange(
                  text,
                  questionId,
                  field.question_number,
                  field,
                );
              }}
              value={
                answers[field.question_id]?.[field.question_number] ||
                field?.answer
              }
              style={styles.textArea}
              placeholderTextColor={'#667085'}
            />
          </View>
        );

      default:
        return null;
    }
  };
  const renderQuestionsSection = () => {
    const currentSection = sections[currentSectionIndex];
    return currentSection?.map((field, index) => {
      return (
        <View
          key={field.question_id}
          style={{marginVertical: 10}}
          ref={el => (questionRefs.current[index] = el)}>
          <>
            <View style={{flexDirection: 'row', maxWidth: '90%'}} key={index}>
              <Text style={styles.question}>
                {`${field.question_number}. `}
              </Text>
              <Text style={styles.question}>
                {`${field.question.replace(
                  'patient_name',
                  cardData?.patient_name,
                )}`}
                <Text style={{color: 'red'}}>{`*`}</Text>
              </Text>
            </View>
            {renderInputField(field, field.question_id)}
            {!!errors[field.question_id] && (
              <Text style={{color: 'red'}}>{errors[field.question_id]}</Text>
            )}
          </>
        </View>
      );
    });
  };

  const currentSection = sections[currentSectionIndex];
  const currentSectionTitle = camelCaseToUpperWords(
    Object.keys(EducationQuestion).find(
      key => EducationQuestion[key] === currentSection,
    ) ?? '',
  );
  const firstQuestionNumber = currentSection[0]?.question_number;
  const lastQuestionNumber =
    currentSection[currentSection.length - 1]?.question_number;
  const questionRange = `${firstQuestionNumber}-${lastQuestionNumber}`;
  useEffect(() => {
    const newProgress = (currentSectionIndex + 1) / totalSections;
    setProgress(newProgress);
  }, [currentSectionIndex]);
  const isNetworkError = useSelector(selectNetworkError);

  const onModalClose = () => {
    resetAnswers();
    setAnswers({});
    setErrors({});
    onClose();
  };

  const resetAnswers = () => {
    const resetSections = _.cloneDeep(sections).map(section => {
      return section.map(field => {
        if (field?.isNestedStructure?.length > 0) {
          const resetNesting = field?.isNestedStructure?.map(nestedField => ({
            ...nestedField,
            answer: '',
          }));

          return {
            ...field,
            nestingObj: {
              ...field.isNestedStructure,
              onetype: resetNesting,
            },
          };
        }
        return {
          ...field,
          answer: '',
        };
      });
    });

    setSections(resetSections);
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => {
          onModalClose();
        }}
        animationIn="slideInUp"
        onRequestClose={() => {
          onModalClose();
        }}
        animationOut="slideOutDown"
        style={{}}>
        <SafeAreaView style={styles.conatiner}>
          <View style={styles.conatiner}>
            <CaseLoadInfoHeader
              iconFirstPress={() => {
                setAnswers({});
                onModalClose();
              }}
              iconFirst={'chevron-left'}
              name={'Education Details'}
              iconSize={34}
              iconColor={'black'}
            />
            <CaseLoadStatus
              caseloadTitle={currentSectionTitle}
              questionrange={questionRange}
              progress={progress}
            />

            <ScrollView
              automaticallyAdjustKeyboardInsets
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              style={{
                backgroundColor: 'white',
                marginHorizontal: 15,
              }}>
              <View style={{paddingBottom: '20%'}}>
                {renderQuestionsSection()}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      currentSectionIndex == 0 ? 'white' : 'white',
                    borderColor:
                      currentSectionIndex == 0 ? 'black' : 'rgb(74, 24, 91)',
                  },
                  {width: currentSectionIndex === 0 ? '30%' : '30%'},
                ]}
                onPress={() => {
                  handleSaveAsDraft('Edit');
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: currentSectionIndex == 0 ? 'black' : 'black'},
                    {fontSize: 12},
                  ]}>
                  Save as Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      currentSectionIndex == 0 ? 'white' : 'white',
                    borderColor:
                      currentSectionIndex == 0 ? 'black' : 'rgb(74, 24, 91)',
                  },
                  {width: currentSectionIndex === 0 ? '30%' : '30%'},
                ]}
                onPress={handlePrevSection}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: currentSectionIndex == 0 ? 'black' : 'black'},
                    {fontSize: 12},
                  ]}>
                  {currentSectionIndex === totalSections - 1
                    ? 'Previous'
                    : 'Previous'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {width: currentSectionIndex === 0 ? '30%' : '30%'},
                ]}
                onPress={handleNextSection}>
                <Text style={[styles.buttonText, {fontSize: 12}]}>
                  {currentSectionIndex === totalSections - 1
                    ? 'Submit'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {loading && <Loader />}
        {isNetworkError?.isNetworkError && <NetWorkErrorToast />}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  leabel: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  inputField: {
    height: 40,
    color: 'black',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 150,
    borderColor: '#E4E7EC',
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 10,
    padding: 10,
    color: 'black',
    borderRadius: 5,
  },
  question: {
    color: '#101828',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    paddingBottom: 7,
    // textAlign:'left'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: 'rgb(74, 24, 91)',
    alignSelf: 'center',
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 0.5,
  },
  buttonText: {
    color: 'white',
    padding: 10,
  },
});

export default EducationForm;
