import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, FlatList, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MedalliaDXA, DxaApp, DxaMask, MedalliaDxaCustomerConsentType, MedalliaDxaAutomaticMask } from 'dxa-react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';

import axios from 'axios';
import { SCREENS } from './screens';
import { List } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];

export default function App() {
  const navigationRef = useNavigationContainerRef();
  DxaApp.initialize(
    {
      accountId: 10010,
      propertyId: 250441,
      consents: MedalliaDxaCustomerConsentType.recordingAndTracking,
      manualTracking: false,
    },
    navigationRef
  );
  return (
    <DxaApp>
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
    </DxaApp>
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

        <AutoMaskingButtons />
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 1</Text>
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.push('Screen2')}
      />
      <ConsentsButtons />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      ></TextInput>
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
      <AutoMaskingButtons />
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
        onPress={() => MedalliaDXA.setConsents(MedalliaDxaCustomerConsentType.tracking)}
      />
      <Button
        title="Set consents to recording and tracking"
        onPress={() => MedalliaDXA.setConsents(MedalliaDxaCustomerConsentType.recordingAndTracking)}
      />
    </View>
  );
}

const AutoMaskingButtons = () => {
  return (
    <View>
      <Button
        title="MedalliaDxaAutomaticMask.text"
        onPress={() => MedalliaDXA.setAutoMasking(MedalliaDxaAutomaticMask.text)}
      />
      <Button
        title="MedalliaDxaAutomaticMask.images"
        onPress={() => MedalliaDXA.setAutoMasking(MedalliaDxaAutomaticMask.images)}
      />
      <Button title="MedalliaDxaAutomaticMask.inputs" onPress={() => MedalliaDXA.setAutoMasking(MedalliaDxaAutomaticMask.inputs)}
      />
      <Button title="MedalliaDxaAutomaticMask.webViews" onPress={() => MedalliaDXA.setAutoMasking(MedalliaDxaAutomaticMask.webViews)}
      />
      <Button title="MedalliaDxaAutomaticMask.all" onPress={() => MedalliaDXA.setAutoMasking(MedalliaDxaAutomaticMask.all)}
      />
      <Button
        title="disableAllAutoMasking"
        onPress={() => MedalliaDXA.disableAllAutoMasking()}
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

const styles = StyleSheet.create({
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

