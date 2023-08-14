import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import uuid from 'react-native-uuid'; //for generating random id, and it does not really matter for us
import { FontAwesome5 } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import { onSnapshot, query } from 'firebase/firestore';

const TimerScreen = () => {
 
  const auth = FIREBASE_AUTH;
  const uid = auth.currentUser.uid;
  const session_random = uuid.v4();

  const create = async (uid) => {
    try {
      await setDoc(doc(FIREBASE_DB, "timer-logs", uid, "sessions", session_random), {   
        sessionTopic: sessionTopic,
        sessionMemo: sessionMemo,
        userId: uid,
        sessionDuration: sessionDuration,
        sessionFinishTime: sessionFinishTime,
        sessionId: session_random,
        categoryName: selectedTaskParams,
        todoName: selectedTodo,
      });

    } catch (error) {
      console.log("Error writing document: ", error);
    }
  };

  const sendData = async () => {
    await create(uid); 
  };

  const navigation = useNavigation();
  const [time, setTime] = useState(1500); // 25 minutes in seconds ~ pomodoro style
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionMemo, setSessionMemo] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const [sessionDuration, setSessionDuration] = useState(0);
  const intervalRef = useRef(null);
  
  const [sessionType, setSessionType] = useState("25");
  const [dropdownEnabled, setDropdownEnabled] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskParams, setSelectedTaskParams] = useState(null);

  const now = new Date();
  const currentDay = now.toLocaleDateString('ko-KR');  //korean date format
  const currentTime = now.toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'});

  const currentDayTime = currentDay + " " + currentTime;  //we might change the formatting later
  const sessionFinishTime = currentDayTime;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);


  useEffect(() => {
    const user = auth.currentUser;
    if (selectedCategory) {
      console.log(selectedCategory);
      const tasksRef = collection(FIREBASE_DB, 'todo-list', user.uid, selectedCategory);
      const q = query(tasksRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksForCategory = [];
        snapshot.forEach((doc) => {
          tasksForCategory.push({
            label: doc.data().categoryItems,  
            value: doc.id  
          }); 
        });
        setTaskData(tasksForCategory);
      });
  
      return () => unsubscribe();  // Cleanup listener
    }
  }, [selectedCategory]);
  

  const data = [
    { label: 'Morning Routine', value: '1', color: 'blue' },
    { label: 'Sport', value: '1', color: 'beige' },
    { label: 'Learning', value: '1', color: 'red' },
  ];
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setIsPaused(false);
      setTime(prevTime => (prevTime === 1500)); // Switch between 25 minutes and 5 minutes
      setSessionTopic(""); // Clear the session topic input
      setSessionMemo(""); // Clear the session memo input
      togglePopup(); // Display the popup after the session ends
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, time]);

  const handleStart = (type) => {
    if (dropdownEnabled === true || type === "5" ) {
    setIsActive(true);
    setIsPaused(false);
    setSessionType(type);
    if (type === "25") { 
      setTime(1500); // 25 minutes in seconds ~ pomodoro style
    } else {
      setTime(300); // 5 minutes in seconds
    }
    const task = data.find((item) => item.value === selectedTask);
      if (task) {
        setSelectedTask(task.label);
      }
    }else {
      alert("Please select a task from the dropdown menu")
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (sessionType === "25") {
    togglePopup(); // Display the popup when the session is stopped
    }
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsPaused(false);

    
    setSessionDuration(
      sessionType === "25" ? 1500 - time : 300 - time
    ); // Calculate the session duration based on the sessionType

    setTime(sessionType === "25" ? 1500 : 300); // Reset time to 25 minutes or 5 minutes for the next session

    setSessionTopic(""); // Clear the session topic input
    setSessionMemo(""); // Clear the session memo input
    setDropdownEnabled(false);
    setSelectedTask("Select category");
  }

  const handleSave = () => {  
    // Save the session details to the database
    togglePopup(); // Close the popup
    sendData();
    navigation.navigate(ROUTES.TIMER_LOGS);
    setIsSaveDisabled(true);
  };


  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleSessionTopicChange = (text) => {
    setSessionTopic(text);
    setIsSaveDisabled(text.trim().length === 0); // Enable or disable the save button based on the session topic entry
  };


  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TIMER_LOGS)}>
        <View style={styles.iconTextContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="history" size={24} color="black" />
          </View>
          <Text style={styles.headerText}>History</Text>
        </View>
        </TouchableOpacity>
      
      </View>
      <TouchableOpacity
        style={styles.timerContainer}
        onPress={handleStart}
        // disabled={isActive}
        disabled={true}
      >
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        {!isActive ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={() => handleStart("25")}
            >
              <Text style={styles.buttonText}> Start</Text>
              <Text style={styles.buttonText}>25 min</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={() => handleStart("5")}
            > 
              <Text style={styles.buttonText}>Start</Text>
              <Text style={styles.buttonText}> 5 min</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={handlePause}
            >
              <Text style={styles.buttonText}>
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>
          </> 
        )}
      </View>
      <View>
        <Dropdown
                iconColor="black"
                activeColor="gray"
                labelField="label"
                valueField="value"
                colorField = "color"
                onChange={(item) => {
                  console.log(item);
                  setSelectedTask(item.label);
                  setSelectedTaskParams(item.label);
                  setSelectedCategory(item.label);
                  setDropdownEnabled(true);
                }}
                itemContainerStyle={{backgroundColor: '#fff',}}
                placeholder = {selectedTask ? selectedTask : "Select category"}
                style={{ width: 200, borderColor: 'black', borderWidth: 1, borderRadius: 10, padding: 10,}}
                data={data}
              />

          <Dropdown
                iconColor="black"
                activeColor="gray"
                labelField="label"
                valueField="value"
                onChange={(item) => {
                  setSelectedTodo(item.label);
                }}
                itemContainerStyle={{backgroundColor: '#fff',}}
                placeholder = {selectedTask ? selectedTask : "Select todo"}
                style={{ width: 200, borderColor: 'black', borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 10}}
                data={taskData}
              />
      </View>


      {isPopupVisible && (
        <Modal animationType="slide" transparent={true} visible={isPopupVisible} onRequestClose={togglePopup}>
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
            <TouchableOpacity style={styles.closeIconContainer} onPress={togglePopup}>
                <FontAwesome5 name="times" size={24} color="black" />
           </TouchableOpacity>
              <Text style={styles.popupText}>Todo</Text>
              <Text style={styles.durationText}>Duration: {Math.floor(sessionDuration / 60)} minutes {sessionDuration % 60} seconds</Text> 
              <TextInput
                style={styles.input}
                value={sessionTopic}
                onChangeText={handleSessionTopicChange}
                placeholder="Enter topic"
                editable={!isActive}
              />
              <TextInput
                style={styles.inputMemo}
                value={sessionMemo}
                onChangeText={setSessionMemo}
                placeholder="Enter memo"
                editable={!isActive}
              />
              <TouchableOpacity style={[styles.closeButton, isSaveDisabled && styles.disabledButton]} onPress={handleSave} disabled={isSaveDisabled}>
                <Text style={styles.closeButtonText}>Save</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,   //some changes are needed to adjust the size
  },
  timerCircle: {
    marginTop: -50,
    width: 200,
    height: 200,  //was changed to free spae for the dropdown
    borderRadius: 100,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  button: {
    marginTop: -30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: "#32CD32",
    marginRight: 10,
  },
  stopButton: {
    backgroundColor: "#FF0000",
    marginRight: 10,
  },
  pauseButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(100, 100, 100, 0.5)",
  },
  popup: {
    backgroundColor: "white",
    padding: 50,
    borderRadius: 10,
    alignItems: "center",
    width: '90%',
    // left: 0,
    // right: 0,
    // maxHeight: height / 1.2,   //size of the popUp box
    position: "relative",
    // bottom: 3,
  },
  popupText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    marginBottom: -30,
    padding: 10,
    backgroundColor: "#32CD32",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  inputMemo: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,   //size of the textinput for memo
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  header: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center', // Align child elements to the center
    marginRight: 10,
  },
  iconTextContainer: {
    alignItems: 'center', // Center the icon and text horizontally
  },
  iconContainer: {
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5, // Add some margin to separate the icon and text
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  durationText: {   // Newly added for the Duration text
    fontSize: 18,
    marginVertical: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 10,  // Makes it easier to tap
  },
});
