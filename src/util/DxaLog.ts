class DxaLog {
  log(...message: any[]) {
    console.log('MedalliaDXA ->', message);
  }
}
const dxaLog = new DxaLog();
export { dxaLog };