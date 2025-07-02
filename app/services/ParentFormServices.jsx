import {api} from '../utils/api';

export async function ParentFormSubmit(data, headers) {
  return api.post(`parent-report`, data, {headers: headers});
}
export async function ParentFormUpdate(data, id, headers) {
  return api.put(`parent-report/${id}`, data, {headers: headers});
}
