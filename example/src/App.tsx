import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { initialize } from 'dxa-react-native';

export default function App() {
  const [result, setResult] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    initialize(10010,250441, true, false).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>DXA SDK React Native PoC {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
