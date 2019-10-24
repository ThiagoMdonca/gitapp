import React,{Component} from 'react';

import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import api from '../../services/api'
import PropTypes from 'prop-types'
// import styles from './styles';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'
import OrganizationItem from './OrganizationItem';
import styles from './styles';
const  TabIcon = ({tintColor}) => <Icon name="building" size={20}  color={tintColor} />;

TabIcon.prototypes ={
   tintColor:  PropTypes.string.isRequired,

}

export default class Organizations extends Component {

    static navigationOptions = {
        tabBarIcon: TabIcon,

    }
    state = {
        data: [],
        loading: true,
        refreshing: false,
    };

    componentDidMount() {
        this.loadOrganizations();
    }

    loadOrganizations = async () => {
        this.setState({ refreshing: true });

        const username = await AsyncStorage.getItem('@Githuber:username');

        const { data } = await api.get(`/users/${username}/orgs`);

        this.setState({ data, loading: false, refreshing: false });
    };

    renderListItem = ({ item }) => <OrganizationItem organization={item} />;

    renderList = () => {
        const { data, refreshing } = this.state;

        return (
            <FlatList
                data={data}
                keyExtractor={item => String(item.id)}
                renderItem={this.renderListItem}
                numColomns={2}
                columnWrapper={styles.columnWrapper}
                onRefresh={this.loadOrganizations}
                refreshing={refreshing}
            />
        );
    };

    render() {
        const { loading } = this.state;
        return (
            <View style={styles.container}>
                <Header title="Organizações" />
                {loading ? <ActivityIndicator style={styles.loading} /> : this.renderList()}
            </View>
        );
    }
}
