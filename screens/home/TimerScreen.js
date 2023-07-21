import React, { useState, useRef, useEffect } from "react";
import { Button,  View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { ROUTES } from '../../constants';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid'; //for generating random id, and it does not really matter for us
import { FontAwesome5 } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';

const TimerScreen = () => {
 
  const auth = FIREBASE_AUTH;

  uid = auth.currentUser.uid;
  const session_random = uuid.v4();

  const create = async (uid) => {
    try {
      await setDoc(doc(FIREBASE_DB, "timer-logs", uid, "sessions",session_random), {  //session3 should not be manually entered, we need to update number of sessions  
        sessionTopic: sessionTopic,
        sessionMemo: sessionMemo,
        userId: uid,
        sessionDuration: sessionDuration,
        sessionFinishTime: sessionFinishTime,
        sessionId: session_random,
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

  const now = new Date();
  const currentDay = now.toLocaleDateString('ko-KR');  //korean date format
  const currentTime = now.toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'});

  const currentDayTime = currentDay + " " + currentTime;  //we might change the formatting later
  const sessionFinishTime = currentDayTime;

  const data = [
    { label: 'Morning Routine', value: '1' },
    { label: 'Sport', value: '2' },
    { label: 'Learning', value: '3' },
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
    setIsActive(true);
    setIsPaused(false);
    setSessionType(type);
    if (type === "25") { 
      setTime(1500); // 25 minutes in seconds ~ pomodoro style
    } else {
      setTime(300); // 5 minutes in seconds
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

    // setSessionDuration(1500 - time); // Calculate the session duration
    // setTime(1500); // Reset time to 25 minutes for the next session
    setSessionTopic(""); // Clear the session topic input
    setSessionMemo(""); // Clear the session memo input
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
          <View style={styles.iconContainer}>
            <FontAwesome5 name="history" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>History</Text>
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
                labelField="label"
                valueField="value"
                onChange={(item) => {
                  console.log('working');
                }}
                placeholder=" Select todo task"
                style={{ width: 200, borderColor: 'black', borderWidth: 1, borderRadius: 10 }}
                data={data}
                // value={selectedCategory} //attemp to fix the dropdown items unselect
                // onChangeText={handleCategorySelect}
              />
      </View>


      {isPopupVisible && (
        <Modal animationType="slide" transparent={true} visible={isPopupVisible} onRequestClose={togglePopup}>
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupText}>Session Details</Text>
              <Text>Duration: {Math.floor(sessionDuration / 60)} minutes {sessionDuration % 60} seconds</Text> 
              <TextInput
                style={styles.input}
                value={sessionTopic}
                onChangeText={handleSessionTopicChange}
                placeholder="Enter session topic"
                editable={!isActive}
              />
              <TextInput
                style={styles.inputMemo}
                value={sessionMemo}
                onChangeText={setSessionMemo}
                placeholder="Enter session memo"
                editable={!isActive}
              />

              <TouchableOpacity style={styles.closeButton} onPress={togglePopup}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              
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
    padding: 100,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    maxHeight: height / 1.2,    //size of the popUp box
  },
  popupText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
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
  },
  iconContainer: {
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  headerText: {
    marginTop: 10,
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
