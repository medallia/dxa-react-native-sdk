import * as React from 'react';
import { MedalliaDXA, dxaLog } from './index';

type DxaScreenProps = {
  name: string;
};

export class DxaScreen extends React.Component<DxaScreenProps, any> {
  render(): React.ReactNode {
    return this.props.children;
  }

  componentDidMount(): void {
    dxaLog.log(
      `Screen component ${this.props.name} did mount, starting screen.`
    );
    MedalliaDXA.startScreen(this.props.name);
  }

  componentWillUnmount(): void {
    dxaLog.log(
      `Screen component ${this.props.name} will unmount, stopping screen.`
    );
    MedalliaDXA.stopScreen();
  }
}
