import React, { Component } from 'react';
import { 
    View , Text,
} from 'react-native';
import Styles from './../Styles';

class ServiceUnavailable extends Component {
    render() {
        return (
            <View style={[{backgroundColor: 'white', height:'100%'}, Styles.container]}>
                <Text style={Styles.titleText}>Resource limit exceeded</Text>
                <Text style={Styles.mediumSizedText}>The app has been temporarily suspended.</Text>

                <View style={[Styles.box, {justifyContent: 'center'}]}>
                    <Text style={[Styles.mediumSizedText, {margin: 15,}]}>This is a general suspension due to a big amount of traffic, which means that it is not only for you! We are so sorry for this inconvinience.</Text>
                    <Text style={[Styles.mediumSizedText, {margin: 15,}]}>The reason for this is that the Sensorium app is a self-funded project and when the costs start getting too high, we suspend the services for a specific day.</Text>
                </View>
                <Text style={[Styles.mediumSizedText, {margin: 25,}]}>We hope to see you back again tomorrow.</Text>
            </View>
        );
    }
}

export default ServiceUnavailable;