import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

const TimerLogs = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [isSaved, setIsSaved] = useState(false);


  const [selected, setSelected] = React.useState("");
  
  const data = [
      {key:'1', value:'Spanish', disabled:false},
      {key:'2', value:'Coding'},
      {key:'3', value:'Sports'},
      {key:'4', value:'Free time', disabled:false},
      {key:'5', value:'Hobbie'},
  ]

  const addCategory = () => {
    if (selectedCategory) {
      const newCategory = {
        name: selectedCategory,
      };
      setCategories([...categories, newCategory]);
      setSelectedCategory('');
    }
  };

  const saveTopic = () => {
    if (topic.trim() !== '') {
      setIsSaved(true);
      Alert.alert('Topic Saved', 'The topic has been saved successfully.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topic: {topic}</Text>
      <TextInput
        style={[styles.input, isSaved && styles.disabledInput]}
        placeholder="Enter topic"
        value={topic}
        onChangeText={value => !isSaved && setTopic(value)}
        editable={!isSaved}
      />
      <SelectList 
        setSelected={(val) => setSelected(val)} 
        data={data} 
        save="value"
       />
      {!isSaved && (
        <Button title="Save" onPress={saveTopic} />
      )}
      {/* <Button title="Add Category" onPress={addCategory} disabled={isSaved} />
      <ScrollView style={styles.categoryList}>
        {categories.map((category, index) => (
          <View key={index} style={styles.category}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </ScrollView> */}
  
    </View>
  );
};

export default TimerLogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  disabledInput: {
    backgroundColor: '#e3e3e3',
  },
  categoryList: {
    marginTop: 20,
    maxHeight: 200,
  },
  category: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#e3e3e3',
  },
  categoryText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
