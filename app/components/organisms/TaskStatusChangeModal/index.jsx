// // import React, {useEffect, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   StyleSheet,
// //   TouchableOpacity,
// //   KeyboardAvoidingView,
// //   Platform,
// // } from 'react-native';
// // import Button from '../../atoms/Button';
// // import Modal from 'react-native-modal';
// // const TaskStatusChangeModal = ({visible, onClose, onSubmit}) => {
// //   const [comment, setComment] = useState('');

// //   useEffect(() => {
// //     if (visible) {
// //       setComment('');
// //     }
// //   }, [visible]);

// //   const handleSubmit = () => {
// //     onSubmit(comment);
// //     setComment('');
// //   };

// //   return (
// //     <Modal visible={visible} animationType="slide" transparent>
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         style={styles.modalContainer}>
// //         <View style={styles.modalContent}>
// //           <View style={styles.header}>
// //             <Text style={styles.title}>Submit Task</Text>
// //             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
// //               <Text style={styles.closeButtonText}>X</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <TextInput
// //             style={styles.input}
// //             placeholderTextColor={'black'}
// //             onChangeText={text => {
// //               setComment(text);
// //             }}
// //             value={comment}
// //             multiline
// //             placeholder="Enter your comment"
// //           />
// //           <Button
// //             title="Submit"
// //             onPress={() => {
// //               handleSubmit();
// //             }}
// //             backgroundColor={'#6A2382'}
// //             textStyle={{padding: 9}}
// //           />
// //         </View>
// //       </KeyboardAvoidingView>
// //     </Modal>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 30,
// //     borderRadius: 10,
// //     margin: 20,
// //     width: '80%',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingBottom: 20,
// //     alignItems: 'center',
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: 'black',
// //   },
// //   closeButton: {
// //     backgroundColor: '#6A2382',
// //     height: 30,
// //     width: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   closeButtonText: {
// //     color: 'white',
// //   },
// //   input: {
// //     height: 120,
// //     borderColor: 'gray',
// //     borderWidth: 1,
// //     borderRadius: 5,
// //     marginBottom: 10,
// //     paddingHorizontal: 10,
// //     color: 'black',
// //     textAlignVertical: 'top',
// //   },
// // });

// // export default TaskStatusChangeModal;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import Button from '../../atoms/Button';
// import Modal from 'react-native-modal';

// const TaskStatusChangeModal = ({visible, onClose, onSubmit}) => {
//   const [comment, setComment] = useState('');

//   useEffect(() => {
//     if (visible) {
//       setComment('');
//     }
//   }, [visible]);

//   const handleSubmit = () => {
//     onSubmit(comment);
//     setComment('');
//     onClose();
//   };

//   return (
//     <Modal isVisible={visible} animationType="slide" transparent>
//       {/* <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.modalContainer}> */}
//       <View style={styles.modalContent}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Submit Task</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//         </View>
//         <TextInput
//           style={styles.input}
//           placeholderTextColor={'black'}
//           onChangeText={text => {
//             setComment(text);
//           }}
//           value={comment}
//           // multiline
//           placeholder="Enter your comment"
//         />
//         <Button
//           title="Submit"
//           onPress={() => {
//             handleSubmit();
//           }}
//           backgroundColor={'#6A2382'}
//           textStyle={{padding: 9}}
//           style={{borderRadius: 5}}
//         />
//       </View>
//       {/* </KeyboardAvoidingView> */}
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 30,
//     borderRadius: 10,
//     margin: 20,
//     width: '80%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   closeButton: {
//     backgroundColor: '#6A2382',
//     height: 30,
//     width: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 15,
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   input: {
//     height: 120,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     color: 'black',
//     textAlignVertical: 'top',
//   },
// });

// export default TaskStatusChangeModal;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button from '../../atoms/Button';
import Modal from 'react-native-modal';

const TaskStatusChangeModal = ({visible, onClose, onSubmit}) => {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (visible) {
      setComment('');
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard={true}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Submit Task</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholderTextColor={'black'}
          onChangeText={setComment}
          value={comment}
          multiline
          placeholder="Enter your comment"
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          backgroundColor={'#6A2382'}
          textStyle={{padding: 9}}
          style={{borderRadius: 5}}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#6A2382',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    textAlignVertical: 'top',
  },
});

export default TaskStatusChangeModal;
