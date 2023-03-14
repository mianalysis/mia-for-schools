package io.github.mianalysis.mia.forschools.gui;

import java.util.HashMap;
import java.util.Iterator;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JTextField;

import io.github.mianalysis.mia.forschools.gui.WonkyShapes.TriangleMode;
import io.github.mianalysis.mia.forschools.gui.buttons.ArrowButton;
import io.github.mianalysis.mia.forschools.gui.buttons.HomeButton;
import io.github.mianalysis.mia.module.Module;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.module.system.GUISeparator;
import io.github.mianalysis.mia.object.Workspace;
import io.github.mianalysis.mia.object.Workspaces;
import io.github.mianalysis.mia.object.parameters.ParameterGroup;
import io.github.mianalysis.mia.object.parameters.Parameters;
import io.github.mianalysis.mia.object.parameters.abstrakt.ChoiceType;
import io.github.mianalysis.mia.object.parameters.abstrakt.Parameter;
import io.github.mianalysis.mia.object.system.Status;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisTester;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

public class WorkflowControlPane extends VBox {
    private Modules modules;
    private Workspace workspace = null;
    private int groupIdx = 0;
    private int maxIdx = 0;
    private TreeMap<Integer, ModuleGroup> moduleGroups;
    private HashMap<Parameter, Node> parameterControls = new HashMap<>();
    private Label l = new Label();

    public WorkflowControlPane(Analysis analysis) {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        getStyleClass().add("control-pane");

        Workspaces workspaces = new Workspaces();
        workspace = workspaces.getNewWorkspace(analysis.getModules().getInputControl().getRootFile(), 1);

        modules = analysis.getModules();
        moduleGroups = getModuleGroups(modules);

        // If pre-processing modules are present, run these first (these are modules
        // before the first GUISeparator)
        if (moduleGroups.containsKey(-1))
            executeModuleGroup(moduleGroups.get(-1));

        renderCurrentGroup();

    }

    private void renderCurrentGroup() {
        ModuleGroup group = moduleGroups.get(groupIdx);
        getChildren().clear();

        HomeButton homeButton = new HomeButton();
        HBox.setHgrow(homeButton, Priority.ALWAYS);
        getChildren().add(homeButton);

        VBox controls = getWorkflowControls(group, workspace);
        getChildren().add(controls);

        Pane spacer = new Pane();
        VBox.setVgrow(spacer, Priority.ALWAYS);
        getChildren().add(spacer);

        HBox buttonPane = getControlButtons();
        getChildren().add(buttonPane);

        getChildren().add(l);
        executeModuleGroup(group);

    }

    private TreeMap<Integer, ModuleGroup> getModuleGroups(Modules modules) {
        TreeMap<Integer, ModuleGroup> groups = new TreeMap<>();
        int startIdx = 0;
        int endIdx = -1;

        if (modules == null || modules.size() == 0)
            return groups;

        // Loading any modules before the first separator (those which run by default
        // once at the beginning) and the first separator
        GUISeparator prevSeparator = null;
        Iterator<Module> iterator = modules.iterator();
        while (iterator.hasNext()) {
            endIdx++;
            Module module = iterator.next();
            if (module instanceof GUISeparator
                    && (boolean) module.getParameterValue(GUISeparator.SHOW_PROCESSING, null)) {
                prevSeparator = (GUISeparator) module;
                if (endIdx != 0)
                    groups.put(-1, new ModuleGroup(0, endIdx, "", ""));
                startIdx = endIdx;
                break;
            }
        }

        // Loading the main module groups
        int count = 0;
        while (iterator.hasNext()) {
            endIdx++;
            Module module = iterator.next();
            if (module instanceof GUISeparator
                    && (boolean) module.getParameterValue(GUISeparator.SHOW_PROCESSING, null)) {
                maxIdx = count;
                if (prevSeparator == null)
                    groups.put(count++, new ModuleGroup(startIdx, endIdx, "", ""));
                else
                    groups.put(count++,
                            new ModuleGroup(startIdx, endIdx, prevSeparator.getNickname(), prevSeparator.getNotes()));

                prevSeparator = (GUISeparator) module;
                startIdx = endIdx;
            }
        }

        // Adding the final group
        maxIdx = count;
        if (prevSeparator == null)
            groups.put(count++, new ModuleGroup(startIdx, endIdx + 1, "", ""));
        else
            groups.put(count++,
                    new ModuleGroup(startIdx, endIdx + 1, prevSeparator.getNickname(), prevSeparator.getNotes()));

        return groups;

    }

    private VBox getWorkflowControls(ModuleGroup group, Workspace workspace) {
        VBox controls = new VBox();
        ObservableList<Node> children = controls.getChildren();

        int startIdx = group.getStartIdx();
        int endIdx = group.getEndIdx();
        for (int i = startIdx; i < endIdx; i++) {
            Module module = modules.get(i);
            for (Parameter parameter : module.updateAndGetParameters().values())
                addParameterControl(parameter, group, children);
        }

        WorkflowPane.setTitle(group.getTitle());
        WorkflowPane.setDescription(group.getDescription());

        return controls;

    }

    private void addParameterControl(Parameter parameter, ModuleGroup group, ObservableList<Node> children) {
        if (parameter instanceof ParameterGroup)
            for (Parameters currParameters : ((ParameterGroup) parameter).getCollections(true).values())
                for (Parameter currParameter : currParameters.values())
                    addParameterControl(currParameter, group, children);

        if (parameter.isVisible()) {
            String labelText = parameter.getNickname();
            Matcher labelTextMatcher = Pattern.compile("(.+)S\\{([^\\}]+)}").matcher(labelText);
            if (labelTextMatcher.find())
                labelText = labelTextMatcher.group(1);

            Label parameterLabel = new Label(labelText);
            parameterLabel.getStyleClass().add("cartoon-text");
            parameterLabel.getStyleClass().add("label-text");
            parameterLabel.setAlignment(Pos.CENTER);
            parameterLabel.setMaxWidth(Double.MAX_VALUE);
            parameterLabel.setPadding(new Insets(10));
            children.add(parameterLabel);

            children.add(getParameterControl(parameter, group));

        }
    }

    private Node getParameterControl(Parameter parameter, ModuleGroup group) {
        if (!parameterControls.keySet().contains(parameter)) {
            JComponent jComponent = parameter.getControl().getComponent();
            if (jComponent instanceof JCheckBox) {
                CheckBox checkBox = new CheckBox();
                checkBox.getStyleClass().add("cartoon-checkbox");
                parameterControls.put(parameter, checkBox);
            } else if (jComponent instanceof JTextField) {
                if (Pattern.compile("S\\{([^\\}]+)}").matcher(parameter.getNickname()).find()) {
                    Pattern pattern = Pattern.compile("S\\{([^\\}]+)}");
                    Matcher matcher = pattern.matcher(parameter.getNickname());
                    double sliderMin = 0;
                    double sliderMax = 100;
                    double sliderValue = Double.valueOf(parameter.getRawStringValue());
                    while (matcher.find()) {
                        Pattern sliderPattern = Pattern.compile("([^\\|]+)\\|([^\\|]+)\\|([^\\|]+)");
                        Matcher sliderMatcher = sliderPattern.matcher(matcher.group(1));
                        if (sliderMatcher.find()) {
                            sliderMin = Double.parseDouble(sliderMatcher.group(1));
                            sliderMax = Double.parseDouble(sliderMatcher.group(2));
                            sliderValue = Double.parseDouble(sliderMatcher.group(3));
                        }
                    }
                    // Setting the current parameter value to the specified slider default. By not
                    // using the parameter default, we can have different values for standard MIA
                    // execution
                    parameter.setValueFromString(String.valueOf(sliderValue));
                    Slider slider = new Slider(sliderMin, sliderMax, sliderValue);
                    slider.valueProperty().addListener((observable, oldValue, newValue) -> {
                        parameter.setValueFromString(String.valueOf(slider.getValue()));
                        executeModuleGroup(group);
                    });
                    parameterControls.put(parameter, slider);
                } else {
                    TextField textField = new TextField(parameter.getRawStringValue());
                    textField.setPadding(new Insets(10));
                    textField.focusedProperty().addListener(new ChangeListener<Boolean>() {
                        @Override
                        public void changed(ObservableValue<? extends Boolean> observable, Boolean oldValue,
                                Boolean newValue) {
                            if (!newValue) {
                                parameter.setValueFromString(textField.getText());
                                executeModuleGroup(group);
                            }
                        }
                    });
                    parameterControls.put(parameter, textField);
                }
            } else if (jComponent instanceof JComboBox) {                
                ComboBox<String> comboBox = new ComboBox<>(
                        FXCollections.observableArrayList(((ChoiceType) parameter).getChoices()));                        
                comboBox.setValue(parameter.getRawStringValue());
                comboBox.valueProperty().addListener((observable, oldValue, newValue) -> {
                    parameter.setValueFromString(String.valueOf(comboBox.getValue()));
                    executeModuleGroup(group);
                });
                comboBox.setPrefWidth(Double.MAX_VALUE);
                comboBox.setPrefHeight(15);
                comboBox.setStyle(WonkyShapes.createSquarePath(0.1));
                comboBox.getStyleClass().add("cartoon-shape");
                parameterControls.put(parameter, comboBox);
            }
        }

        return parameterControls.get(parameter);

    }

    private void executeModuleGroup(ModuleGroup group) {
        AnalysisTester.testModules(modules,workspace);

        int startIdx = group.getStartIdx();
        int endIdx = group.getEndIdx();
        for (int idx = startIdx; idx < endIdx; idx++) {
            Module module = modules.get(idx);

            for (Parameter p : module.updateAndGetParameters().values()) {
                if (p instanceof ParameterGroup) {
                    for (Parameters pp : ((ParameterGroup) p).getCollections(true).values())
                        pp.values();
                }
            }

            if (module.isEnabled() && module.isRunnable()) {
                try {
                    Status success = module.execute(workspace);
                    switch (success) {
                        case REDIRECT:
                            // Getting index of module before one to move to
                            Module redirectModule = module.getRedirectModule(workspace);
                            idx = modules.indexOf(redirectModule)-1;
                            break;
                        case PASS:
                        case FAIL:
                        case TERMINATE:
                        case TERMINATE_SILENT:
                            break;
                    }
                } catch (Exception e1) {
                    e1.printStackTrace();
                    break;
                }
            }
        }
    }

    private HBox getControlButtons() {
        // Creating the back button
        EventHandler<ActionEvent> eventHandler = new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                groupIdx--;
                renderCurrentGroup();
            }
        };
        ArrowButton backButton = new ArrowButton(eventHandler, TriangleMode.LEFT);
        backButton.setText("Back");
        backButton.setAlignment(Pos.CENTER_RIGHT);

        if (groupIdx <= 0)
            backButton.setDisable(true);

        Pane spacer = new Pane();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        // Creating the next button
        eventHandler = new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                groupIdx++;
                renderCurrentGroup();
            }
        };
        ArrowButton nextButton = new ArrowButton(eventHandler, TriangleMode.RIGHT);
        nextButton.setText("Next");
        nextButton.setAlignment(Pos.CENTER_LEFT);
        if (groupIdx >= maxIdx)
            nextButton.setDisable(true);

        HBox buttonPane = new HBox();
        buttonPane.getChildren().addAll(backButton, spacer, nextButton);
        buttonPane.setPadding(new Insets(0, 0, 30, 0));

        return buttonPane;

    }
}
