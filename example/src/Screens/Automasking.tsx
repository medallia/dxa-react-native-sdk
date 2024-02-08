import { MedalliaDXA, MedalliaDxaAutomaticMask } from "dxa-react-native";
import React from "react";
import { Button, View } from "react-native";

export function AutoMaskingScreen({ navigation }: { navigation: any }) {
   
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <AutoMaskingButtons></AutoMaskingButtons>
      </View>
    );
  }


export const AutoMaskingButtons = () => {
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