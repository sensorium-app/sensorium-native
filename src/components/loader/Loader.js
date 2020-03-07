import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

class Loader extends Component {
    render() {
        return (
            <View style={styles.horizontal}>
                <ActivityIndicator size="large" color="#800080" />
            </View>
        );
    }
}

export default Loader;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  })