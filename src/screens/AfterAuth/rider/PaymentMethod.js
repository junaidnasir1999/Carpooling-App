import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setPackageBought} from '../../../redux/AuthSlice';
import colors from '../../../theme/colors';
import images from '../../../assets/images';
import BtnComp from '../../../components/BtnComp';
import GeneralHeader from '../../../components/GeneralHeader';
import ProfileHistoryBar from '../../../components/ProfileHistoryBar';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import endpoint from '../../../utils/endpoint';
import Modal from 'react-native-modal';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import database from '@react-native-firebase/database';
import Fontisto from 'react-native-vector-icons/Fontisto';

const PaymentMethod = ({navigation, route}) => {
  const Dispatch = useDispatch();

  const {packageHours, packageName} = route.params;
  const {token, data} = useSelector(state => state.authData);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [creditCardCreds, setCreditCardCreds] = useState({});

  const handleBuyingPackage = () => {
    let dataToBeAppend = new FormData();

    dataToBeAppend.append('package_name', packageName);
    dataToBeAppend.append('package_hours', packageHours);
    dataToBeAppend.append('txn_id', 'txn_id');
    dataToBeAppend.append('card_name', data.name);
    dataToBeAppend.append('card_num', creditCardCreds?.values?.number);
    dataToBeAppend.append('amount', 200);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/rider-package`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      data: dataToBeAppend,
    };

    if (creditCardCreds.valid) {
      setLoaderVisible(true);

      axios
        .request(config)
        .then(response => {
          if (response.data.success) {
            const userRef = database().ref(`/users/${data.id}`);

            database()
              .ref(`/users/${data.id}/hoursBalance`)
              .once('value')
              .then(async resp => {
                if (resp.exists()) {
                  const packageBoughtDetails = {
                    hoursBought: packageHours,
                    timeOfPurchase: JSON.stringify(new Date())
                  }
                  const packagesBought = await database().ref(`/users/${data.id}/packagesBought`).once('value').then(snapshot => snapshot.exists() ? snapshot.val() : [])
                  await userRef
                    .update({
                      hoursBalance: resp.val() + packageHours,
                      packagesBought: [...packagesBought, packageBoughtDetails]
                    })
                    .then(() => {
                      setLoaderVisible(false);
                      navigation.navigate('SelectHourBlock');
                      Dispatch(setPackageBought(true));
                    });
                } else {
                  userRef
                    .update({
                      hoursBalance: packageHours,
                    })
                    .then(() => {
                      setLoaderVisible(false);
                      navigation.navigate('SelectHourBlock');
                      Dispatch(setPackageBought(true));
                    });
                }
              });
          }
        })
        .catch(error => {
          setLoaderVisible(false);

          console.log(error);
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: 'Please choose a valid card 😊',
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'white',
          paddingBottom: hp('5%'),
        }}>
        <GeneralHeader
          onBackPress={() => navigation.navigate('Home')}
          heading={'Payment Method'}
        />
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
            marginBottom: 30,
          }}>
          <View style={{alignItems: 'center'}}>
            {
              data.profile_image ? (
                <Image
                  source={{
                    uri: `${endpoint}/assets/uploads/user/${data.profile_image}`,
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: 'grey',
                    borderRadius: 250,
                    resizeMode: 'cover',
                  }}
                />
              ) : (
                <Fontisto
                  name="person"
                  size={75}
                  color={'black'}
                  style={{alignSelf: 'center', padding: 10, borderRadius: 8, backgroundColor: 'lightgrey', overflow: 'hidden'}}
                />
              )
            }

            <Text style={{color: 'black', fontSize: hp('2.5%'), marginTop: 10}}>
              {data.name}
            </Text>
          </View>
        </View>

        <CreditCardInput
          onChange={changedText => setCreditCardCreds(changedText)}
        />

        <View
          style={{
            flexDirection: 'row',
            width: wp('85%'),
            marginTop: 60,
            justifyContent: 'space-around',
            alignSelf: 'center',
          }}>
          <View style={{width: wp('40%')}}>
            <BtnComp
              btnText={'Make Payment'}
              onPress={handleBuyingPackage}
              style={{borderWidth: 2, borderColor: colors.themeBlue}}
            />
          </View>
          <View style={{width: wp('40%')}}>
            <BtnComp
              onPress={() => navigation.goBack()}
              btnText={'Cancel'}
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: colors.themeBlue,
              }}
              textStyle={{color: colors.themeBlue}}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        coverScreen={false}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        isVisible={isLoaderVisible}
        style={{margin: 0}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={100} color={'white'} />
        </View>
      </Modal>
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
