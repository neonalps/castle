import dependencyManager from "./manager";
import { Dependencies } from "./dependencies";

export class DependencyHelper {

    private constructor() {}

    public static initDependencies(): void {
        dependencyManager.registerAll(this.getDependencies());
    }

    private static getDependencies(): Map<Dependencies, any> {

        const dependencies: Map<Dependencies, any> = new Map();
        
        return dependencies;
    }

}