import { useEffect, useState, useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useSelector } from "react-redux";
import { selectBioMetric } from "./biometricSlice";
import { CommonActions } from '@react-navigation/native';
import ReactNativeBiometrics from "react-native-biometrics";
import { storageRead, storageWrite } from "../../../utils/storageUtils";
import DeviceInfo from "react-native-device-info";
import { loginUserUsingBiometric } from "../../../services/authServices";
import axios from "axios";

const rnBiometrics = new ReactNativeBiometrics();

const useBiometricLogin = ({
  navigation,
  setErrorValidation,
  formik,
  value,
}) => {
  const { faceLockEnabled, fingerprintEnabled } = useSelector(selectBioMetric);
  const [storageFaceLock, setStorageFaceLock] = useState(false);
  const [storageFingerprint, setStorageFingerprint] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [loading, setLodar] = useState(false);

  useEffect(() => {
    getDeviceToken();
    fetchStoragePrefs();
    checkBiometricSensor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeviceToken = async () => {
    try {
      const messaging = require("@react-native-firebase/messaging").default;
      const token = await messaging().getToken();
      setDeviceToken(token);
    } catch (error) {}
  };

  const fetchStoragePrefs = async () => {
    const storedFaceLock = await storageRead("FACE_LOCK");
    const storedFingerprint = await storageRead("biometric_token");
    setStorageFaceLock(storedFaceLock);
    setStorageFingerprint(storedFingerprint);
  };

  const checkBiometricSensor = () => {
    rnBiometrics
      .isSensorAvailable()
      .then(({ available }) => {
        if (!available) {
          console.log("Biometrics not supported");
        }
      })
      .catch((err) => {
        console.log("Biometric sensor check failed", err);
      });
  };

  // Biometric keys generate karo (zaruri for createSignature)
  const generateBiometricKeys = async () => {
    try {
      await rnBiometrics.deleteKeys(); // Purani keys delete karo
      const { publicKey } = await rnBiometrics.createKeys(); // Nayi keys banao
      if (publicKey) {
        console.log("Biometric public key generated:", publicKey);
      }
    } catch (e) {
      console.log("Error generating biometric keys", e);
    }
  };

  const tryBiometricLogin = useCallback(async () => {
    if (
      !(
        // faceLockEnabled ||
        // fingerprintEnabled ||
        // storageFaceLock ||
        storageFingerprint
      )
    ) {
      Alert.alert("Biometric not enabled");
      return;
    }

    try {
      setLodar(true);
    await generateBiometricKeys();
      const device_id = await DeviceInfo.getUniqueId();
       const biometricDeviceToken = await storageRead("biometric_device_token");
      const payload = `${Date.now()}`;
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: "Login with Biometrics",
        payload,
      });

      if (!success || !signature) {
        setLodar(false);
        Alert.alert(
          "Failed",
          "User cancelled biometric prompt or signature failed"
        );
        return;
      }
      const data = {
        grant_type: "access_token",
        biometric_token: biometricDeviceToken,
        access_token: biometricDeviceToken,
        device_type: Platform.OS === "ios" ? "ios" : "Android",
        device_id: device_id,
        device_token: deviceToken,
      };

      // Step 5: API call
      const response = await loginUserUsingBiometric(data);
      let result = response?.data?.data;
      if (response?.status === 200) {
        if (result?.mfa === true) {
          setErrorValidation && setErrorValidation("");
          navigation &&
            navigation.navigate("Auth", {
              screen: "otpScreen",
              params: {
                email: value?.email,
                data: data,
              },
            });
        } else {
          if (result?.organization?.logo) {
            const organizationImage = await getOrganisationImageBase64(
              result?.organization?.logo
            );
            result = {
              ...result,
              organization: {
                ...result.organization,
                logo: organizationImage,
              },
            };
          }

          await storageWrite("accessToken", result?.accessToken);
          await storageWrite("refreshToken", result?.refreshToken);
          await storageWrite("userDetails", result);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${result?.accessToken}`;
          setErrorValidation && setErrorValidation("");

          navigation &&
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "MyTabs" }],
              })
            );
        }

        formik && formik.resetForm();
      }
      setLodar(false);
    } catch (error) {
      setLodar(false);
      // Error message ko safe tarike se nikalein
      let message = "Something went wrong";
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }

      if ([400, 401, 404].includes(error?.statusCode)) {
        setErrorValidation && setErrorValidation(message);
      } else {
        Alert.alert("Login Error", message);
      }
    }
  }, [
    faceLockEnabled,
    fingerprintEnabled,
    storageFaceLock,
    storageFingerprint,
    deviceToken,
    navigation,
    setErrorValidation,
    formik,
    value,
  ]);

  return {
    tryBiometricLogin,
    loading,
  };
};

export default useBiometricLogin;
