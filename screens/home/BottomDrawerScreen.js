import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

const BottomDrawerScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Bottom Drawer Screen</Text>
    </SafeAreaView>
  );
};

export default BottomDrawerScreen;

const styles = StyleSheet.create({});






// import { useState } from "react"; 
// import { Image, Modal, View, Button, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

// const windowHeight = Dimensions.get('window').height;

// // Function to open the bottom sheet 
// const handleOpenBottomSheet = () => {
//   setIsBottomSheetOpen(true);
// };

// // Function to close the bottom sheet
// const handleCloseBottomSheet = () => {
//   setIsBottomSheetOpen(false);
// };

// // Function to toggle the bottom sheet
// export default function BottomDrawerScreen() {
//     const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    
//     return (
//         <View style={styles.container}>
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={isBottomSheetOpen}
//             onRequestClose={handleCloseBottomSheet}
//         >
//             <View style={styles.modalContainer}>
//             <View style={styles.modal}>
//                 <TouchableOpacity onPress={handleCloseBottomSheet}>
//                 <Text style={styles.closeButton}>X</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.modalText}>Bottom Drawer</Text>
//             </View>
//             </View>
//         </Modal>
//         <TouchableOpacity onPress={handleOpenBottomSheet}>
//             <Text style={styles.text}>Open Bottom Drawer</Text>
//         </TouchableOpacity>
//         </View>
//     );
//     }

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         text: {
//             fontSize: 20,
//             fontWeight: 'bold',
//         },
//         modalContainer: {
//             flex: 1,
//             justifyContent: 'flex-end',
//             alignItems: 'center',
//         },
//         modal: {    
//             height: windowHeight * 0.4,
//             width: '100%',
//             backgroundColor: 'white',
//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,
//             paddingVertical: 23,
//             paddingHorizontal: 25,
//             borderWidth: 1,
//             borderColor: 'red'
//         },
//         closeButton: {
//             alignSelf: 'flex-end',
//             fontSize: 20,
//             fontWeight: 'bold',
//         },
//         modalText: {
//             fontSize: 20,
//             fontWeight: 'bold',
//             marginTop: 20,
//         },
//         bottomSheet: {
//             position: 'absolute',
//             left: 0,
//             right: 0,
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             backgroundColor: 'white',
//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,
//             paddingVertical: 23,
//             paddingHorizontal: 25,
//             bottom: 0,
//             borderWidth: 1,
//             borderColor: 'red'
//         },
//     });