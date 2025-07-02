import {api} from '../utils/api';

export async function caseLoadsServices() {
  return api.get(`caseload?page=1&search=&limit=10&status=2,1,3`);
}
