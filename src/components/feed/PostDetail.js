import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../actions';
import Post from './Post';

class PostDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.state.params.postData.user.name+`'s Post` || 'Post Detail',
        };
    };

    render() {
        const { navigation } = this.props;
        const postData = navigation.state.params.postData;
        
        return (
            <ScrollView>
                <Post 
                    postData={postData}
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);