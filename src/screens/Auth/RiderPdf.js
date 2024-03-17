import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import BtnComp from '../../components/BtnComp';

export default class RiderPdf extends React.Component {
    render() {

        return (
            <View style={styles.container}>
                <BtnComp btnText={'Go Back'} onPress={() => this.props.navigation.goBack()}  style={{position: 'absolute', bottom: 20, alignSelf: 'center', width: '90%'}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});