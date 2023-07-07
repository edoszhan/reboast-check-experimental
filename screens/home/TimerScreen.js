import React, { useState, useRef, useEffect } from "react";
import { Button,  View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { ROUTES } from '../../constants';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid'; //for generating random id, and it does not really matter for us

const TimerScreen = () => {

  const auth = FIREBASE_AUTH;

  uid = auth.currentUser.uid;
  const session_random = uuid.v4();



  // const create = async (uid) => {
  //   try {
  //     await setDoc(doc(FIREBASE_DB, "timer-logs", "sessions"), {
  //       sessionTopic: sessionTopic,
  //       sessionMemo: sessionMemo,
  //       sessionDuration: sessionDuration,
  //       sessionFinishTime: sessionFinishTime,
  //       userId: uid,
  //     });
  //   } catch (error) {
  //     console.log("Error writing document: ", error);
  //   }
  // };

  const create = async (uid) => {
    try {
      await setDoc(doc(FIREBASE_DB, "timer-logs", uid, "sessions",session_random), {  //session3 should not be manually entered, we need to update number of sessions
        sessionLog: session_random,  
        sessionTopic: sessionTopic,
        sessionMemo: sessionMemo,
        userId: uid,
        sessionDuration: sessionDuration,
        sessionFinishTime: sessionFinishTime,
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

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', {weekday: "long"});
  const currentTime = now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});

  const currentDayTime = currentDay + " " + currentTime;  //we might change the formatting later
  const sessionFinishTime = currentDayTime;

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
      setTime(prevTime => (prevTime === 1500 ? 300 : 1500)); // Switch between 25 minutes and 5 minutes
      setSessionTopic(""); // Clear the session topic input
      setSessionMemo(""); // Clear the session memo input
      togglePopup(); // Display the popup after the session ends
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, time]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    togglePopup(); // Display the popup when the session is stopped

    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsPaused(false);

    setSessionDuration(1500 - time); // Calculate the session duration
    setTime(1500); // Reset time to 25 minutes for the next session
    setSessionTopic(""); // Clear the session topic input
    setSessionMemo(""); // Clear the session memo input
  }

  const handleSave = () => {  
    // Save the session details to the database
    togglePopup(); // Close the popup
    console.log('sessionTopic', sessionTopic);  //data that we want to save on DB and fetch in Timerlogs
    console.log('sessionMemo', sessionMemo);   //data that we want to save on DB and fetch in Timerlogs
    console.log('sessionDuration', sessionDuration);  //data that we want to save on DB and fetch in Timerlogs
    sendData();
    navigation.navigate(ROUTES.TIMER_LOGS, {sessionTopic, sessionMemo, sessionDuration, sessionFinishTime});
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
      <View style={{ justifyContent: 'flex-end' }}>
      <Button title="History" onPress={() => navigation.navigate(ROUTES.TIMER_LOGS)} />
      </View>
      <TouchableOpacity
        style={styles.timerContainer}
        onPress={handleStart}
        disabled={isActive}
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
              onPress={handleStart}
            >
              <Text style={styles.buttonText}> Start</Text>
              <Text style={styles.buttonText}>25 min</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStart}
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
    width: 200,
    height: 200,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});

