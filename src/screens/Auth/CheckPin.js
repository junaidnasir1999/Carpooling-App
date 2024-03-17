import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../theme/colors";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import axios from "axios";
import { useSelector } from "react-redux";
import BtnComp from "../../components/BtnComp";
import endpoint from "../../utils/endpoint";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Modal from 'react-native-modal';



const CheckPin = ({ navigation, route }) => {
  const {verifiedEmail, userId} = route.params;
  
  const [count, setCount] = useState(59);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false)

  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;
    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({index, value})}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }
    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const resendCode = () => {
    setCount(59)

    let data = new FormData();
    data.append('email', verifiedEmail);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/forget-password-email`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: data,
    };

    axios
    .request(config)
    .then(response => {
      if (response.data.success) {
        console.log("Forget Password Code ====>   ", response.data.data);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'A code has been sent to your email 😊',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: `${response.data.message} 👋`,
        });
      }
    })
    .catch(error => {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: `${error.message} 👋`,
      });
    });
  }


  const CheckingOtp = () => {
    let data = new FormData();
    data.append('id', userId);
    data.append('code', value);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${endpoint}/api/check-forget-password-code`,
      headers: { 
        'Content-Type': 'multipart/form-data'
      },
      data : data
    };

    setLoading(true)
    axios.request(config)
    .then((response) => {
      setLoading(false)
      if(response.data.success){
        navigation.navigate('UpdateForgottenPassword', {userId})
      }else {
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: `${response.data.message} 👋`,
        });
      }
    })
    .catch((error) => {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: `${error.message} 👋`,
      });
    });
  };

  useEffect(() => {
    if (count !== 0) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } 
  }, [count]);

  return (
    <View
      style={{ flex: 1, padding: 20, justifyContent: "center" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: colors.themeBlack,
            fontSize: hp("4%"),
          }}
        >
          Email Verification
        </Text>

        <Text style={{ color: colors.themeBlack, fontSize: hp("1.6%") }}>
          An email has been sent to your registered email address. Enter the
          verification code below:
        </Text>


        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        <Text style={{ color: colors.themeBlack, alignSelf: "center" }}>
          00 : {count}
        </Text>
   
        <Text style={{ alignSelf: "center", color: colors.themeBlack, marginTop: 20 }}>
          Didn't receive a code?
        </Text>

        <TouchableOpacity disabled={count > 0} onPress={resendCode} style={{alignSelf: 'center', padding: 5, marginTop: 7}}>
        <Text
          style={{
            alignSelf: "center",
            color: count <= 0 ? colors.themeBlack : 'rgba(0,0,0,0.3)',
            fontSize: hp("2%"),
            fontWeight: 'bold',
            borderBottomWidth: 2,
            borderBottomColor: 'grey'
          }}
        >
          Resend Code
        </Text>
        </TouchableOpacity>
        
        {
          value.length === 4 ? (
            <BtnComp
              btnText={'Verify'}
              onPress={() => CheckingOtp()}
              style={{marginTop: 30}}
            />
          ) : null
        }

      </ScrollView>

      <Modal
        animationIn={'bounceInUp'}
        animationOut={'bounceOutDown'}
        isVisible={loading}
      >
        <View >
          <ActivityIndicator color={'white'} size={100} />
        </View>
      </Modal>
    </View>
  );
};
export default CheckPin;

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: "black",
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.themeBlue,
    color: colors.themeBlack,
  },
  underlineStyleHighLighted: {
    borderColor: "#000000",
  },
  codeFieldRoot: {
    marginTop: 40,
    padding: 20,
  },
  cell: {
    width: 60,
    height: 60,
    lineHeight: 40,
    fontSize: 34,
    borderWidth: 2,
    borderColor: 'black',
    textAlign: 'center',
    borderRadius: 15,
    padding: 15,
    color: 'black',
  },
  focusCell: {
    borderColor: '#4E4B66',
  },
})