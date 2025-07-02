import {api} from '../utils/api';

export async function taskList(id) {
  return api.get(`task?page=1&search=&limit=10&caseload_id=${id}`);
}

export async function taskStatus(taskId, data, headers) {
  return api.post(`task/${taskId}/submit`, data, {headers: headers});
}
