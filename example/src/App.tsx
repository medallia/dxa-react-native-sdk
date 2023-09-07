import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text } from 'react-native';
import * as DXA from 'dxa-react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({navigation}: {navigation: any}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
}

function Screen2() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 2</Text>
    </View>
  );
}

export default function App() {

  const navigationRef = useNavigationContainerRef();

  navigationRef.addListener('state', (state) => {
    console.log("State", state)
  });

  const [result, setResult] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    DXA.initialize(10010, 250441).then(setResult);
  }, []);

  console.log(`Initialized: ${result}`)

  if (result == true) {
    notifyDxaNavContainerState(navigationRef.getCurrentRoute()?.name ?? "unknow");
  }

  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange} onReady={onReadyNav}>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={HomeScreen}
          options={{ title: 'Screen 1' }}
        />
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function onStateChange(state : any) {
  console.log('New state is', state);
  const currentIndex = state.index;
  const screenName = state.routeNames[currentIndex];
  console.log('Current index:', currentIndex);
  console.log('Current name:', screenName);
  notifyDxaNavContainerState(screenName);
}

function onReadyNav() {
  console.log('On ready');
}

function notifyDxaNavContainerState(screenName: string) {
  DXA.stoptScreen();
  DXA.startScreen(screenName);
}
