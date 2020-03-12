import React, { Component } from 'react';
import { 
    View, Text, Button as NativeButton, StyleSheet, FlatList,
    SafeAreaView, Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { Icon } from 'react-native-elements';
import Post from './Post';
import Loader from './../loader/Loader';
import Styles from './../Styles';

const { height, width } = Dimensions.get('window');

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);

        this.addPost = this.addPost.bind(this);
        //this.renderFooter = this.renderFooter.bind(this);
        //this.renderHeader = this.renderHeader.bind(this);
        //this.retrieveMore = this.retrieveMore.bind(this);
    }

    componentWillMount() {
        this.props.fetchAuthUser();
        //this.props.fetchCluster();
        this.props.fetchClusterPosts();
    }

    renderPosts(){
        //if(this.props.mainClusterPosts && this.props.mainClusterPosts.posts.length > 0){
            
        //}
    }

    retrieveMore = () => {
        console.log('go for more...');
        /*this.setState({
            loading: true,
        })*/
        this.props.fetchMoreClusterPosts(this.props.mainClusterPosts.lastPostRef);
    }

    renderHeader = () => {
        try {
          return (
          <Text style={styles.headerText}>Welcome!</Text>
          )
        }
        catch (error) {
          console.log(error);
          return null;
        }
      };

    renderFooter = () => {
        try {
          // Check If refreshing
          if (this.props.mainClusterPosts.isRefreshing) {
            return (
              <Loader />
            )
          }
          else {
            return null;
          }
        }
        catch (error) {
          console.log(error);
          return null;
        }
      };

    addPost(){
        this.props.navigation.navigate('AddPost');
    }

    render() {
        return (
            (this.props.mainClusterPosts && this.props.mainClusterPosts.posts.length > 0) ?
                <SafeAreaView style={styles.container}>
                    <FlatList
                        extraData={this.props.mainClusterPosts.posts}
                        data={this.props.mainClusterPosts.posts}
                        renderItem={({ item }) => (
                            <Post 
                                key={item.idRef}
                                postData={item}
                            />
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0.2}
                        refreshing={this.props.mainClusterPosts.isRefreshing}
                    />
                    <View style={styles.floatingActionButton}>
                    <Icon
                            raised
                            reverse
                            name='plus'
                            type='antdesign'
                            color='purple'
                            onPress={this.addPost}
                        />
                    </View>
                </SafeAreaView> :
                <View style={Styles.container}>
                    <Loader />
                </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        //mainCluster: state.mainCluster,
        mainClusterPosts: state.mainClusterPosts,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'System',
        fontSize: 36,
        fontWeight: '600',
        color: '#000',
        marginLeft: 12,
        marginBottom: 12,
    },
    itemContainer: {
        height: 80,
        width: width,
        borderWidth: .2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    floatingActionButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});