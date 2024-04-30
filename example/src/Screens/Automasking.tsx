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
        onPress={() => MedalliaDXA.enableAutoMasking(MedalliaDxaAutomaticMask.text)}
      />
      <Button
        title="MedalliaDxaAutomaticMask.images"
        onPress={() => MedalliaDXA.enableAutoMasking(MedalliaDxaAutomaticMask.images)}
      />
      <Button title="MedalliaDxaAutomaticMask.inputs" onPress={() => MedalliaDXA.enableAutoMasking(MedalliaDxaAutomaticMask.inputs)}
      />
      <Button title="MedalliaDxaAutomaticMask.webViews" onPress={() => MedalliaDXA.enableAutoMasking(MedalliaDxaAutomaticMask.webViews)}
      />
      <Button title="MedalliaDxaAutomaticMask.all" onPress={() => MedalliaDXA.enableAutoMasking(MedalliaDxaAutomaticMask.all)}
      />
      <Button
        title="disableAllAutoMasking"
        onPress={() => MedalliaDXA.disableAutoMasking(MedalliaDxaAutomaticMask.all)}
      />
      <Button
        title='Set masking color black'
        onPress={() => MedalliaDXA.setMaskingColor('#000000')} />
      <Button
        title='Set masking color red #FF0000'
        onPress={() => MedalliaDXA.setMaskingColor('#FF0000')} />
    </View>
  );
}