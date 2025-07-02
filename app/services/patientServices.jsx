import {api} from '../utils/api';
import {Buffer} from 'buffer';
export async function patientServices(id, token) {
  let header = {
    Authorization: `Bearer ${token}`,
  };
  return api.get(`caseload/${id}`, header);
}
export const getPdfServices = async (
  report_type,
  unique_id,
  caseload_id,
  ismdt = false,
) => {
  const response = await api.get(
    ismdt
      ? `reports/download?report_type=${report_type}&&caseload_id=${caseload_id}`
      : `reports/download?report_type=${report_type}&&unique_id=${unique_id}&&caseload_id=${caseload_id}`,
    {responseType: 'arraybuffer'},
  );
  return {
    hedaer: response.headers.filename,
    data: Buffer.from(response.data, 'binary').toString('base64'),
  };
};
