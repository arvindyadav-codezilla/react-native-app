import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Switch,
  Alert,
} from "react-native";
import CaseLoadInfoHeader from "../../../components/molecules/CaseLoadInfoHeader";
import ReactNativeBiometrics from "react-native-biometrics";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBioMetric,
  setFaceLockEnabled,
  setFingerprintEnabled,
} from "../BiometricLogin/biometricSlice";
import DeviceInfo from "react-native-device-info";
import { storageDelete, storageRead, storageWrite } from "../../../utils/storageUtils";
import { updateUserBiometrics } from "../../../services/authServices";
import ToastHandler from "../../../components/atoms/ToastHandler";

const { width } = Dimensions.get("window");
const rnBiometrics = new ReactNativeBiometrics();

const UserSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { faceLockEnabled, fingerprintEnabled } = useSelector(selectBioMetric);
  const [biometryType, setBiometryType] = useState(null);
const [deviceToken, setDeviceToken] = useState("");
    const [isfingerPrint, setFingerPrintDetail] = useState(null);


  useEffect(() => {
    getDeviceToken();
    getCurrentFingerPrintStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeviceToken = async () => {
    try {
      const messaging = require("@react-native-firebase/messaging").default;
      const token = await messaging().getToken();
      setDeviceToken(token);
    } catch (error) {}
  };

  useEffect(() => {
    rnBiometrics.isSensorAvailable().then((result) => {
      const { available, biometryType } = result;
      if (available) {
        setBiometryType(biometryType);
      } else {
        setBiometryType(null);
      }
    });
  }, []);

   const getCurrentFingerPrintStatus = async () => {
  let useData = await storageRead("biometric_token");
  setFingerPrintDetail(useData === true || useData === "true");
};

const toggleFingerprint = async (value) => {
  try {
    const result = await rnBiometrics.simplePrompt({
      promptMessage: value
        ? "Authenticate to enable Fingerprint"
        : "Authenticate to disable Fingerprint",
    });

    if (!result.success) {
      return;
    }

    const device_id = await DeviceInfo.getUniqueId();
    let signature;

    if (value) {
      // Always delete and create new keys before signature
      await rnBiometrics.deleteKeys();
      await rnBiometrics.createKeys();

      const payload = Date.now().toString();
      const { success, signature: newSignature } = await rnBiometrics.createSignature({
        promptMessage: "Login with Biometrics",
        payload,
      });

      if (!success || !newSignature) {
        Alert.alert(
          "Failed",
          "User cancelled biometric prompt or signature failed"
        );
        return;
      }

      signature = newSignature;
      await storageWrite("biometric_device_token", signature);
    } else {
      // Disable: Use stored signature only
      signature = await storageRead("biometric_device_token");
      if (!signature) {
        Alert.alert("Error", "No biometric token found to disable.");
        return;
      }
    }

    const userData = {
      device_type: Platform.OS === "ios" ? "ios" : "Android",
      device_id,
      biometric_token: signature,
    };

    try {
      const resp = await updateUserBiometrics(userData);
      ToastHandler(`${resp?.data?.message}`);
      if (resp?.data?.status === 200) {
        if (resp?.data?.message === "Biometric disabled successfully") {
          await storageWrite("biometric_token", "false");
          dispatch(setFingerprintEnabled(false));
        } else if (resp?.data?.message === "Biometric enabled successfully") {
          await storageWrite("biometric_token", "true");
          dispatch(setFingerprintEnabled(true));
        } else {
          await storageWrite("biometric_token", "false");
          dispatch(setFingerprintEnabled(false));
        }
        getCurrentFingerPrintStatus();
      }
    } catch (error) {
      ToastHandler("Failed to update fingerprint setting");
    }
  } catch (error) {
    Alert.alert("Error", "Fingerprint authentication failed");
  }
};

  const toggleFaceLock = async (value) => {
    if (value) {
      try {
        const result = await rnBiometrics.simplePrompt({
          promptMessage: "Authenticate to enable Face Lock",
        });
        if (result.success) {
            await storageWrite('FACE_LOCK', 'true');
          dispatch(setFaceLockEnabled(true));
        }
      } catch {
        Alert.alert("Error", "Face Lock auth failed");
      }
    } else {
        await storageWrite('FACE_LOCK', 'false');
      dispatch(setFaceLockEnabled(false));
    }
  };

  console.log('isfingerPrint11111',isfingerPrint)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <CaseLoadInfoHeader
        icon={"chevron-down"}
        name={"User Settings"}
        iconSize={34}
        iconColor={"black"}
        iconFirstPress={() => {
          navigation.goBack();
        }}
        iconFirst={"chevron-left"}
      />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Biometric Options</Text>

        {(biometryType === "TouchID" || biometryType === "Biometrics") && (
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Fingerprint</Text>
            <Switch
             value={isfingerPrint === true || isfingerPrint === "true"}
              onValueChange={toggleFingerprint}
            />
          </View>
        )}

        {(biometryType === "FaceID" || biometryType === "Biometrics") && (
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Face Lock</Text>
            <Switch value={faceLockEnabled} onValueChange={toggleFaceLock} />
          </View>
        )}

        {!biometryType && (
          <Text style={{ color: "red" }}>Biometric not supported</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: "white",
    flex: 1,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionLabel: {
    fontSize: width * 0.04,
    color: "black",
  },
});

export default UserSettings;
