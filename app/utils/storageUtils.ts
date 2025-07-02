import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageWrite = async (itemName: string, itemValue: any) => {
  try {
    const jsonItem = JSON.stringify(itemValue);
    await AsyncStorage.setItem(itemName, jsonItem);
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
  }
};

export const storageRead = async (itemName: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(itemName);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
  }
};

export const storageDelete = async (itemName: string) => {
  try {
    await AsyncStorage.removeItem(itemName);
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
  }
};

// export const wipeStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//   } catch (error) {
//     if (error instanceof Error) {
//       throw error
//     }
//   }
// };

export const wipeStorage = async () => {
  try {
    const biometricToken = await AsyncStorage.getItem('biometric_token');
     const biometric_device_token = await AsyncStorage.getItem('biometric_device_token');
    await AsyncStorage.clear();
    if (biometricToken !== null && biometric_device_token !== null) {
      await AsyncStorage.setItem('biometric_token', biometricToken);
          await AsyncStorage.setItem('biometric_device_token', biometric_device_token);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
