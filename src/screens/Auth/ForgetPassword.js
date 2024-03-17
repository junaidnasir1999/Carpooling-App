import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
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

const ForgetPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyEmail = () => {
    let data = new FormData();
    data.append('email', email);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/forget-password-email`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data,
    };

    if(email.length > 0){
        setLoading(true)
        axios
        .request(config)
        .then(response => {
            setLoading(false)
          if (response.data.success) {
            console.log("Forget Password Code ====>   ", response.data.data);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'A code has been sent to your email 😊',
            });
            navigation.navigate('CheckPin', {verifiedEmail: email, userId: response.data.data.id});
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
            text2: `Please enter an email 😊`,
        });
    }

  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <GeneralHeader
        heading={'Verify your email'}
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
        Enter your registered email
      </Text>
      <Input
        value={email}
        onChangeText={changedText => setEmail(changedText)}
        placeholder="example@gmail.com"
        keyboardType={'email-address'}
      />
      <BtnComp
        btnText={loading ? <ActivityIndicator size={'large'} color={'white'} /> : 'Verify'}
        onPress={verifyEmail}
        style={{width: wp('85%'), marginTop: 16}}
      />
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({});
