import {api} from '../utils/api';

export async function patientReportDetails(id) {
  return api.get(`parent-report?caseload_id=${id}`);
}
