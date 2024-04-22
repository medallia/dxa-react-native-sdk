class SdkBlocker {
    private isSdkBlocked: boolean = false;
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
const sdkBlockerIstance = new SdkBlocker();

abstract class Blockable {
    constructor() {
        this.subscribeToBlocker();
    }

    protected subscribeToBlocker(): void{
        sdkBlockerIstance.addClassToBlock(this);
    }
    
    abstract executeBlock(): void;
    
}

