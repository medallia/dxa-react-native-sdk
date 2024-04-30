import { dxaLog } from "dxa-react-native";
import { core } from "../Core";

class SdkBlocker {
    public isSdkBlocked: boolean = false;
    private blockableClasses: Blockable[] = []; 
    
    public addClassToBlock(blockableClass: Blockable): void {
        this.blockableClasses.push(blockableClass);
    }

    public blockSdk(): void {
        dxaLog.log('MedalliaDXA ->', 'Sdk has been blocked');
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
        if(core.areModulesInstantiated==false){
            core.instantiateModules();
        }
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
    abstract removeBlock(): void;
}

const sdkBlockerIstance = new SdkBlocker();
export { sdkBlockerIstance, Blockable };
