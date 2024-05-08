class DxaLog {
  log(...message: any[]) {
    console.log(message);
  }
}
const dxaLog = new DxaLog();
export { dxaLog };