import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TodoInformation() {
    return (
        <View style={styles.container}> 
            <Text style={styles.text}>TodoInformation</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 100,
        paddingHorizontal: 30,
    },

    text: {
        fontSize: 30,
        fontWeight: 'bold',
    },  
});
