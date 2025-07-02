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
  formatIsoDateToDDMMYYYY,
  separateDataByScope,
} from '../../../utils/common';
import {
  ParentFormSubmit,
  ParentFormUpdate,
} from '../../../services/ParentFormServices';
import {selectOverViewData} from '../../../containers/Casleoad/Overview/OverViewSlice';
import Loader from '../../atoms/Lodar';
import {selectCaseloadCardData} from '../../../containers/Casleoad/CaseLoadLayout/slectedCaseloadDetails';
import {parentQuestion} from '../../../utils/question';
import {patientReportDetails} from '../../../services/patientReportDetailsServices';
import {SCOPE} from '../../../utils/constant';
import {selectNetworkError} from '../../../containers/Authentication/Login/networkSlice';
import {storageRead} from '../../../utils/storageUtils';
import {useFocusEffect} from '@react-navigation/native';

const ParentForm = ({isVisible, onClose}) => {
  const [question, setQuestion] = useState({
    personalDetails: [
      {
        question_id: 'ques1',
        question_number: 1,
        question: '[forename] Overview',
        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 1,
              answer: '',
              id: 1,
              name: 'Name',
              type: 'text',
              placeholder: 'Enter Name',
              disabled: true,
              fullWidth: true,
              col: 6,
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Date of Birth',
              type: 'date',
              placeholder: 'Enter DOB',
              disabled: true,
              fullWidth: true,
              col: 6,
            },
            {
              cid: 1,
              answer: '',
              id: 3,
              name: 'Address',
              type: 'text',
              placeholder: 'Enter Address',
              disabled: true,
              fullWidth: true,
              col: 6,
            },
            {
              cid: 1,
              answer: '',
              id: 4,
              name: 'NHS Number',
              type: 'text',
              placeholder: 'Enter NHS Number',
              disabled: true,
              fullWidth: true,
              col: 6,
            },
            {
              cid: 1,
              answer: '',
              id: 5,
              name: 'GP Details',
              type: 'textArea',
              placeholder: 'Enter GP Details',
              multiline: true,
              fullWidth: true,
              disabled: true,
              col: 12,
              rows: 4,
            },
            {
              cid: 1,
              answer: '',
              id: 6,
              name: 'Sex',
              type: 'radio',
              placeholder: '',
              disabled: true,
              options: [
                {id: 1, name: 'Male'},
                {id: 2, name: 'Female'},
                {id: 3, name: 'Other'},
              ],
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques2',
        question_number: 2,
        question: 'Other Overview',
        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 2,
              answer: '',
              id: 1,
              name: 'Name',
              type: 'text',
              disabled: true,
              placeholder: 'Enter Name',
              fullWidth: true,
              col: 6,
            },
            {
              cid: 2,
              answer: '',
              id: 2,
              name: 'Contact Number',
              type: 'number',
              disabled: true,
              placeholder: 'Enter Contact Number',
              fullWidth: true,
              col: 6,
            },
            {
              cid: 2,
              answer: '',
              id: 3,
              name: 'Email Address',
              type: 'email',
              disabled: true,
              placeholder: 'Enter Email',
              fullWidth: true,
              col: 6,
            },
            {
              cid: 2,
              answer: '',
              id: 4,
              name: 'Address',
              type: 'text',
              disabled: true,
              placeholder: 'Enter Address',
              fullWidth: true,
              col: 6,
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques3',
        question_number: 3,
        question:
          'Is [forename] gender the same as the sex they were registered at birth?',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Yes', 'No'],
        isRequired: true,
      },
      {
        question_id: 'ques4',
        question_number: 4,
        question:
          'How does [forename] like to be addressed and what pronouns are preferred?',
        answer: '',
        type: 'text',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques5',
        question_number: 5,
        question: 'Please summarise your main concerns',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques6',
        question_number: 6,
        question:
          'Are there concerns at home/ at school or in both situations?',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques7',
        question_number: 7,
        question: 'How old was [forename] when you became concerned?',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: ' ',
        isRequired: true,
      },
      {
        question_id: 'ques8',
        question_number: 8,
        question:
          'In what way do you hope this assessment will help [forename]?',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: ' ',
        isRequired: true,
      },
      {
        question_id: 'ques9',
        question_number: 9,
        question:
          'Is there a previous diagnosis we should be aware of? (including ones done privately)',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: ' ',
        isRequired: true,
      },
    ],

    familyHistory: [
      {
        question_id: 'ques10',
        question_number: 10,
        question: 'Who is in [forename] ’s close family?',
        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 1,
              answer: '',
              id: 1,
              name: 'Name',
              type: 'text',
              placeholder: 'Enter Name',
              fullWidth: true,
              col: 3,
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Age',
              type: 'number',
              placeholder: 'Age',
              fullWidth: true,
              col: 1,
            },
            {
              cid: 1,
              answer: '',
              id: 3,
              name: 'Relationship',
              type: 'text',
              placeholder: 'Relationship to young person',
              fullWidth: true,
              col: 3,
            },
            {
              cid: 1,
              answer: '',
              id: 4,
              name: 'Gender',
              type: 'radio',
              placeholder: '',
              options: [
                {id: 1, name: 'Male'},
                {id: 2, name: 'Female'},
                {id: 3, name: 'Other'},
              ],
              col: 4,
            },
            {
              cid: 1,
              answer: '',
              id: 5,
              name: 'X',
              type: 'button',
              col: 1,
              jsonStyle: 'onlybutton',
            },
          ],
          Action: [
            {
              cid: 1,
              answer: '',
              id: 6,
              name: 'Add Family Member',
              type: 'button',
              fullWidth: true,
              col: 12,
              jsonStyle: 'onlybutton',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques11',
        question_number: 11,
        question:
          'Does any family member have any of the following conditions?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: 'Neurological Disease',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 2,
              jsonStyle: 'radioInline',
              name: 'Learning difficulties',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 3,
              jsonStyle: 'radioInline',
              name: 'ADHD',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 4,
              jsonStyle: 'radioInline',
              name: 'Autistic Spectrum Disorder',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 5,
              jsonStyle: 'radioInline',
              name: 'Mental Health disorder/ concerns',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 6,
              jsonStyle: 'radioInline',
              name: 'Other significant health issue',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 7,
              name: 'More Details',
              type: 'textArea',
              placeholder: 'More Details',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques12',
        question_number: 12,
        question: 'Developmental milestones',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    communication: [
      {
        question_id: 'ques13',
        question_number: 13,
        question:
          'Please describe any speech and language difficulty [forename] is experiencing now or has had in the past',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques14',
        question_number: 14,
        question:
          // `Please describe [forename]’s communication. Comment on who, how and why they communicate – for example: to express needs, to give information, to share experiences, to have a to and fro conversation.
          // If [forename] is non-speaking, please state what methods they do use.?`,
          `Please describe [forename]’s communication. Comment on who they can communicate with, how and why they communicate – for example: to express needs, to give information, to share experiences, to have a two-way conversation. If [forename] is non-speaking, please state what methods they do use.?`,
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques15',
        question_number: 15,
        question:
          'Please describe how [forename] responds to instructions and if you have any concerns around their listening.',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques16',
        question_number: 16,
        question:
          'Please describe how [forename] uses non-verbal communication. For example – gestures, eye contact, facial expressions, tone of voice.',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    socialInteraction: [
      {
        question_id: 'ques17',
        question_number: 17,
        question:
          'How does [forename] get on with other members of the family? (e.g. sharing interests, understanding feelings of others)',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques18',
        question_number: 18,
        question:
          'How does [forename] get on with other children/young people? (e.g. making and keeping friends, showing concerns for others and their feelings)',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    playImagination: [
      {
        question_id: 'ques19',
        question_number: 19,
        question:
          'What does [forename] like to play with or how do they spend their time?',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques20',
        question_number: 20,
        question: 'Does [forename]',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: 'Play with toys in the way they are intended',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 2,
              jsonStyle: 'radioInline',
              name: 'Use pretend and imaginary play (e.g. playing a role like a teacher, feeding a baby or a parent cooking etc)',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 3,
              name: 'More Details',
              type: 'textArea',
              placeholder: 'More Details',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques21',
        question_number: 21,
        question: 'Has [forename] got any focused interests',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'More Details',
              type: 'textArea',
              placeholder:
                'Please give details of any focussed interests that [forename] may have: ',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques22',
        question_number: 22,
        question:
          'Please outline any routines that [forename] shows a strong preference for or has to follow: ',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },

      {
        question_id: 'ques23',
        question_number: 23,
        question: 'Does [forename]',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: 'Engage in repetitive behaviours or rituals (doing the same thing in a certain way?)',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 17,
              answer: '',
              id: 2,
              jsonStyle: 'radioInline',
              name: 'Cope with minor changes in routine?',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 3,
              name: 'Please describe:',
              type: 'textArea',
              placeholder: 'Please describe:',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
    ],

    sensory: [
      {
        question_id: 'ques24',
        question_number: 24,
        question:
          'Have you got concerns about how [forename] responds to noise?',
        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please describe how [forename] responds to noise (E.g. covers ears; slow to respond when you speak to them; gets easily distracted; gets distressed, makes loud noises or hums) ',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques25',
        question_number: 25,
        question:
          'Have you got concerns about how [forename] responds to touch?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please describe how [forename] responds to touch (E.g. dislikes messy play; has difficulty touching or wearing certain materials; reacts in unexpected ways when someone touches them) ',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques26',
        question_number: 26,
        question:
          'Have you got concerns about how [forename] responds to movement? ',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please describe how [forename] responds to movement (E.g. flaps hands and enjoys it; dislikes swings and slides; difficulty climbing steps; often fidgets or bounces, walks on tiptoes) ',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques27',
        question_number: 27,
        question:
          'Have you got concerns about how [forename] responds to taste or smell? ',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please describe how [forename] responds to taste and smell (E.g. avoids certain tastes, textures or smells; eats a small range of food; prefers food with bold textures and flavours) ',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques28',
        question_number: 28,
        question:
          'Have you got concerns about how [forename] responds to light?  ',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please describe how [forename] responds to light (E.g. enjoys looking at things move, enjoys moving or flickering light, avoids or is distressed by bright lights)',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques29',
        question_number: 29,
        question:
          'Is [forename] able to recognise and label feelings in their body? ',
        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'Please 500 Characters',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques30',
        question_number: 30,
        question:
          'Please describe any other sensory seeking behaviours that [forename] enjoys:',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques31', //question add after some time
        question_number: 31,
        question:
          'Please describe any other sensory avoiding behaviours [forename] shows',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    motorMannerisms: [
      {
        question_id: 'ques32',
        question_number: 32,
        question: `Please outline any repetitive/unusual body movements that [forename] engages in (e.g walks on their tiptoes or in an unusual way; likes to spin around more than other children; flaps their hands; bounces on their feet when excited; staring blankly at objects, collecting unusual items; attachment to objects)? `,
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    attentionActivity: [
      {
        question_id: 'ques33',
        question_number: 33,
        question:
          'Blurts out answers without waiting for questions to be finished',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques34',
        question_number: 34,
        question: 'Is overbearing and loud while playing with peers',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques35',
        question_number: 35,
        question: 'Takes actions without thinking of the consequences',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques36',
        question_number: 36,
        question: 'Acts then instantly says they didn’t mean to',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques37',
        question_number: 37,
        question: 'Difficulty staying on task in the class or in play',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques38',
        question_number: 38,
        question: 'Disturbs others when playing or working',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques39',
        question_number: 39,
        question: 'Has ‘careless mistakes’ or inaccuracies in work',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques40',
        question_number: 40,
        question: 'Gets out of their seat when not expected',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques41',
        question_number: 41,
        question: 'Climbs and jumps when being still is expected',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques42',
        question_number: 42,
        question: 'Fidgets and squirms',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques43',
        question_number: 43,
        question: 'Is always ‘on the go’',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques44',
        question_number: 44,
        question: 'Difficulty listening to teaching part of lesson/assembly',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques45',
        question_number: 45,
        question: 'Avoids or dislikes activities which require mental effort',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques46',
        question_number: 46,
        question: 'Doesn’t finish tasks',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques47',
        question_number: 47,
        question:
          'Finds it difficult to start tasks (even ones they could easily do)',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques48',
        question_number: 48,
        question: 'Is forgetful during tasks',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques49',
        question_number: 49,
        question: 'Often loses items',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques50',
        question_number: 50,
        question: 'Can not get organised with equipment needed',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Never', 'Sometimes', 'Always', 'N/A'],
        isRequired: true,
      },
      {
        question_id: 'ques51',
        question_number: 51,
        question:
          'Any comments you would like to add with respect to the attention and activity levels above?',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],

    birthDetails: [
      {
        question_id: 'ques52',
        question_number: 52,
        question:
          'Were there any concerns about mum’s health during the pregnancy?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
                {id: 2, name: 'Not Sure'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'Please describe',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques53',
        question_number: 53,
        question: 'Did mum take any medication during the pregnancy?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
                {id: 2, name: 'Not Sure'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'What medication was taken?',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques54',
        question_number: 54,
        question:
          'How long was the pregnancy in weeks (full-term is 37 to 40 weeks).',
        answer: '',
        type: 'text',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques55',
        question_number: 55,
        question: 'Do you know [forename] ’s birth weight?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'What was [forename] ’s birth weight?',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques56',
        question_number: 56,
        question: 'Any history of post-natal depression?',
        answer: '',
        type: 'radio',
        nesting: false,
        nestingObj: {},
        option: ['Yes', 'No'],
        isRequired: true,
      },
      {
        question_id: 'ques57',
        question_number: 57,
        question: 'How was [forename] delivered? Please tick all that apply',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Unassisted vaginal birth'},
                {id: 2, name: 'C-Section'},
                {id: 3, name: 'Ventouse/ Forceps'},
                {id: 4, name: 'Not Sure'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'Comments',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques58',
        question_number: 58,
        question:
          'Did [forename] require any after birth care at or after delivery? please tick all that apply:',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Resuscitation needed'},
                {id: 2, name: 'Admitted to special care'},
                {id: 3, name: 'Feeding difficulties'},
                {id: 4, name: 'Not Sure'},
                {id: 5, name: 'None'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder: 'Comments',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
    ],
    education: [
      {
        question_id: 'ques59',
        question_number: 59,
        question:
          'Name of Preschool/nursery or education setting attended (state if the CYP is home educated)',
        answer: '',
        type: 'text',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques60',
        question_number: 60,
        question:
          'Please describe difficulties [forename] experienced during their preschool, nursery or primary or secondary school years if applicable? (Bullying, running away from school, social isolation, poor school attendance, exclusions etc.) ',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
      {
        question_id: 'ques61',
        question_number: 61,
        question:
          'Please describe any extra support [forename] received or is receiving at preschool nursery, primary or secondary school:',
        answer: '',
        type: 'textArea',
        nesting: false,
        nestingObj: {},
        option: '',
        isRequired: true,
      },
    ],
    mental: [
      {
        question_id: 'ques62',
        question_number: 62,
        question:
          'Please tick against any concerns you have about [forename] ’s emotional well-being:',
        answer: '',
        type: 'form2',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 58,
              answer: '',
              id: 1,
              name: 'development_areas',
              type: 'checkbox',
              placeholder: '',
              options: [
                {id: 1, name: 'Anxiety'},
                {id: 2, name: 'Hyperactivity'},
                {id: 3, name: 'Mood Swings'},
                {id: 4, name: 'Low Mood'},
                {id: 5, name: 'Bereavement'},
                {id: 6, name: 'Impulsivity'},
                {id: 7, name: 'Fears or phobias'},
                {id: 8, name: 'Hallucinations'},
                {id: 9, name: 'Eating Disorder'},
                {id: 10, name: 'Self-Harm'},
                {id: 11, name: 'Short Attention span'},
                {id: 12, name: 'Obsessive Compulsive Behaviours'},
                {id: 13, name: 'School attendance issues'},
                {id: 14, name: 'Anger or aggression'},
                {id: 15, name: 'Domestic Violence'},
                {id: 16, name: 'Criminal activity/ antisocial behaviours'},
                {id: 17, name: 'Involvement with Youth Offending Team'},
              ],
            },
            {
              cid: 58,
              answer: '',
              id: 2,
              name: 'More Details',
              type: 'textArea',
              placeholder: 'More Details',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'chkmore',
            },
          ],
        },
        option: '',
        isRequired: true,
      },

      {
        question_id: 'ques63',
        question_number: 63,
        question:
          'Has [forename] ever had treatment (including hospitalisation) by, or is currently seeing, a psychiatrist, psychologist, therapist, or counsellor?',

        answer: '',
        type: 'form1',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 17,
              answer: '',
              id: 1,
              jsonStyle: 'radioInline',
              name: '',
              type: 'radio',
              placeholder: '',
              col: 12,
              options: [
                {id: 1, name: 'Yes'},
                {id: 2, name: 'No'},
              ],
            },
            {
              cid: 1,
              answer: '',
              id: 2,
              name: 'Details',
              type: 'textArea',
              placeholder:
                'Please give the following details: Nature of the concerns; start and end date of support; where seen and clinician’s name; type of support, for example: counselling, play therapy, cognitive behaviour therapy, group work, family work, parent support and advice.',
              multiline: true,
              fullWidth: true,
              col: 12,
              rows: 4,
              jsonStyle: 'more',
            },
          ],
        },
        option: '',
        isRequired: true,
      },
    ],
    previousAssessments: [
      {
        question_id: 'ques64',
        question_number: 64,
        question:
          'Please indicate if [forename] has had any of the following assessments? Please attach copies of any reports and information on support provided. if available',
        answer: '',
        type: 'form2',
        nesting: true,
        nestingObj: {
          onetype: [
            {
              cid: 58,
              answer: '',
              id: 1,
              name: 'development_areas',
              type: 'checkbox',
              placeholder: '',
              options: [
                {id: 0, name: 'None'},
                {id: 1, name: 'Paediatric developmental assessment'},
                {id: 2, name: 'Clinical psychological assessment'},
                {id: 3, name: 'CAMHS assessment'},
                {id: 4, name: 'Health visitor'},
                {id: 5, name: 'SEN Specialist Advice and Support Service'},
                {
                  id: 6,
                  name: 'Social Services including CIN ([forename] in Need) and CP ([forename] Protection)',
                },
                {id: 7, name: 'Families First/ Intensive Family Support'},
                {id: 8, name: 'Educational psychological assessment'},
                {id: 9, name: 'Speech and language assessment'},
                {id: 10, name: 'Occupational Therapy assessment'},
                {id: 11, name: 'Special Needs Health visitor'},
                {
                  id: 12,
                  name: 'Early Years SEN team or Communication and Autism Team (advisory teachers)',
                },
                {
                  id: 13,
                  name: 'School support including SENCO, TAC (Team Around the child), parent support, counselling, circle of friends, social support, behaviour Pupil Support Base',
                },
                {id: 14, name: 'CAMHS Step 2 and Specialist CAMHS'},
                {id: 15, name: 'Angels/Add-vance/Space/other voluntary agency'},
                {
                  id: 16,
                  name: 'Other- Please specify (including in the NHS, Independent or charity sector)',
                },
              ],
            },
          ],
        },
        isRequired: true,
      },
    ],
  });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [progress, setProgress] = useState(0);
  const [newMemberCount, setNewMemberCount] = useState(7);
  const [trigger, settrigger] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const {cardData} = useSelector(selectCaseloadCardData);
  const scrollViewRef = useRef();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const overViewData = useSelector(selectOverViewData);
  let {cardSelected} = useSelector(selectPatientData);
  const [userDetails, setUserDetail] = useState(null);
  const questionRefs = useRef([]);

  useEffect(() => {
    getUserDetail();
  }, []);
  const getUserDetail = async () => {
    let useData = await storageRead('userDetails');
    setUserDetail(useData);
  };
  var sections = [
    question?.personalDetails,
    question?.familyHistory,
    question?.communication,
    question?.socialInteraction,
    question?.playImagination,
    question?.sensory,
    question?.motorMannerisms,
    question?.attentionActivity,
    question?.birthDetails,
    // question.earlyDevelopement,
    question?.education,
    question?.mental,
    question?.previousAssessments,
  ];

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true});
    }
  };

  const onDataSubmit = async () => {
    const totalSections = sections?.length;

    try {
      let payload = {
        data: question,
        caseload_id: cardData?.id,
        total_count: totalSections,
        actual_count: currentSectionIndex,
        isFinalSubmit: true,
      };
      let result = await ParentFormSubmit(payload);
      setLoader(false);
      onClose();
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    // let data = testQuestion[0].data;
    // setQuestion(data);
    ParentReportList();
  }, []);

  const ParentReportList = async () => {
    try {
      const response = await patientReportDetails(cardSelected);
      let ParentData = response?.data?.data;

      if (response.data.status === 200) {
        if (ParentData?.parentReport[0]?.isDraft) {
          setQuestion(ParentData?.parentReport[0].data);
          setCurrentSectionIndex(ParentData?.parentReport[0]?.actual_count);
        }

        setData(ParentData?.parentReport);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchedQuestions = question;

    const initialStatus = {};

    Object.keys(fetchedQuestions).forEach(section => {
      fetchedQuestions[section].forEach(question => {
        const specialCases = [
          'Resuscitation needed',
          'Ventouse/ Forceps',
          'C-Section',
          'Admitted to special care',
          'Feeding difficulties',
        ];

        if (question?.nesting && question?.nestingObj?.onetype) {
          question.nestingObj.onetype.forEach(nestedItem => {
            if (nestedItem.type === 'radio' && nestedItem.answer === 'Yes') {
              initialStatus[`${question.question_id}`] = true;
            }

            if (specialCases.includes(nestedItem.answer)) {
              initialStatus[`${question.question_id}`] = true;
            }
          });
        } else {
          if (question.type === 'radio' && question.answer === 'Yes') {
            initialStatus[question.question_id] = true;
          }
          if (specialCases.includes(question.answer)) {
            initialStatus[question.question_id] = true;
          }
        }
      });
    });

    setQuestionStatus(initialStatus);
  }, [question]);

  const handleCheckboxChange = (
    questionId,
    optionName,
    isChecked,
    nestedField,
    field,
  ) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = {...prevAnswers};

      const parentKey = `${questionId}_${nestedField.cid}_${nestedField.id}`;

      if (!updatedAnswers[parentKey]) {
        updatedAnswers[parentKey] = {};
      }
      const fieldKey = nestedField.cid;
      if (!updatedAnswers[parentKey][fieldKey]) {
        updatedAnswers[parentKey][fieldKey] = [];
      }
      if (isChecked) {
        updatedAnswers[parentKey][fieldKey] = [
          ...updatedAnswers[parentKey][fieldKey],
          optionName,
        ];
      } else {
        updatedAnswers[parentKey][fieldKey] = updatedAnswers[parentKey][
          fieldKey
        ]?.filter(item => item !== optionName);
      }
      nestedField['answer'] = updatedAnswers[parentKey][fieldKey];
      field['answer'] = updatedAnswers[parentKey][fieldKey];

      if (updatedAnswers[parentKey][fieldKey].length === 0) {
        delete updatedAnswers[parentKey][fieldKey];
      }
      if (Object.keys(updatedAnswers[parentKey]).length === 0) {
        delete updatedAnswers[parentKey];
      }

      return updatedAnswers;
    });

    clearError(`${questionId}_${nestedField.cid}_${nestedField.id}`);
  };

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
    const date = new Date(cardData?.patient_dob);

    setSelectedDate(date);
    if (cardData) {
      setAnswers({
        ques1_1_1: {
          1: cardData?.patient_name || '',
        },
        ques1_1_2: {
          1: cardData?.patient_dob || '',
        },
        ques1_1_3: {
          1: overViewData?.patient_address || '',
        },
        ques1_1_4: {
          1: cardData?.nhs_number === 'N/A' ? '' : cardData?.nhs_number || '',
        },
        ques1_1_5: {
          1: overViewData?.gp_address || 'null',
        },
        ques1_1_6: {
          1: cardData?.patient_gender || '',
        },
        ques2_2_1: {
          2:
            `${parentData[0]?.user?.first_name} ${parentData[0]?.user?.last_name}` ||
            '',
        },
        ques2_2_2: {
          2: parentData[0]?.user?.phone_no
            ? parentData[0]?.user?.phone_no
            : '' || '',
        },
        ques2_2_3: {
          2: parentData[0]?.user?.email || '',
        },
        ques2_2_4: {
          2: parentData[0]?.user?.address || '',
        },
      });
    }
  }, [cardData, overViewData]);

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
    setLoader(true);
    const totalSections = sections?.length;
    let result;
    try {
      const payload = {
        data: question,
        caseload_id: cardData?.id,
        total_count: totalSections - 1,
        actual_count: currentSectionIndex,
        isFinalSubmit: type === 'Save' ? true : false,
      };
      const updatePayload = {
        data: question,
        total_count: totalSections - 1,
        actual_count: currentSectionIndex,
        isFinalSubmit: type === 'Save' ? true : false,
      };

      if (data.length === 0) {
        result = await ParentFormSubmit(payload);
      } else {
        result = await ParentFormUpdate(updatePayload, data[0]?.id);
      }
      setLoader(false);
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoader(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const updateAnswerInQuestion = (
        question,
        questionId,
        fieldId,
        newValue,
      ) => {
        const targetQuestion = question?.find(
          q => q.question_id === questionId,
        );
        if (targetQuestion) {
          const targetField = targetQuestion.nestingObj?.onetype?.find(
            f => f.id === fieldId,
          );
          if (targetField) {
            targetField.answer = newValue;
          }
        }
      };

      const dateOfBirth = formatIsoDateToDDMMYYYY(cardData?.patient_dob);
      console.log('cardData?.patient_name', cardData?.patient_name);
      if (cardData) {
        updateAnswerInQuestion(
          question.personalDetails,
          'ques1',
          1,
          cardData?.patient_name || '',
        );

        if (dateOfBirth) {
          updateAnswerInQuestion(
            question.personalDetails,
            'ques1',
            2,
            dateOfBirth || '',
          );
        }

        if (cardData?.patient_address) {
          updateAnswerInQuestion(
            question.personalDetails,
            'ques1',
            3,
            cardData?.patient_address || '',
          );
        }

        if (cardData?.nhs_number) {
          updateAnswerInQuestion(
            question.personalDetails,
            'ques1',
            4,
            cardData?.nhs_number === 'N/A' ? '' : cardData?.nhs_number || '',
          );
        }

        if (overViewData?.gp_address) {
          updateAnswerInQuestion(
            question.personalDetails,
            'ques1',
            5,
            overViewData?.gp_address || 'null',
          );
        }

        updateAnswerInQuestion(
          question.personalDetails,
          'ques1',
          6,
          cardData?.patient_gender || '',
        );

        updateAnswerInQuestion(
          question.personalDetails,
          'ques2',
          1,
          `${parentData[0]?.user?.first_name} ${parentData[0]?.user?.last_name}` ||
            '',
        );

        updateAnswerInQuestion(
          question.personalDetails,
          'ques2',
          2,
          parentData[0]?.user?.phone_no
            ? parentData[0]?.user?.phone_no
            : '' || '',
        );

        updateAnswerInQuestion(
          question.personalDetails,
          'ques2',
          3,
          parentData[0]?.user?.email || '',
        );

        updateAnswerInQuestion(
          question.personalDetails,
          'ques2',
          4,
          parentData[0]?.user?.address || '',
        );
      }
      return () => {};
    }, [cardData, overViewData, parentData, question]),
  );

  useFocusEffect(
    useCallback(() => {
      const updateAnswerInQuestion = (
        question,
        questionId,
        fieldId,
        newValue,
      ) => {
        const targetQuestion = question?.find(
          q => q.question_id === questionId,
        );

        if (targetQuestion) {
          targetQuestion.answer = newValue;
        }
      };

      const dateOfBirth = formatIsoDateToDDMMYYYY(cardData?.patient_dob);
      console.log('cardData?.patient_name', cardData?.patient_name);
      if (cardData) {
        updateAnswerInQuestion(
          question.personalDetails,
          'ques1',
          1,
          cardData?.patient_name || '',
        );
        updateAnswerInQuestion(
          question.personalDetails,
          'ques2',
          1,
          `${parentData[0]?.user?.first_name} ${parentData[0]?.user?.last_name}` ||
            '',
        );
      }
      return () => {};
    }, [cardData, overViewData, parentData, question]),
  );

  const totalSections = sections?.length;

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
      } else if (value === 'No' || value === 'Not Sure' || 'None') {
        const allNo = Object.keys(updatedStatus)
          .filter(key => key.startsWith(questionId + '_'))
          .every(key => !updatedStatus[key]);
        updatedStatus[questionId] = !allNo;

        const {nestingObj} = questionField;
        let lastCid;
        let lastId;

        if (allNo) {
          if (nestingObj && nestingObj.onetype) {
            const onetypeArray = nestingObj.onetype;
            const lastItem = onetypeArray[onetypeArray.length - 1];
            lastCid = lastItem.cid;
            lastId = lastItem.id;

            delete answers[`${questionId}_${lastCid}_${lastId}`];
            onetypeArray.map((item, index) => {
              if (index === onetypeArray.length - 1) {
                item.answer = '';
              }
            });
          }
        }
      }

      const isSpecialCase =
        specialCases[questionId] && specialCases[questionId].includes(value);

      if (isSpecialCase) {
        updatedStatus[questionId] = true;
      }

      return updatedStatus;
    });

    clearError(`${questionId}_${field.cid}_${fieldId}`);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [`${questionId}_${field.cid}_${fieldId}`]: {
        ...prevAnswers[`${questionId}_${field.cid}_${fieldId}`],
        [field.id]: value,
      },
    }));
    field['answer'] = value;
    questionField['answer'] = value;
  };

  const addNewMember = () => {
    const newMember = {
      cid: newMemberCount,
      answer: '',
      id: newMemberCount + 1,
      name: 'Name',
      type: 'text',
      placeholder: 'Enter Name',
      fullWidth: true,
      col: 3,
    };

    const newAge = {
      cid: newMemberCount,
      answer: '',
      id: newMemberCount + 2,
      name: 'Age',
      type: 'text',
      placeholder: 'Age',
      fullWidth: true,
      col: 2,
    };

    const newRelationship = {
      cid: newMemberCount,
      answer: '',
      id: newMemberCount + 3,
      name: '*Relationship',
      type: 'text',
      placeholder: 'Relationship to [forename] / young person',
      fullWidth: true,
      col: 3,
    };

    const newGender = {
      cid: newMemberCount,
      answer: '',
      id: newMemberCount + 4,
      name: 'Gender',
      type: 'radio',
      placeholder: '',
      options: [
        {id: 1, name: 'Male'},
        {id: 2, name: 'Female'},
        {id: 3, name: 'Other'},
      ],
      col: 3,
    };

    const newButton = {
      cid: newMemberCount,
      answer: '',
      id: newMemberCount + 5,
      name: 'X',
      type: 'button',
      col: 1,
      jsonStyle: 'onlybutton',
    };
    const currentSections = sections[currentSectionIndex];
    const currentSection = currentSections.find(
      item => item.question_id === 'ques10',
    );

    if (currentSection) {
      currentSection.nestingObj.onetype.push(
        newButton,
        newMember,
        newAge,
        newRelationship,
        newGender,
      );
      setNewMemberCount(prevCount => prevCount + 1);
      settrigger(false);
    } else {
    }
  };

  const removeMember = (cid, index) => {
    if (index === 4) {
      return Alert.alert('MyCareBridge', 'not remove');
    }
    const current = sections[currentSectionIndex][0].nestingObj.onetype;
    const updatedMembers = current.filter(element => {
      return element.cid !== cid;
    });
    const currentSections = sections[currentSectionIndex];
    const currentSection = currentSections.find(
      item => item.question_id === 'ques10',
    );
    if (updatedMembers.length === 0) {
      return;
    }
    if (currentSection) {
      currentSection.nestingObj.onetype = updatedMembers;

      settrigger(false);
      setNewMemberCount(prevCount => prevCount + 1);
    }
  };
  const handleNextSection = () => {
    scrollToTop();
    const currentSection = sections[currentSectionIndex];
    let newErrors = {};
    currentSection?.forEach(field => {
      if (field?.nesting && field?.isRequired) {
        field?.nestingObj?.onetype?.forEach(nestedField => {
          const key = `${field?.question_id}_${nestedField?.cid}_${nestedField?.id}`;
          const skipFields = ['More Details', 'Please describe:', 'Details'];
          if (
            nestedField.type !== 'button' &&
            !skipFields.includes(nestedField?.name) &&
            !answers[key]?.[nestedField?.cid]
          ) {
            if (!nestedField?.answer) {
              newErrors[key] = `${
                !nestedField?.name ? 'This field' : nestedField?.name
              } is required`;
            }
          }
        });
      } else if (
        field.isRequired &&
        !answers[field.question_id]?.[field.question_number]
      ) {
        const skipFields = ['More Details', 'Please describe', 'Details'];
        if (!skipFields.includes(field.name)) {
          if (!field?.answer) {
            newErrors[field.question_id] = `${
              field.name === undefined ? 'This field' : field.name
            } is required`;
          }
        }
      }
    });

    setErrors(newErrors);
    let scrollToIndex = -1;
    for (let i = 0; i < currentSection.length; i++) {
      const field = currentSection[i];
      const topLevelError = newErrors[`${field.question_id}`];
      let nestedError = false;
      if (field?.nesting && field?.isRequired) {
        field?.nestingObj?.onetype?.forEach(nestedField => {
          const nestedKey = `${field?.question_id}_${nestedField?.cid}_${nestedField?.id}`;
          if (newErrors[nestedKey]) {
            nestedError = true;
          }
        });
      }
      if (topLevelError || nestedError) {
        scrollToIndex = i;
        break;
      }
    }
    if (scrollToIndex !== -1 && questionRefs.current[scrollToIndex]) {
      questionRefs.current[scrollToIndex].measureLayout(
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
                setLoader(true);
                // onDataSubmit();
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
    field['answer'] = text;
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
  const handleDateChange = (date, questionId, fieldId) => {
    clearError(questionId);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [fieldId]: date,
      },
    }));
  };

  const setPreviousAssessments = (previousAssessments, question_id, field) => {
    if (Array.isArray(previousAssessments)) {
      previousAssessments?.forEach(assessment => {
        if (question_id === 'ques62' || question_id === 'ques64') {
          const nestedField = assessment;
          handleCheckboxChange(
            field.question_id,
            assessment,
            true,
            field.nestingObj.onetype[0],
            field,
          );
        }
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (
        sections[currentSectionIndex][0]?.question_id === 'ques62' ||
        sections[currentSectionIndex][0]?.question_id === 'ques64'
      ) {
        setPreviousAssessments(
          sections[currentSectionIndex][0]?.answer,
          sections[currentSectionIndex][0]?.question_id,
          sections[currentSectionIndex][0],
        );
      }
    }, [currentSectionIndex]),
  );

  const renderInputField = (field, questionId) => {
    const readOnlyFields = ['ques1', 'ques2'];
    const isEditable = !readOnlyFields.includes(questionId);
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <View key={field.question_id}>
            <TextInput
              multiline={field.type === 'textArea'}
              placeholderTextColor={'#667085'}
              numberOfLines={field?.type === 'textArea' ? 4 : 1}
              placeholder={
                !field?.placeholder
                  ? 'Please Enter'
                  : field?.placeholder?.replace(
                      '[forename]',
                      cardData?.patient_name,
                    )
              }
              onChangeText={text => {
                handleTextChange(
                  text,
                  field?.question_id,
                  field?.question_number,
                  field,
                );
              }}
              value={
                answers[field?.question_id]?.[field?.question_number] ||
                field?.answer
              }
              keyboardType={
                field.type === 'number'
                  ? 'numeric'
                  : field.type === 'email'
                  ? 'email-address'
                  : field.name === 'Age'
                  ? 'number-pad'
                  : 'default'
              }
              style={styles.inputField}
            />
            {!!errors[field?.questionId] && (
              <Text style={{color: 'red'}}>{errors[field?.questionId]}</Text>
            )}
          </View>
        );
      case 'form1':
        return (
          <>
            {field?.nestingObj?.Action?.map((nestedField, index) => {
              return (
                <>
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        addNewMember();
                      }}
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: 'rgb(74, 24, 80)',
                        // alignSelf: 'center',
                        borderRadius: 3,
                        // width: '45%',
                        // alignItems: 'center',
                        // marginBottom: 30,
                        borderWidth: 0.5,
                      }}>
                      <Text style={styles.buttonText}>{nestedField?.name}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            })}

            <View>
              {field.nestingObj.onetype.map((nestedField, index) => {
                const fieldError =
                  errors[
                    `${questionId}_${nestedField?.cid}_${nestedField?.id}`
                  ];

                let ObjId = `${questionId}_${nestedField?.cid}_${nestedField?.id}`;

                const isInput =
                  (field.question_id === 'ques1' &&
                    nestedField.name === 'NHS Number' &&
                    cardData?.nhs_number === 'N/A') ||
                  (field.question_id === 'ques2' &&
                    nestedField.name === 'Contact Number');
                return (
                  <>
                    <View
                      key={index}
                      style={{alignSelf: 'flex-end', width: '10%'}}>
                      {nestedField.type === 'button' && nestedField.id != 5 && (
                        <View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#6A2382',
                              borderRadius: 4,
                              marginTop: 5,
                            }}
                            onPress={() => {
                              removeMember(nestedField?.cid, index);
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 12,
                                padding: 10,
                              }}>
                              {nestedField?.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <View key={nestedField.id}>
                      {nestedField.type !== 'button' &&
                        nestedField.type !== 'textArea' &&
                        nestedField.placeholder !== 'More Details' && (
                          <Text style={styles.leabel}>{nestedField?.name}</Text>
                        )}
                      {nestedField.type == 'date' && (
                        <View key={nestedField.id}>
                          {dateOpen && (
                            <DatePicker
                              modal
                              mode="date"
                              date={
                                formatIsoDateToDDMMYYYY(selectedDate) ||
                                new Date() ||
                                formatIsoDateToDDMMYYYY(nestedField?.answer)
                              }
                              maximumDate={new Date()}
                              open={dateOpen}
                              onConfirm={dates => {
                                setDateOpen(false);
                                handleDateChange(
                                  dates,
                                  ObjId,
                                  nestedField?.cid,
                                  nestedField,
                                );
                              }}
                              onCancel={() => {
                                setDateOpen(false);
                              }}
                              onDateChange={date => {
                                setSelectedDate(date);
                                nestedField['answer'] = formatIsoDateToDDMMYYYY(
                                  date.toISOString().split('T')[0],
                                );
                              }}
                              style={{width: 200, marginTop: 10}}
                            />
                          )}
                          <TouchableOpacity
                            disabled={!isEditable}
                            onPress={() => setDateOpen(true)}>
                            <Text
                              style={[
                                styles.inputField,
                                {textAlignVertical: 'center'},
                                !isEditable && {color: '#667085'},
                              ]}>
                              {selectedDate
                                ? formatIsoDateToDDMMYYYY(
                                    answers[ObjId]?.[nestedField.cid],
                                  ) ||
                                  formatIsoDateToDDMMYYYY(
                                    selectedDate.toISOString().split('T')[0],
                                  )
                                : formatIsoDateToDDMMYYYY(nestedField?.answer)
                                ? formatIsoDateToDDMMYYYY(nestedField?.answer)
                                : nestedField?.placeholder}
                            </Text>
                          </TouchableOpacity>
                          {fieldError && (
                            <Text style={{color: 'red'}}>{fieldError}</Text>
                          )}
                        </View>
                      )}

                      {!nestedField?.options &&
                        nestedField.type !== 'textArea' &&
                        nestedField.type !== 'button' &&
                        nestedField.type !== 'date' && (
                          <View key={nestedField.id}>
                            <TextInput
                              editable={
                                // isEditable &&
                                // ((field.question_id === 'ques1' &&
                                //   nestedField.name === 'NHS Number' &&
                                //   cardData?.nhs_number === 'N/A') ||
                                //   (field.question_id === 'ques2' &&
                                //     nestedField.name === 'Contact Number'))
                                isEditable || isInput
                              }
                              multiline={nestedField?.type === 'textArea'}
                              placeholderTextColor={'#667085'}
                              numberOfLines={
                                nestedField.type === 'textArea' ? 4 : 1
                              }
                              placeholder={nestedField?.placeholder?.replace(
                                '[forename]',
                                cardData?.patient_name,
                              )}
                              onChangeText={text => {
                                handleTextChange(
                                  text,
                                  ObjId,
                                  nestedField.cid,
                                  nestedField,
                                );
                              }}
                              value={
                                answers[ObjId]?.[nestedField?.cid] ||
                                nestedField?.answer
                              }
                              keyboardType={
                                nestedField.type === 'number'
                                  ? 'numeric'
                                  : nestedField.type === 'email'
                                  ? 'email-address'
                                  : 'default'
                              }
                              style={[
                                styles.inputField,
                                !isEditable && {color: '#667085'},
                              ]}
                            />
                            {fieldError && (
                              <Text style={{color: 'red'}}>{fieldError}</Text>
                            )}
                          </View>
                        )}

                      {nestedField?.options &&
                        nestedField?.options?.length > 0 && (
                          <View key={nestedField.id}>
                            <View
                              key={index}
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View style={{paddingVertical: 8}}>
                                <ScrollView horizontal style={{flex: 1}}>
                                  <RadioGroup
                                    disable={!isEditable}
                                    defaultValue={
                                      answers[ObjId]?.[nestedField?.cid] ||
                                      nestedField?.answer
                                    }
                                    options={nestedField?.options}
                                    onPress={value => {
                                      handleRadioChange(
                                        value,
                                        field.question_id,
                                        nestedField.id,
                                        nestedField,
                                        field,
                                      );
                                    }}
                                  />
                                </ScrollView>
                                {fieldError && (
                                  <Text style={{color: 'red'}}>
                                    {fieldError}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        )}
                      {questionStatus[field?.question_id] &&
                        nestedField.type === 'textArea' && (
                          <View key={nestedField.id}>
                            <Text style={styles.leabel}>
                              {/* {nestedField?.name} */}
                            </Text>

                            <TextInput
                              editable={isEditable}
                              placeholder={nestedField?.placeholder?.replace(
                                '[forename]',
                                cardData?.patient_name,
                              )}
                              placeholderTextColor={'#667085'}
                              value={
                                answers[ObjId]?.[nestedField?.cid] ||
                                nestedField?.answer
                              }
                              onChangeText={text => {
                                // nestedField['answer'] = text;
                                handleTextChange(
                                  text,
                                  ObjId,
                                  nestedField.cid,
                                  nestedField,
                                );
                              }}
                              keyboardType={
                                nestedField.type === 'number'
                                  ? 'numeric'
                                  : nestedField.type === 'email'
                                  ? 'email-address'
                                  : field.name === 'Age'
                                  ? 'number-pad'
                                  : 'default'
                              }
                              style={[
                                styles.textArea,
                                !isEditable && {color: '#667085'},
                              ]}
                            />

                            {fieldError && (
                              <Text style={{color: 'red'}}>{fieldError}</Text>
                            )}
                          </View>
                        )}
                      {!nestedField?.options &&
                        nestedField?.type === 'textArea' &&
                        nestedField?.name !== 'More Details' &&
                        nestedField?.name !== 'Please describe:' &&
                        nestedField?.name !== 'Details' &&
                        nestedField?.type !== 'button' &&
                        nestedField?.type !== 'date' && (
                          <View key={nestedField.id}>
                            <Text style={styles.leabel}>
                              {nestedField?.name}
                            </Text>

                            <TextInput
                              editable={isEditable}
                              placeholder={nestedField?.placeholder?.replace(
                                '[forename]',
                                cardData?.patient_name,
                              )}
                              placeholderTextColor={'#667085'}
                              onChangeText={text => {
                                handleTextChange(
                                  text,
                                  ObjId,
                                  nestedField.cid,
                                  nestedField,
                                );
                              }}
                              value={
                                answers[ObjId]?.[nestedField.cid] ||
                                nestedField?.answer
                              }
                              keyboardType={
                                field.type === 'number'
                                  ? 'numeric'
                                  : field.name === 'Age'
                                  ? 'numeric'
                                  : 'default'
                              }
                              style={[
                                styles.textArea,
                                !isEditable && {color: '#667085'},
                              ]}
                            />

                            {fieldError && (
                              <Text style={{color: 'red'}}>{fieldError}</Text>
                            )}
                          </View>
                        )}
                    </View>
                  </>
                );
              })}
            </View>
          </>
        );
      case 'date':
        return (
          <>
            {dateOpen && (
              <DatePicker
                modal
                mode="date"
                date={selectedDate || new Date() || field?.answer}
                open={dateOpen}
                onConfirm={dates => {
                  setDateOpen(false);
                  setSelectedDate(dates);
                  field['answer'] = formatIsoDateToDDMMYYYY(
                    dates.toISOString().split('T')[0],
                  );

                  handleDateChange(
                    dates,
                    field?.question_id,
                    field?.question_number,
                    field,
                  );
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
                onDateChange={date => {
                  setSelectedDate(date);
                  field['answer'] = formatIsoDateToDDMMYYYY(
                    date.toISOString().split('T')[0],
                  );
                }}
                style={{width: 200, marginTop: 10}}
              />
            )}
            <TouchableOpacity onPress={() => setDateOpen(true)}>
              <Text style={[styles.inputField, {textAlignVertical: 'center'}]}>
                {selectedDate
                  ? answers[questionId]?.[field?.question_id] ||
                    formatIsoDateToDDMMYYYY(
                      selectedDate.toISOString().split('T')[0],
                    )
                  : field?.answer
                  ? formatIsoDateToDDMMYYYY(field?.answer)
                  : field?.placeholder}
              </Text>
            </TouchableOpacity>
            {!!errors[field?.questionId] && (
              <Text style={{color: 'red'}}>{errors[field?.questionId]}</Text>
            )}
          </>
        );
      case 'form2':
        return (
          <View>
            {field.nestingObj.onetype.map((nestedField, index) => {
              let ObjId = `${questionId}_${nestedField?.cid}_${nestedField?.id}`;
              const fieldError =
                errors[`${questionId}_${nestedField?.cid}_${nestedField?.id}`];

              return (
                <View key={index}>
                  <Text style={styles.leabel}>{nestedField?.name}</Text>

                  <>
                    {!nestedField?.options && (
                      <>
                        <TextInput
                          placeholder={nestedField?.placeholder?.replace(
                            '[forename]',
                            cardData?.patient_name,
                          )}
                          placeholderTextColor={'#667085'}
                          onChangeText={text => {
                            handleTextChange(
                              text,
                              ObjId,
                              nestedField?.cid,
                              nestedField,
                            );
                          }}
                          keyboardType={
                            field.type === 'number'
                              ? 'numeric'
                              : field.name === 'Age'
                              ? 'numeric'
                              : 'default'
                          }
                          style={styles.inputField}
                          value={
                            answers[ObjId]?.[nestedField?.cid] ||
                            nestedField?.answer
                          }
                        />
                        {fieldError && (
                          <Text style={{color: 'red'}}>{fieldError}</Text>
                        )}
                      </>
                    )}
                  </>
                  {nestedField?.options && nestedField?.options?.length > 0 && (
                    <View key={`${nestedField?.cid}_${index}`}>
                      {nestedField?.options?.map((option, index) => {
                        const fieldError =
                          errors[
                            `${questionId}_${nestedField?.cid}_${nestedField?.id}`
                          ];
                        return (
                          <>
                            <View key={index} style={{flexDirection: 'row'}}>
                              <TouchableOpacity
                                onPress={() => {
                                  const newValue = !(
                                    answers[
                                      `${field?.question_id}_${nestedField?.cid}_${nestedField?.id}`
                                    ]?.[nestedField?.cid] ||
                                    nestedField?.answer ||
                                    []
                                  ).includes(option.name);
                                  handleCheckboxChange(
                                    field.question_id,
                                    option.name,
                                    newValue,
                                    nestedField,
                                    field,
                                  );
                                }}
                                style={{marginRight: 10, flexDirection: 'row'}}>
                                <CheckBox
                                  style={{
                                    marginHorizontal:
                                      Platform.OS === 'ios' ? 7 : 0,
                                    marginVertical:
                                      Platform.OS === 'ios' ? 7 : 0,
                                  }}
                                  tintColors={{true: '#6A2382', false: 'grey'}}
                                  value={(
                                    answers[
                                      `${field?.question_id}_${nestedField?.cid}_${nestedField?.id}`
                                    ]?.[nestedField?.cid] ||
                                    nestedField?.answer ||
                                    []
                                  ).includes(option.name)}
                                  onValueChange={newValue =>
                                    handleCheckboxChange(
                                      field.question_id,
                                      option.name,
                                      newValue,
                                      nestedField,
                                      field,
                                    )
                                  }
                                />
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 15,
                                    marginVertical:
                                      Platform.OS === 'android' ? 5 : 13,
                                  }}
                                  key={index}>
                                  {option?.name}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        );
                      })}
                      {errors[ObjId] && (
                        <Text style={{color: 'red'}}>{errors[ObjId]}</Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      case 'radio':
        if (field.option && field.option.length > 0) {
          return (
            <View key={questionId}>
              {field?.name && <Text style={styles.leabel}>{field?.name}</Text>}
              <RadioGroup
                defaultValue={
                  answers[field?.question_id]?.[field?.question_number] ||
                  field?.answer
                }
                options={field?.option}
                onPress={value => {
                  handleSingleOptionChange(
                    value,
                    field?.question_id,
                    field?.question_number,
                    field,
                  );
                }}
              />
            </View>
          );
        } else {
          return null;
        }
      case 'textArea':
        return (
          <View key={questionId}>
            <TextInput
              multiline={field?.type === 'textArea'}
              numberOfLines={field?.type === 'textArea' ? 4 : 1}
              placeholder={
                !field?.placeholder
                  ? 'Please 500 Characters'
                  : field?.placeholder?.replace(
                      '[forename]',
                      cardData?.patient_name,
                    )
              }
              onChangeText={text => {
                handleTextChange(
                  text,
                  questionId,
                  field?.question_number,
                  field,
                );
              }}
              value={
                answers[field?.question_id]?.[field?.question_number] ||
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
          key={field?.question_id}
          style={{marginVertical: 10}}
          ref={el => (questionRefs.current[index] = el)}>
          <>
            <View style={{flexDirection: 'row', maxWidth: '90%'}}>
              <Text style={styles.question}>
                {`${field?.question_number}. `}
              </Text>
              <Text style={styles.question}>
                {`${field?.question.replace(
                  '[forename]',
                  cardData?.patient_name,
                )} `}
                <Text style={[styles.question, {color: 'red'}]}>{`*`}</Text>
              </Text>
            </View>
            <View style={{paddingVertical: 10, paddingBottom: 5}}>
              {renderInputField(field, field?.question_id)}
            </View>
            {!!errors[field?.question_id] && (
              <Text style={{color: 'red'}}>{errors[field?.question_id]}</Text>
            )}
          </>
        </View>
      );
    });
  };

  const currentSection = sections[currentSectionIndex];
  const currentSectionTitle = camelCaseToUpperWords(
    Object.keys(question).find(key => question[key] === currentSection),
  );
  const firstQuestionNumber = currentSection[0]?.question_number;
  const lastQuestionNumber =
    currentSection[currentSection.length - 1]?.question_number;
  const questionRange = `${firstQuestionNumber}-${lastQuestionNumber}`;
  useEffect(() => {
    const newProgress = (currentSectionIndex + 1) / totalSections;
    setProgress(newProgress);
  }, [currentSectionIndex]);

  const [modalVisible, isModalVisible] = useState(false);
  const toggleModal = () => {
    isModalVisible(!modalVisible);
  };
  const isNetworkError = useSelector(selectNetworkError);

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationIn="slideInUp"
        onRequestClose={onClose}
        animationOut="slideOutDown">
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.conatiner}>
            <CaseLoadInfoHeader
              iconFirstPress={() => {
                onClose();
              }}
              iconFirst={'chevron-left'}
              name={cardData?.patient_name}
              iconSize={34}
              iconColor={'black'}
            />
            <CaseLoadStatus
              caseloadTitle={currentSectionTitle}
              questionrange={questionRange}
              progress={progress}
              // icon={'info'}
              // iconPress={toggleModal}
            />
            {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}> */}
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              style={{
                backgroundColor: 'white',
                // marginBottom: 80,
                // flexGrow: 1,
                marginHorizontal: 15,
                // marginTop: 20,
              }}>
              <View style={{paddingBottom: '20%'}}>
                {renderQuestionsSection()}
              </View>
            </ScrollView>
            {/* </KeyboardAvoidingView> */}
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
              {currentSectionIndex != 0 && (
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
                    {fontSize: 12},
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
              )}
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
          {loader && <Loader />}
        </SafeAreaView>
        {isNetworkError?.isNetworkError && <NetWorkErrorToast />}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    // marginHorizontal: 10,
  },
  leabel: {
    color: 'black',
    fontSize: 15.6,
    fontWeight: '500',
    paddingBottom: 5,
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
    marginBottom: 5,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'rgb(74, 24, 91)',
    alignSelf: 'center',
    borderRadius: 20,
    width: '45%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 0.5,
  },
  buttonText: {
    color: 'white',
    padding: 10,
  },
});

export default ParentForm;
