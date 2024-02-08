import { MedalliaDXA } from "dxa-react-native";
import React, { useState } from "react";
import { WebView } from 'react-native-webview';

//Webview Screen
export function WebviewScreen({}: { navigation: any }) {
    const [urlWithWebProperties, setWebParams] = useState<string>("requesting...");
  MedalliaDXA.getWebViewProperties().then((params) => setWebParams(`https://www.decibeltechnology.com/?${params}`));
    return (

     urlWithWebProperties !== "requesting..." ? <WebView source={{ uri: urlWithWebProperties }} style={{ flex: 1 }} /> : null

    );
  }