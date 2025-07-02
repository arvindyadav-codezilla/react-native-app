import RNFetchBlob from 'react-native-blob-util';
import {PATHWAY_STATUS, SCOPE} from './constant';
import ToastHandler from '../components/atoms/ToastHandler';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

export const getStatusText = status => {
  switch (status) {
    case PATHWAY_STATUS.CASELOAD_CREATED:
      return {id: '1', status: 'Referral Received'};
    case PATHWAY_STATUS.SCHOOL_REPORT_RECEIVED:
      return {id: '2', status: 'Educational Report '};

    case PATHWAY_STATUS.PARENT_REPORT_RECEIVED:
      return {id: '3', status: 'Parent/Carer Report '};

    case PATHWAY_STATUS.TASK:
      return {id: '4', status: 'Task'};
    case PATHWAY_STATUS.READY_FOR_MDT_REVIEW:
      return {id: '5', status: 'Ready For Clinical Review'};
    case PATHWAY_STATUS.CASELOAD_CLOSED:
      return {id: '6', status: 'Referral Closed'};
    default:
      return 'Unknown Status';
  }
};

export const getPathWayStatus = status => {
  switch (status) {
    case PATHWAY_STATUS.CASELOAD_CREATED:
      return {id: '1', status: 'Referral Created'};
    case PATHWAY_STATUS.SCHOOL_REPORT_RECEIVED:
      return {id: '2', status: 'Education Report Received'};
    case PATHWAY_STATUS.PARENT_REPORT_RECEIVED:
      return {id: '3', status: 'Parent/Carer Report Received'};
    case PATHWAY_STATUS.TASK:
      return {id: '4', status: 'Task'};
    case PATHWAY_STATUS.READY_FOR_MDT_REVIEW:
      return {id: '5', status: 'Ready For Clinical Review'};
    case PATHWAY_STATUS.CASELOAD_CLOSED:
      return {id: '6', status: 'Referral Closed'};
    default:
      return 'Unknown Status';
  }
};

export const getTimeString = timestamp => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

export const getDateString = timestamp => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};
export const getFileExtension = url => {
  const fileName = url?.split('?')[0];
  const extension = fileName?.substring(fileName?.lastIndexOf('.') + 1);
  return extension;
};

export const getVideoUri = localFilePath => {
  if (Platform.OS === 'android') {
    return `file://${localFilePath}`;
  }
  return localFilePath;
};

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    try {
      PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS')
        .then(response => {
          if (!response) {
            PermissionsAndroid.request(
              'android.permission.POST_NOTIFICATIONS',
              {
                title: 'Notification',
                message:
                  'App needs access to your notification ' +
                  'so you can get Updates',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
          }
        })
        .catch(err => {});
    } catch (err) {}
  }
};

export const checkPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 33) {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (hasPermission) {
          return true;
        }
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to memory to download the file',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert(
            'Permission Required',
            'Storage permission is needed to download files. Please enable it from settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
              {text: 'Cancel', style: 'cancel'},
            ],
            {cancelable: false},
          );
        }
        return false;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const pdfDownloadDocument = async (url, documentName, status) => {
  status(true);
  let result = getFileExtension(url);
  let localFile;
  const hasPermission = await checkPermission();
  if (!hasPermission) {
    status(false);
    return;
  }
  if (Platform.OS === 'android') {
    localFile = `${RNFS.DownloadDirectoryPath}/${documentName}.${result}`;
  } else {
    localFile = `${RNFS.DocumentDirectoryPath}/${documentName}.${result}`;
  }
  const options = {
    fromUrl: url,
    toFile: localFile,
    fileCache: true,
  };
  ToastHandler('Downloading');

  if (await RNFS.exists(localFile)) {
    FileViewer.open(localFile)
      .then(res => {
        console.log('res', res);
        status(false);
      })
      .catch(error => {
        console.log('error', error);
        status(false);
        return false;
      });
    return true;
  } else {
    await RNFS.downloadFile(options)
      .promise.then(res => {
        ToastHandler('Downloaded Successfully');
        status(false);

        FileViewer.open(localFile);
      })
      .then(res => {
        status(false);
        return true;
      })
      .catch(error => {
        status(false);
      });
  }
};

export const handleDownloadDocument = async (document, status) => {
  try {
    status(true);

    const result = getFileExtension(document?.url);
    let localFile;
    const hasPermission = await checkPermission();

    if (!hasPermission) {
      status(false);
      return;
    }

    if (Platform.OS === 'android') {
      localFile = `${RNFS.DownloadDirectoryPath}/${document?.document_name}.${result}`;
    } else {
      localFile = `${RNFS.DocumentDirectoryPath}/${document?.document_name}.${result}`;
    }

    const options = {
      fromUrl: document.url,
      toFile: localFile,
      fileCache: true,
    };

    ToastHandler('Downloading');

    if (await RNFS.exists(localFile)) {
      await FileViewer.open(localFile);
    } else {
      await RNFS.downloadFile(options).promise;
      ToastHandler('Downloaded Successfully');
      await FileViewer.open(localFile);
    }
  } catch (error) {
  } finally {
    status(false);
  }
};

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to your storage to download files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export const camelCaseToUpperWords = camelCaseString => {
  if (typeof camelCaseString !== 'string') {
    throw new TypeError('Input must be a string');
  }

  return camelCaseString
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .toUpperCase();
};

export const transformCamelCaseToSpaces = str => {
  let result = str.replace(/([A-Z])/g, ' $1');
  result = result.replace(/\b\w/g, char => char.toUpperCase());
  return result.trim();
};

export const formatIsoDateToDDMMYYYY = isoDateString => {
  // Create a Date object from the ISO string
  const date = new Date(isoDateString);

  // Extract day, month, and year
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const year = date.getFullYear();

  // Format the date as DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

export const convertUriToBinary = async uri => {
  try {
    const response = await RNFetchBlob.fs.readFile(uri, 'base64');
    const binaryData = Buffer.from(response, 'base64');
    return binaryData;
  } catch (error) {
    console.error('Error converting URI to binary:', error);
    throw error;
  }
};

export const localFileString = async url => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      Alert.alert('MyCareBridge', 'Getting issue to view documents');
      throw new Error('Failed to download PDF document');
    }
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Data = reader?.result?.split(',')[1]; // Extract base64 data
      const {dirs} = RNFetchBlob.fs;
      const fileName = `document.${getFileExtension(url)}`;
      const path = `${dirs.DocumentDir}/${fileName}`;
      await RNFetchBlob.fs.writeFile(path, base64Data, 'base64');
      return path;
    };
  } catch (error) {
    console.error('Error downloading PDF document:', error);
  }
};

export const downloadDocxFile = async docsType => {
  let fileName;
  if (docsType === 'Education') {
    fileName = 'educationReport.docx';
  } else {
    fileName = 'parentReport.docx';
  }

  let sourcePath;
  let downloadDest;

  if (Platform.OS === 'android') {
    sourcePath = `utils/${fileName}`;
    downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
  } else if (Platform.OS === 'ios') {
    sourcePath = `${RNFS.MainBundlePath}/${fileName}`;
    downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  }

  const fileExists = await RNFS.exists(downloadDest);

  if (fileExists) {
    Alert.alert(
      'File Exists',
      `The file "${fileName}" already exists. Do you want to overwrite it?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Overwrite',
          onPress: async () => {
            await proceedWithDownload();
          },
        },
      ],
    );
  } else {
    await proceedWithDownload();
  }

  async function proceedWithDownload() {
    const baseFileName = fileName.split('.').slice(0, -1).join('.');
    const fileExtension = fileName.split('.').pop();

    let downloadDestWithIndex = downloadDest;
    let index = 1;

    while (await RNFS.exists(downloadDestWithIndex)) {
      downloadDestWithIndex = `${RNFS.DocumentDirectoryPath}/${baseFileName}_${index}.${fileExtension}`;
      index += 1;
    }

    ToastHandler('Downloading');
    try {
      if (Platform.OS === 'android') {
        const fileData = await RNFS.readFileAssets(sourcePath, 'base64');
        await RNFS.writeFile(downloadDestWithIndex, fileData, 'base64');
      } else if (Platform.OS === 'ios') {
        await RNFS.copyFile(sourcePath, downloadDestWithIndex);
      }
      ToastHandler('Downloaded Successfully');

      FileViewer.open(downloadDestWithIndex)
        .then(() => {})
        .catch(error => {});
    } catch (error) {
      ToastHandler('Download failed');
      Alert.alert('MyCareBridge', `Failed to download file: ${error.message}`, [
        {text: 'OK', onPress: () => {}},
      ]);
    }
  }
};
export const getOrganisationImageBase64 = async imagePath => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw error;
  }
};

export const replaceText = (type, text, cardSelected) => {
  if (!cardSelected || !cardSelected.patient_name) {
    return text;
  }

  let placeholder;

  switch (type) {
    case 'parent':
      placeholder = /\[forename\]/g;
      break;
    default:
      placeholder = /patient_name/g;
      break;
  }

  return text?.replace(placeholder, cardSelected?.patient_name);
};

export const separateDataByScope = data => {
  const separatedData = {};
  data?.forEach(entry => {
    const scope = entry.user.scope;
    const scopeName = Object.keys(SCOPE).find(key => SCOPE[key] === scope);

    if (!separatedData[scopeName]) {
      separatedData[scopeName] = [];
    }
    if (separatedData[scopeName].length < 3) {
      separatedData[scopeName].push(entry);
    }
  });
  return separatedData;
};

export const getFilePath = fileName => {
  const dirs = RNFetchBlob.fs.dirs;
  return Platform.OS === 'ios'
    ? `${dirs.MainBundleDir}/app/utils/TermsandPricacyDocs/${fileName}`
    : `file://${dirs.DocumentDir}/app/utils/TermsandPricacyDocs/${fileName}`;
};

export const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  return `${year}/${month}/${day}`;
};

export const downloadPDF = async ({
  fileName,
  fileData,
  mimeType = 'application/pdf',
}) => {
  try {
    const baseDir = `${RNFS.DownloadDirectoryPath}`;

    console.log('baseDir:', baseDir);
    console.log('fileName:', fileName);

    const dirExists = await RNFS.exists(baseDir);
    if (!dirExists) {
      await RNFS.mkdir(baseDir);
    }

    const getUniqueFileName = async (dir, name) => {
      let uniqueName = name;
      let count = 1;

      const [baseName, extension] = name.split(/(\.[^.]+$)/);
      while (await RNFetchBlob.fs.exists(`${dir}/${uniqueName}`)) {
        uniqueName = `${baseName} (${count})${extension}`;
        count++;
      }

      return uniqueName;
    };

    const uniqueFileName = await getUniqueFileName(baseDir, fileName);
    const filePath = `${baseDir}/${uniqueFileName}`;

    await RNFetchBlob.fs.writeFile(filePath, fileData, 'base64');

    if (Platform.OS === 'android') {
      RNFetchBlob.android.actionViewIntent(filePath, mimeType);
    } else {
      console.log('PDF downloaded successfully on iOS:', filePath);
    }

    return filePath;
  } catch (error) {
    throw error;
  }
};
