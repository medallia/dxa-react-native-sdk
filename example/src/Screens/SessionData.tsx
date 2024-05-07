import { MedalliaDXA } from "dxa-react-native";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { styles } from "../App";

export function SessionDataScreen({ navigation }: { navigation: any }) {
  const [sessionUrl, setSessionUrl] = useState<string>("requesting...");
  const [sessionId, setSessionId] = useState<string>("requesting...");
  MedalliaDXA.getSessionUrl().then((url) => setSessionUrl(url ?? 'null'));
  MedalliaDXA.getSessionId().then((id) => setSessionId(id ?? 'null'));
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}>Session url from native is:</Text>
      <View style={{ height: 20 }}></View>
      <Text style={styles.text}>{sessionUrl}</Text>
      <View style={{ height: 20 }}></View>
      <Text style={styles.text}>Session ID from native is:</Text>
      <View style={{ height: 20 }}></View>
      <Text style={styles.text}>{sessionId}</Text>
      <Button
        title="Go back"
        onPress={() => navigation.pop()}
      />
    </View>
  );
}