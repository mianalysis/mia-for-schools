package io.github.mianalysis.mia.forschools.gui;

import java.util.ArrayList;

import io.github.mianalysis.mia.module.Module;

public class ModuleGroup {
    ArrayList<Module> modules = new ArrayList<>();
    String title = "";
    String description = "";

    public ModuleGroup(ArrayList<Module> modules, String title, String description) {
        this.modules = modules;
        this.title = title;
        this.description = description;
    }

    public ArrayList<Module> getModules() {
        return modules;
    }

    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
}
