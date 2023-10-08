import * as React from 'react';
import { MedalliaDXA } from './index';

type DxaScreenProps = {
  name: string;
};

export class DxaScreen extends React.Component<DxaScreenProps, any> {

  render(): React.ReactNode {
    return this.props.children;
  }

  componentDidMount(): void {
    console.log(`Screen component ${this.props.name} did mount, starting screen.`);
    MedalliaDXA.startScreen(this.props.name);
  }

  componentWillUnmount(): void {
    console.log(`Screen component ${this.props.name} will unmount, stoping screen.`);
    MedalliaDXA.stopScreen();
  }
}
