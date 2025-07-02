export const TOKEN_EXP = {
  ACCESS_TOKEN: 8,
  REFRESH_TOKEN: 720,
};

export const STATUS = {
  ACTIVE: '1',
  INACTIVE: '2',
  NOT_REGISTERED: '3',
};

export const TASK_STATUS = {
  PENDING: '1',
  INPROGRESS: '2',
  DONE: '3',
};

export const REFERRAL_STATUS = {
  PENDING: '1',
  ACCEPTED: '2',
  REJECTED: '3',
};

export const PATHWAY_STATUS = {
  CASELOAD_CREATED: '1',
  SCHOOL_REPORT_RECEIVED: '2',
  PARENT_REPORT_RECEIVED: '3',
  TASK: '4',
  READY_FOR_MDT_REVIEW: '5',
  CASELOAD_CLOSED: '6',
};
export const TOOL_TIP_PATHWAY_STATUS = {
  REFERRAL_RECEIVED: '1',
  PARENT_CARER_REPORT_RECEIVED: '3',
  EDUCATIONAL_REPORT_RECEIVED: '2',
  TASK: '4',
  READY_FOR_CLINICAL_REVIEW: '5',
  OUTCOME_AGREED: '6',
};
export const SCOPE = {
  PD_SUPER_ADMIN: '1',
  PD_ADMIN: '2',
  CLIENT_ADMIN: '3',
  CLIENT_SUB_ADMIN: '4',
  CLINICIAN: '5',
  SCHOOL: '6',
  PARENT: '7',
  CHILD: '8',
  UNKNOWN: '9',
};

export const ROLE = {
  ALL_ACCESS: '1',
  RESTRICTED_ACCESS: '2',
  VIEW_ACCESS: '3',
  REJECTED: '3',
};

export const CLINICAL_REVIEW = {
  1: 'Pre-school child with only behavioural concerns',
  2: 'School-aged child with only behavioural concerns',
  3: 'Pre-school child under 3 years of age for My Care Bridge assessment',
  4: 'Child/Young Person referred for emotional and/or mental health issues',
  5: 'Child under the age of 6 years with possible ADHD symptoms',
  6: 'When a child is referred for sleep problems only',
  7: 'Rejected for the acute team',
  8: 'Young person over 17 years 4 months',
  9: 'GP Out of area',
};
