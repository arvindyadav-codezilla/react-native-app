import {api} from '../utils/api';

export async function getDocumentList({id, isDownload = false}) {
  return api.get(`caseload/${id}/documents?download=${isDownload}`);
}
export async function uploadDocumet(data, headers, onUploadProgress) {
  return api.post(`upload`, data, {
    headers: headers,
    onUploadProgress: onUploadProgress,
  });
}
export async function viewVideoDocumentResource(data, headers) {
  return api.get(`resource/documents`, data, {headers: headers});
}
