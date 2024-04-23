import { MedalliaDXA } from "dxa-react-native";
import React from "react";
import { Button, NativeModules, Text, View } from "react-native";
const {NativeBridge} = NativeModules;

export function ManualAnalyticsScreen({ navigation }: { navigation: any }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Manual Analytics Screen</Text>
        <View style={{ height: 70 }}></View>
        <Text>Goal</Text>
        <Button title="Send Goal 'Clicked Login'" onPress={() => MedalliaDXA.sendGoal('Clicked Login')} />
        <Button title="Send Goal 'Clicked Login' with Value '5'" onPress={() => MedalliaDXA.sendGoal('Clicked Login', 5)} />
        <View style={{ height: 20 }}></View>
        <Text>Dimensions</Text>
        <Button title="set dimension 'RN_string' to string 'ReactNative' " onPress={() => MedalliaDXA.setDimensionWithString('RN_string', 'ReactNative')} />
        <Button title="set dimension 'RN_bool' to bool 'true'" onPress={() => MedalliaDXA.setDimensionWithBool('RN_bool', true)} />
        <Button title="set dimension 'RN_number' to number '3'" onPress={() => MedalliaDXA.setDimensionWithNumber('RN_number', 3)} />
        <View style={{ height: 50 }}></View>
        <Text>Http Error</Text>
        <Button title="send http error '500' " onPress={() => MedalliaDXA.sendHttpError(500)} />
        <Button title="send error 'SIGKILL " onPress={() => MedalliaDXA.sendError('SIGKILL')} />
        <Button
          title="Go back"
          onPress={() => navigation.pop()}
        />
        <Button
          title='Crash'
          onPress={() => NativeBridge.crashApp()}
        ></Button>
      </View>
    );
  }