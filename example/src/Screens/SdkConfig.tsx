import { ImageQualityType, MedalliaDXA, MedalliaDxaCustomerConsentType } from "dxa-react-native";
import React from "react";
import { Button, Text, View } from "react-native";

export function SdkConfigScreen({ navigation }: { navigation: any }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Sdk config Screen</Text>
            <View style={{ height: 70 }}></View>
            <ConsentsButtons />
            <View style={{ height: 20 }}></View>
            <Button
                title='Send data over wifi only: true'
                onPress={() => MedalliaDXA.sendDataOverWifiOnly(true)} />
            <Button
                title='Send data over wifi only: false'
                onPress={() => MedalliaDXA.sendDataOverWifiOnly(false)} />
            <Button
                title='Set image quality poor'
                onPress={() => MedalliaDXA.setImageQuality(ImageQualityType.poor)} />
            <Button
                title='Set image quality ultra'
                onPress={() => MedalliaDXA.setImageQuality(ImageQualityType.ultra)} />
        </View>
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