import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState, useEffect} from 'react';
import Input from '../../components/Input';
import colors from '../../theme/colors';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {login, makeLoadingFalse} from '../../redux/AuthSlice';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import BtnComp from '../../components/BtnComp';
import images from '../../assets/images';
import endpoint from '../../utils/endpoint';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

const Login = ({navigation, route}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const {loading} = useSelector(state => state.authData);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(makeLoadingFalse());
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      readCreds();
    });

    return unsubscribe;
  }, [navigation]);


  const onChangeText = (changedText, key) => {
    setForm(oldForm => {
      return {...oldForm, [key]: changedText};
    });
  };

  const storeCreds = async (email, password) => {
    const credentialsToBeSaved = {email, password};
    try {
      const jsonValue = JSON.stringify(credentialsToBeSaved);
      await AsyncStorage.setItem('@remembered_creds', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const readCreds = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@remembered_creds');
      let theRememberedCreds = jsonValue != null ? JSON.parse(jsonValue) : null;
      setForm({
        ...form,
        email: theRememberedCreds.email,
        password: theRememberedCreds.password,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = () => {
    let config = {
      email: form.email,
      password: form.password
    };

    if (!form.email || !form.password) {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: "You can't leave any field empty 👋",
      });
    } else {
      if (rememberMe) {
        storeCreds(form.email, form.password);
      }
      dispatch(login(config));
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <ScrollView style={{flexGrow: 1}}>
        <Text style={styles.heading}>Login</Text>

        <Text style={styles.subHeading}>Your email</Text>
        <View style={styles.inputCont}>
          <Input
            placeholder={'johndoe@example.com'}
            value={form.email}
            onChangeText={changedText => onChangeText(changedText, 'email')}
            keyboardType={'email-address'}
          />
        </View>

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

        <View
          style={{
            width: wp('85%'),
            alignSelf: 'center',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <BouncyCheckbox
              size={25}
              fillColor={colors.themeBlue}
              unfillColor="#FFFFFF"
              text="Remember me"
              isChecked={rememberMe}
              disableText={true}
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{
                fontFamily: 'JosefinSans-Regular',
                color: colors.themeBlue,
              }}
              onPress={isChecked => setRememberMe(isChecked)}
            />
            <Text
              style={{marginLeft: 10, color: '#7A86A1', fontSize: hp('2%')}}>
              Remember me
            </Text>
          </View>

        </View>

        <View
          style={{width: wp('85%'), alignSelf: 'center', marginVertical: 10}}>
          <BtnComp
            btnText={
              loading ? (
                <ActivityIndicator size={25} color={'white'} />
              ) : (
                'Login'
              )
            }
            // onPress={() => selectedOption === 'rider' ? navigation.navigate('RiderStack') : navigation.navigate('DriverStack')}
            onPress={handleLogin}
          />
        </View>

        <View
          style={{
            width: wp('85%'),
            alignSelf: 'center',
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: '#7A86A1', fontSize: hp('2%')}}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.5}
            style={{borderBottomWidth: 1, borderBottomColor: colors.themeBlue}}>
            <Text style={{fontSize: hp('2%'), color: colors.themeBlue}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: 'black',
    width: wp('85%'),
    alignSelf: 'center',
    marginTop: hp('6%'),
    marginBottom: hp('3%'),
  },
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
  bottomBtn: {
    width: wp('85%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 250,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});
