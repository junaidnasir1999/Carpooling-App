import ImagePicker from 'react-native-image-crop-picker';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


export const imagePicker = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      resolve(image); // Resolve the promise with the selected image

    }).catch(err => {
      reject(err); // Reject the promise with the error
    });
  });
};

export const openCamera = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      resolve(image); // Resolve the promise with the selected image

    }).catch(err => {
      reject(err); // Reject the promise with the error
    });
  });
};

export const validateEmail = (email) => {
  if(email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )){
      return true
    }else {
      Toast.show({
        type: 'error',
        text1: 'Oops',
        text2: "Please enter a valid email 👋"
      })
    }
};

export const validatePassword = (password) => {
  if(password.length >= 8){
    return true
  }else {
    Toast.show({
      type: 'error',
      text1: 'Oops',
      text2: "Passowrd must be eight characters long 👋"
    })
  }
}

export const convertDateFormat = (inputDateStr) => {
  const parsedDate = new Date(inputDateStr);
  const formattedDate = parsedDate.toISOString().slice(0, 19).replace('T', ' ');

  return formattedDate;
};

export const calculateAvgRating = (ratingArray) => {
  let totalRating = 0
  for(let eachReview of ratingArray){
    totalRating += eachReview.rating
  }
  const avgRating = totalRating/ratingArray.length
  return totalRating ? avgRating.toFixed(1): 0;
}

export const convertToPresentableDate = (dateString) => {
  const parsedDate = new Date(dateString);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return parsedDate.toLocaleDateString('en-US', options);
}