import * as React from 'react';
import { dxa } from './index';

type DxaAppProps = {
  accountId: number;
  propertyId: number;
  enabled: boolean | undefined;
};

type DxaAppState = {
  running: boolean;
};

export class DxaApp extends React.Component<DxaAppProps, DxaAppState> {

  render(): React.ReactNode {
    return this.props.children;
  }

  componentDidMount(): void {
    if (this.props.enabled == true) {
      dxa.initialize(
        this.props.accountId,
        this.props.propertyId
      ).then((result: boolean) => {
        console.log("Initialize Dxa sdk result:", result);
        this.setState({ running: result });
      });
    }
  }

  componentWillUnmount(): void {
    console.log("Sdk stoping...");
  }
}
