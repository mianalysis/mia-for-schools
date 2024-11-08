import { sendParameter } from '../lib/util';

export class ObjectSelector {
    render(): string {
        return `<div>
        <h1>Module is called WOOF</h1>
    </div>`;
    }

    module: ModuleJSON;
    refValueParam: ParameterJSON;
    selectionModeParam: ParameterJSON;

    constructor(module: ModuleJSON) {
        this.module = module;

        // Getting key parameters
        module.parameters.forEach(parameter => {
            if (parameter.name === "Reference value")
                this.refValueParam = parameter;
            else if (parameter.name === "Selection mode")
                this.selectionModeParam = parameter;
        });
    }

    selectObject(objectID: string) {
        var ids = []
        if (this.selectionModeParam.value === "Multiple (toggle)")
            ids = this.refValueParam.value.split(",");

        var isPresent: boolean = false;
        var newString: string = ""

        // Creating a new comma-separated string which doesn't include the selected object.  
        // If the selected object was present before, we don't want to include it now.
        ids.forEach(id => {
            if (id === objectID)
                isPresent = true
            else
                if (newString.length == 0)
                    newString = id
                else
                    newString = newString + "," + id
        })

        // If the selected object wasn't present before, we want to include it now
        if (!isPresent)
            if (newString.length == 0)
                newString = objectID
            else
                newString = newString + "," + objectID

        this.refValueParam.value = newString;
        this.sendSelectedObjectsParameter();

    }

    sendSelectedObjectsParameter() {
        sendParameter(this.module.id, this.refValueParam.name, this.refValueParam.value, undefined, undefined);
    }
}
