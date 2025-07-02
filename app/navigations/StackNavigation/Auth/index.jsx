import { createStackNavigator } from "@react-navigation/stack";
import Login from "../../../containers/Authentication/Login";
import Forgot from "../../../containers/Authentication/Forgot";
import OtpScreen from "../../../containers/Authentication/OtpScreen";

const Stack = createStackNavigator();

const Auth = () => {
    
    return (
      <Stack.Navigator initialRouteName="login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="forgot" component={Forgot} />
        <Stack.Screen name="otpScreen" component={OtpScreen} />
      </Stack.Navigator>
    );
  };
  export default Auth;