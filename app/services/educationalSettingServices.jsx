import {api} from '../utils/api';

export async function schoolReportDetails(id) {
  return api.get(`school-report?caseload_id=${id}`);
}

export async function EducationFormSubmit(data, headers) {
  return api.post(`school-report`, data, {headers: headers});
}
export async function EducationFormUpdate(data, id, headers) {
  return api.put(`school-report/${id}`, data, {headers: headers});
}
