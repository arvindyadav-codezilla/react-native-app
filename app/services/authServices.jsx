import {api} from '../utils/api';
import {HEADER_TOKEN} from '../utils/credentials';

export async function loginUser(credentials) {
  return api.post(`auth/login`, credentials, {
    headers: HEADER_TOKEN,
    skipAuth: true,
  });
}

export async function loginUserUsingBiometric(credentials) {
  console.log(credentials,'credentials')
  return api.post(`auth/login/biometric`, credentials, {
    headers: HEADER_TOKEN,
    skipAuth: true,
  });
}

export async function otpServices(otp) {
  return api.post(`auth/validate-otp`, otp, {
    headers: HEADER_TOKEN,
    skipAuth: true,
  });
}
export async function forgotPasswordServices(data) {
  return api.post(`auth/forgot-password`, data, {
    headers: HEADER_TOKEN,
    skipAuth: true,
  });
}
export async function logout() {
  return api.get(`auth/logout`);
}
export async function updateUser(id, data) {
  return api.put(`user/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateUserBiometrics(data) {
  return api.put(`/user/update/biometrics`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function changePassword(data) {
  return api.post(`auth/change-password/`, data);
}
export async function updateEmail(data) {
  return api.post(`user/update-email`, data);
}
export async function verifyupdateEmailOtp(data) {
  return api.post(`user/verify/email-change`, data);
}
