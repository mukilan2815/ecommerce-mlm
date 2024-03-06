import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Pages/Signup';
import SignUp2Screen from './Pages/Signup2';
import LoginScreen from './Pages/Login';
import CodeVerification from './Pages/CodeVerification';
import Home from './Pages/Home';
import PaymentPage from './Pages/PaymentPage1';
import Test from './Pages/Test';
import PaymentPage2 from './Pages/PaymentPage2';
import PaymentPage3 from './Pages/PaymentPage3';
import PaymentPage4 from './Pages/PaymentPage4';
import Confirmed from './Pages/ConfirmedPage';
import OrderPage from './Pages/Orderpage';
import Deals from './Pages/Deals';
import Category from './Pages/Category';
import Menswear from './Pages/Menswear';
import BottomBar from './Pages/BottomBar';
import Womenswear from './Pages/Womenswear';
import Groceries from './Pages/Groceries'; 
import Order from './Pages/Orders';
import ResetPasswordScreen from './Pages/Resetpassword';
import Sproduct from './Pages/Singleproduct';
import AllProduct from './Pages/Allproducts';
import Dashboard from './Pages/Dashboard';
import Filter from './Pages/Filter';
import Cart from './Pages/Cart';
import User from './Pages/User';
import ProductItem from './Pages/ProductItem';
import Gifts from './Pages/Gifts';
import Manager1 from './Pages/Manager1';
import Manager2 from './Pages/Manager2';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { UserProvider } from './Pages/UserContext';
import React, { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useEffect } from 'react';
import Forgetpassword from './Pages/Forgetpassword';
import ForgetUser from './Pages/forgetuser';
import axios from 'axios';


const Stack = createStackNavigator();


const checkIfLoggedIn = async () => {
  try {
    const storedUsername = await AsyncStorage.getItem("username");
    const storedPassword = await AsyncStorage.getItem("password");

    if (storedUsername && storedPassword) {
      try {
        const response = await axios.post(
          `http://192.168.37.132:8000/api/login/`,
          {
            username: storedUsername,
            password: storedPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Login Response:", response.data);

        if (response.data === 1) {
          return true;
        } else if (response.data['message'] === "Invalid Credentials") {
          return false;
        }
      } catch (error) {
        console.error("Login failed:", error.message);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default function App() { 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {            
        const storedUsername = await AsyncStorage.getItem("username");
        const storedPassword = await AsyncStorage.getItem("password");

        if (storedUsername && storedPassword) {
          try {
            const response = await axios.post(
              `http://64.227.134.220:8000/api/login/`,
              {
                username: storedUsername, 
                password: storedPassword,
              }, 
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }  
            );

            console.log("Login Response:", response.data);
      
            if (response.data === 1) {
              setIsLoggedIn(true);
            } else if (response.data['message'] === "Invalid Credentials") {
              setIsLoggedIn(false);
            }
          } catch (error) {  
            console.error("Login failed:", error.message);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    };

    checkAutoLogin();
  }, []);

  return ( 
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn?"Home":"Login"}>
          <Stack.Screen name="Order" component={Order} options={{headerShown: false}} />
          <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup2" component={SignUp2Screen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CodeVerification" component={CodeVerification} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Payment" component={PaymentPage} options={{ headerShown: false }} />
          <Stack.Screen name="Payment2" component={PaymentPage2} options={{ headerShown: false }} />
          <Stack.Screen name="Payment3" component={PaymentPage3} options={{ headerShown: false }} />
          <Stack.Screen name="Payment4" component={PaymentPage4} options={{ headerShown: false }} />
          <Stack.Screen name="confirmed" component={Confirmed} options={{ headerShown: false }} />
          <Stack.Screen name="TrackOrder" component={OrderPage} options={{ headerShown: false }} />
          <Stack.Screen name="Rest" component={Test} options={{ headerShown: false }} />
          <Stack.Screen name="Deals" component={Deals} options={{ headerShown: false }} />
          <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
          <Stack.Screen name="Menswear" component={Menswear} options={{ headerShown: false }} />
          <Stack.Screen name="Womenswear" component={Womenswear} options={{ headerShown: false }} />
          <Stack.Screen name="Groceries" component={Groceries} options={{ headerShown: false }} />
          <Stack.Screen name="SProduct" component={Sproduct} options={{ headerShown: false }} />
          <Stack.Screen name="ProductList" component={ProductItem} options={{ headerShown: false }} />
          <Stack.Screen name="AProduct" component={AllProduct} options={{ headerShown: false }} />
          <Stack.Screen name="Filter" component={Filter} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />  
          <Stack.Screen name="Gifts" component={Gifts} options={{ headerShown: false }} />
          <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
          <Stack.Screen name="Manager1" component={Manager1} options={{ headerShown: false }} />
          <Stack.Screen name="Manager2" component={Manager2} options={{ headerShown: false }} />
          <Stack.Screen name="BottomBar" component={BottomBar} />
          <Stack.Screen name="forgetuser" component={ForgetUser}  options={{headerShown:false}} />
          <Stack.Screen name="Forget" component={Forgetpassword} options={{headerShown:false}}/>
          <Stack.Screen name="Resetpass" component={ResetPasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
}

AppRegistry.registerComponent(appName, () => App);