import {StyleSheet, Text, View, ActivityIndicator, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import colors from '../../theme/colors';
import Input from '../../components/Input';
import BtnComp from '../../components/BtnComp';
import GeneralHeader from '../../components/GeneralHeader';
import endpoint from '../../utils/endpoint';
import axios from 'axios';

const UpdateForgottenPassword = ({navigation, route}) => {
    const {userId} = route.params
    
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryConfirmPassword, setSecureTextEntryConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const updatePassword = () => {
    let data = new FormData();
    data.append('id', userId);
    data.append('password', form.password);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/update-forget-password`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data,
    };

    if(form.password.length > 0 && form.password === form.confirmPassword){
        setLoading(true)
        axios
        .request(config)
        .then(response => {
            setLoading(false)
          if (response.data.success) {
            console.log("Password update successfully ====>   ", response.data.data);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Your password updated successfully 😊',
            });
            navigation.navigate('Login');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Oops',
              text2: `${response.data.message} 👋`,
            });
          }
        })
        .catch(error => {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Oops',
                text2: `${error.message} 👋`,
            });
        });
    }else {
        Toast.show({
            type: 'error',
            text1: 'Oops',
            text2: `Password and Confirm Password does not match 😊`,
        });
    }

  };

  const onChangeText = (changedText, key) => {
    setForm(oldForm => {
      return {...oldForm, [key]: changedText};
    });
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}> 
      <GeneralHeader
        heading={'Update password'}
        onBackPress={() => navigation.goBack()}
      />
      <Text
        style={{
          width: wp('80%'),
          alignSelf: 'center',
          color: colors.themeBlack,
          fontSize: hp('2.5%'),
          marginTop: hp('15%'),
          marginBottom: 16,
        }}>
        Enter your new password
      </Text>
        <Text style={styles.subHeading}>Password</Text>
        <View style={styles.inputCont}>
            <Input
                placeholder={'8+ Characters'}
                value={form.password}
                onChangeText={changedText => onChangeText(changedText, 'password')}
                passwordField={true}
                secureTextEntry={secureTextEntry}
                onEyePress={() => setSecureTextEntry(!secureTextEntry)}
            />
        </View>

        <Text style={styles.subHeading}>Confirm Password</Text>
        <View style={styles.inputCont}>
            <Input
                placeholder={'Same as above'}
                value={form.confirmPassword}
                onChangeText={changedText => onChangeText(changedText, 'confirmPassword')}
                passwordField={true}
                secureTextEntry={secureTextEntryConfirmPassword}
                onEyePress={() => setSecureTextEntryConfirmPassword(!secureTextEntryConfirmPassword)}
            />
        </View>
      <BtnComp
        btnText={loading ? <ActivityIndicator size={'large'} color={'white'} /> : 'Done'}
        onPress={updatePassword}
        style={{width: wp('85%'), marginTop: 16, alignSelf: 'center'}}
      />
      </ScrollView>
    </View>
  );
};

export default UpdateForgottenPassword;

const styles = StyleSheet.create({
    inputCont: {
        width: '85%',
        alignSelf: 'center',
        marginVertical: 10,
      },
      subHeading: {
        color: '#7A86A1',
        fontSize: hp('2%'),
        width: wp('85%'),
        alignSelf: 'center',
        marginVertical: 5,
      },
});
