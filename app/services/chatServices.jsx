import {api} from '../utils/api';

export async function conversationHistory(id) {
  return api.get(`conversations/${id}`);
}
export async function getScopeChatMember(scopeId) {
  return api.get(`user?scope=${scopeId}`);
}
export async function createConversation(data, headers) {
  return api.post(`conversations`, data, {headers: headers});
}
export async function sendMessageServices(data, headers) {
  return api.post(`messages`, data, {headers: headers});
}
export async function messageHistory(id, page, limit) {
  return api.get(`messages/conversation/${id}?page=${page}&&pageSize=${limit}`);
}
