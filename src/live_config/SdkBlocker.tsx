
class SdkBlocker {
    public isSdkBlocked: boolean = false;
    private blockableClasses: Blockable[] = []; // Initialize the callbacks property

    public addClassToBlock(blockableClass: Blockable): void {
        this.blockableClasses.push(blockableClass);
    }

    public blockSdk(): void {
        this.isSdkBlocked = true;
        this.blockableClasses.forEach(blockableClass => {
            blockableClass.executeBlock();
        });
    }
}


abstract class Blockable {
    constructor() {
        this.subscribeToBlocker();
    }

    protected subscribeToBlocker(): void {
        sdkBlockerIstance.addClassToBlock(this);
    }

    abstract executeBlock(): void;

}

const sdkBlockerIstance = new SdkBlocker();
export { sdkBlockerIstance, Blockable };
