import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


const TimerScreen = () => {
  const [time, setTime] = useState(1500); // 25 minutes in seconds ~ pomodoro style
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const intervalRef = useRef(null);

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
      setSessionCount((prevCount) => prevCount + 1);
      setTime(1500); // Reset time to 25 minutes for the next session
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
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsPaused(false);
    setSessionCount((prevCount) => prevCount + 1);
    setTime(1500); // Reset time to 25 minutes for the next session
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsPaused(false);
    setSessionCount(0);
    setTime(1500);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Reset</Text>
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

      <Text style={styles.sessionCount}>
        Session Count: {sessionCount}
      </Text>
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
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
  resetButton: {
    backgroundColor: "#e3e3e3",
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
  sessionCount: {
    fontSize: 16,
  }
});
