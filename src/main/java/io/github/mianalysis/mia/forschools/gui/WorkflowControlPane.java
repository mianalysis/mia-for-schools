package io.github.mianalysis.mia.forschools.gui;

import java.util.ArrayList;
import java.util.TreeMap;

import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JTextField;

import io.github.mianalysis.mia.module.Module;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.module.system.GUISeparator;
import io.github.mianalysis.mia.object.Workspace;
import io.github.mianalysis.mia.object.Workspaces;
import io.github.mianalysis.mia.object.parameters.abstrakt.Parameter;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;

public class WorkflowControlPane extends VBox {
    private Workspace workspace = null;
    private int groupIdx = 0;
    private int maxIdx = 0;
    private TreeMap<Integer, ArrayList<Module>> moduleGroups;

    public WorkflowControlPane(Analysis analysis) {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());

        Workspaces workspaces = new Workspaces();
        workspace = workspaces.getNewWorkspace(analysis.getModules().getInputControl().getRootFile(), 1);

        Modules modules = analysis.getModules();
        moduleGroups = getModuleGroups(modules);

        runCurrentGroup();

    }

    private void runCurrentGroup() {
        ArrayList<Module> group = moduleGroups.get(groupIdx);

        getChildren().clear();

        for (Module module : group) {
            for (Parameter parameter : module.updateAndGetParameters().values()) {
                if (parameter.isVisible()) {
                    getChildren().add(new Label(parameter.getName()));

                    JComponent jComponent = parameter.getControl().getComponent();
                    if (jComponent instanceof JCheckBox) {      
                        CheckBox checkBox = new CheckBox();
                        checkBox.getStyleClass().add("cartoon-checkbox");
                        // checkBox.setSelected(parameter.getValue())
                        getChildren().add(checkBox);    
                    } else if (jComponent instanceof JTextField) {
                        getChildren().add(new TextField(parameter.getRawStringValue()));
                        
                    }
                }
            }

            module.execute(workspace);
        }

        // If this isn't the first group, show the "Back" button
        if (groupIdx > 0) {
            Button backButton = new Button();
            backButton.setText("Previous step");
            backButton.setMinWidth(GUIConstants.buttonMinSize);
            backButton.setMinHeight((int) Math.round(GUIConstants.buttonMaxSize * 0.25));
            backButton.setMaxWidth(GUIConstants.buttonMaxSize);
            backButton.setMaxHeight((int) Math.round(GUIConstants.buttonMaxSize * 0.25));
            backButton.setOnAction(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    groupIdx--;
                    runCurrentGroup();
                }
            });
            getChildren().add(backButton);
        }

        // If there are more steps, show the "Next" button
        if (groupIdx < maxIdx) {
            Button nextButton = new Button();
            nextButton.setText("Next step");
            nextButton.setMinWidth(GUIConstants.buttonMinSize);
            nextButton.setMinHeight((int) Math.round(GUIConstants.buttonMaxSize * 0.25));
            nextButton.setMaxWidth(GUIConstants.buttonMaxSize);
            nextButton.setMaxHeight((int) Math.round(GUIConstants.buttonMaxSize * 0.25));
            nextButton.setOnAction(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    groupIdx++;
                    runCurrentGroup();
                }
            });
            getChildren().add(nextButton);
        }

        BackButton workflowButton = new BackButton(MIAForSchools.getWorkflowSelectorPane(), GUIConstants.buttonMinSize,
                (int) Math.round(GUIConstants.buttonMaxSize * 0.25));
        getChildren().add(workflowButton);

    }

    private TreeMap<Integer, ArrayList<Module>> getModuleGroups(Modules modules) {
        TreeMap<Integer, ArrayList<Module>> groups = new TreeMap<>();
        ArrayList<Module> group = new ArrayList<>();
        int count = 0;
        for (Module module : modules) {
            if (module instanceof GUISeparator
                    && (boolean) module.getParameterValue(GUISeparator.SHOW_PROCESSING, null)) {
                maxIdx = count;
                groups.put(count++, group);
                group = new ArrayList<Module>();
            } else {
                group.add(module);
            }
        }

        // Adding the final group
        maxIdx = count;
        groups.put(count++, group);

        return groups;

    }
}
