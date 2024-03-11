import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, FlatList, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MedalliaDXA, DxaMask, MedalliaDxaCustomerConsentType, MedalliaDxaAutomaticMask, DxaUnmask } from 'dxa-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';

import axios from 'axios';
import { SCREENS } from './screens';
import { List } from 'react-native-paper';
import { WebviewScreen } from './Screens/Webview';
import { SamplingScreen } from './Screens/Sampling';
import { ManualAnalyticsScreen } from './Screens/ManualAnalytics';
import { SessionDataScreen } from './Screens/SessionData';
import { AutoMaskingScreen } from './Screens/Automasking';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];
export default function App() {
  const navigationRef = useNavigationContainerRef();
  MedalliaDXA.initialize(
    {
      accountId: 10010,
      propertyId: 250441,
      consents: MedalliaDxaCustomerConsentType.analyticsAndTracking,
      manualTracking: false,
    },
    navigationRef
  );
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Screens">
        <Stack.Screen
          name="Screens"
          component={Screens}
          options={{ title: 'Screens' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ title: 'Screen 1' }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{ title: 'Screen 2' }}
        />
        <Stack.Screen
          name="ScreenList"
          component={CharactersList}
          options={{ title: 'Characters' }}
        />
        <Stack.Screen
          name="SamplingScreen"
          component={SamplingScreen}
          options={{ title: 'Sampling Screen' }}
        />
        <Stack.Screen
          name="ManualAnalyticsScreen"
          component={ManualAnalyticsScreen}
          options={{ title: 'Manual Analytics Screen' }}
        />
        <Stack.Screen
          name="SessionDataScreen"
          component={SessionDataScreen}
          options={{ title: 'Session Data Screen' }} />

        <Stack.Screen
          name="WebviewScreen"
          component={WebviewScreen}
          options={{ title: 'Webview Screen' }}/>
        <Stack.Screen
          name="AutoMaskingScreen"
          component={AutoMaskingScreen}
          options={{ title: 'AutoMasking Screen' }}/>
        {SCREEN_NAMES.map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            getComponent={() => SCREENS[name].component}
            options={{ title: SCREENS[name].title }}
          />
        ))}

      </Stack.Navigator>
    </NavigationContainer>

  );
}

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

function Screens({ navigation }: { navigation: any }) {
  return (
    <View>
      <ScrollView>

        
        <Button
          title='Go to Screen 1'
          onPress={() => navigation.push('Screen1')} />
        {SCREEN_NAMES.map((name) => (
          <List.Item
            key={name}
            title={SCREENS[name].title}
            onPress={() => {
              navigation.navigate(name);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

////////////////////
function Screen1({ navigation }: { navigation: any }) {
  return (
    <View nativeID="nativeID" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text nativeID="nativeID">Screen 1</Text>
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.push('Screen2')}
      />
      <Button
        title='Go to Sampling Screen'
        onPress={() => navigation.push('SamplingScreen')} />
      <Button
        title='Go to Manual Analytics Screen'
        onPress={() => navigation.push('ManualAnalyticsScreen')} />
      <Button
        title='Go to Session Data Screen'
        onPress={() => navigation.push('SessionDataScreen')} />
      <Button
        title='Go to Webview Screen'
        onPress={() => navigation.push('WebviewScreen')} />

      <Button
      title='Go to Automasking Screen'
      onPress={() => navigation.push('AutoMaskingScreen')} />
      <ConsentsButtons />
      <View style={{ height: 70 }}></View>
      <Text>*****</Text>
      <Text>Text inputs for maasking test</Text>
      <Text>This input is Unmasked...</Text>
      <DxaUnmask>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        ></TextInput>
      </DxaUnmask>
      <Text>... but this input is not</Text>
      <TextInput nativeID="nativeID"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} />
      <Image
        style={{ height: 50, width: 50 }}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <Text numberOfLines={5}>This text is visible</Text>

    </View>
  );
}

function Screen2({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 2</Text>
      <DxaMask>
        <Text>This text should not be visible</Text>
      </DxaMask>
      
      <Button
        title="Go to Characters List"
        onPress={() => navigation.push('ScreenList')}
      />
      <ConsentsButtons />

    </View>
  );
}




function CharactersList() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://rickandmortyapi.com/api/character'
        );
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <FlatList
      data={characters}
      keyExtractor={(item: ListItem) => item.id}
      renderItem={({ item }) => <CharacterItem item={item} />}
    />
  );
}

const ConsentsButtons = () => {
  return (
    <View>
      <Button
        title="Set consents none"
        onPress={() => MedalliaDXA.setConsents(MedalliaDxaCustomerConsentType.none)}
      />
      <Button
        title="Set consents to only tracking"
        onPress={() => MedalliaDXA.setConsents(MedalliaDxaCustomerConsentType.analytics)}
      />
      <Button
        title="Set consents to recording and tracking"
        onPress={() => MedalliaDXA.setConsents(MedalliaDxaCustomerConsentType.analyticsAndTracking)}
      />
    </View>
  );
}


function Feed({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.push('Screen2')}
      />
    </View>
  );
}

function Messages({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text>Messages Screen</Text>
      <Button
        title="Go to Screen 1"
        onPress={() => navigation.push('Screen1')}
      />
    </View>
  );
}

interface ListItem {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

const CharacterItem: React.FC<{ item: ListItem }> = ({ item }) => {
  return (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <DxaMask>
        <Text style={styles.text}>{item.name}</Text>
      </DxaMask>
    </View>
  );
};

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

