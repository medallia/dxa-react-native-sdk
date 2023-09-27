import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text } from 'react-native';
import { dxa, DxaScreen } from 'dxa-react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <DxaScreen name="HomeScreen">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.replace('Screen2')}
        />
      </View>
    </DxaScreen>
  );
}

function Screen2() {
  return (
    <DxaScreen name="Screen2">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Screen 2</Text>
      </View>
    </DxaScreen>
  );
}

export default function App() {

  initializeMedalliaDxaSdk();

  return (
    //<DxaApp accountId={10010} propertyId={250441} enabled={true} >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Screen1"
            component={HomeScreen}
            options={{ title: 'Screen 1' }}
          />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    //</DxaApp>
  );
}

function initializeMedalliaDxaSdk() {
  dxa.initialize(10010, 250441).then((result) => {
    console.log("DXA Sdk initialized:", result);
  }).catch((error) => {
    console.error("DXA Sdk initialization error:", error);
  });
}
