import type { DependenciesManager } from "src/DependenciesManager";

class SdkBlocker {
    public isSdkBlocked: boolean = false;
    private blockableClasses: Blockable[] = []; 
    private dependenciesManager: DependenciesManager;
    
    constructor(dependenciesManager: DependenciesManager) {
        this.dependenciesManager = dependenciesManager;
    }

    public addClassToBlock(blockableClass: Blockable): void {
        this.blockableClasses.push(blockableClass);
    }

    public blockSdk(): void {
        this.isSdkBlocked = true;
        this.blockableClasses.forEach(blockableClass => {
            blockableClass.executeBlock();
        });
    }
    public unblockSdk(): void {
        this.isSdkBlocked = false;
        this.blockableClasses.forEach(blockableClass => {
            blockableClass.removeBlock();
        });
        if(this.dependenciesManager.dependenciesLoadded ==false){
            this.dependenciesManager.initializePostInitializeModules();
        }
    }
}


abstract class Blockable {
    private sdkBlocker: SdkBlocker;
    constructor(sdkBlocker: SdkBlocker) {
        this.sdkBlocker = sdkBlocker;
        this.subscribeToBlocker();
    }

    protected subscribeToBlocker(): void {
        
        this.sdkBlocker.addClassToBlock(this);
    }

    abstract executeBlock(): void;
    abstract removeBlock(): void;
}

export { SdkBlocker, Blockable };
