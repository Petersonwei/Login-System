// App.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the error messages object
interface Errors {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email?: string;
}

const App: React.FC = () => {
  // State hooks for form fields and error messages
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFirstName = await AsyncStorage.getItem('firstName');
        const savedLastName = await AsyncStorage.getItem('lastName');
        const savedMobileNumber = await AsyncStorage.getItem('mobileNumber');
        const savedEmail = await AsyncStorage.getItem('email');
        
        if (savedFirstName) setFirstName(savedFirstName);
        if (savedLastName) setLastName(savedLastName);
        if (savedMobileNumber) setMobileNumber(savedMobileNumber);
        if (savedEmail) setEmail(savedEmail);
      } catch (e) {
        console.error(e); // Handle errors in loading data
      }
    };

    loadData();
  }, []);

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email || !emailRegex.test(email)) newErrors.email = 'Enter a valid email address';
    if (!mobileNumber || !phoneRegex.test(mobileNumber)) newErrors.mobileNumber = 'Enter a valid 10-digit phone number';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Save validated data to AsyncStorage
  const saveData = async () => {
    if (!validate()) return; // Do not save if validation fails

    try {
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('mobileNumber', mobileNumber);
      await AsyncStorage.setItem('email', email);

      Alert.alert('Success', 'Contact details saved successfully!');
    } catch (e) {
      console.error(e); // Handle errors in saving data
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name</Text>
      <TextInput
        style={[styles.input, errors.firstName && styles.errorInput]}
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      
      <Text>Last Name</Text>
      <TextInput
        style={[styles.input, errors.lastName && styles.errorInput]}
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
      
      <Text>Mobile Phone Number</Text>
      <TextInput
        style={[styles.input, errors.mobileNumber && styles.errorInput]}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
      
      <Text>Email Address</Text>
      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      
      <Button title="Save" onPress={saveData} />
    </View>
  );
}

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;
