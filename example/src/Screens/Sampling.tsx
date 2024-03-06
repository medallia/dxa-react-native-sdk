import { MedalliaDXA } from "dxa-react-native";
import React from "react";
import { Button, Text, View } from "react-native";

export function SamplingScreen({ navigation }: { navigation: any }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Sampling Screen</Text>
        <Text>Remember! these methods can be called once.</Text>
        <View style={{ height: 70 }}></View>
        <Text>Enable</Text>
        <Button title="SetRetention: true" onPress={() => MedalliaDXA.setRetention(true)} />

        <View style={{ height: 20 }}></View>
        <Text>Disable</Text>
        <Button title="SetRetention: false" onPress={() => MedalliaDXA.setRetention(false)} />

        <View style={{ height: 50 }}></View>
        <Button
          title="Go back"
          onPress={() => navigation.pop()}
        />
      </View>
    );
  }