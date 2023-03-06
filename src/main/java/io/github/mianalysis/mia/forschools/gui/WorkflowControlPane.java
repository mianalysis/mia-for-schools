package io.github.mianalysis.mia.forschools.gui;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.JCheckBox;
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
import io.github.mianalysis.mia.object.parameters.abstrakt.Parameter;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

public class WorkflowControlPane extends VBox {
    private Workspace workspace = null;
    private int groupIdx = 0;
    private int maxIdx = 0;
    private TreeMap<Integer, ModuleGroup> moduleGroups;
    private HashMap<Parameter, Node> parameterControls = new HashMap<>();

    public WorkflowControlPane(Analysis analysis) {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        getStyleClass().add("control-pane");

        Workspaces workspaces = new Workspaces();
        workspace = workspaces.getNewWorkspace(analysis.getModules().getInputControl().getRootFile(), 1);

        Modules modules = analysis.getModules();
        moduleGroups = getModuleGroups(modules);

        runCurrentGroup();

    }

    private void runCurrentGroup() {
        getChildren().clear();

        HomeButton homeButton = new HomeButton();
        HBox.setHgrow(homeButton, Priority.ALWAYS);
        getChildren().add(homeButton);

        VBox controls = getWorkflowControls(moduleGroups.get(groupIdx), workspace);
        getChildren().add(controls);

        Pane spacer = new Pane();
        VBox.setVgrow(spacer, Priority.ALWAYS);
        getChildren().add(spacer);

        HBox buttonPane = getControlButtons();
        getChildren().add(buttonPane);

    }

    private TreeMap<Integer, ModuleGroup> getModuleGroups(Modules modules) {
        TreeMap<Integer, ModuleGroup> groups = new TreeMap<>();
        ArrayList<Module> group = new ArrayList<>();
        int count = 0;

        if (modules == null || modules.size() == 0)
            return groups;

        // The first module should be a GUISeparator describing the first module group
        GUISeparator prevSeparator = null;
        Iterator<Module> iterator = modules.iterator();
        Module firstModule = iterator.next();
        if (firstModule instanceof GUISeparator
                && (boolean) firstModule.getParameterValue(GUISeparator.SHOW_PROCESSING, null))
            prevSeparator = (GUISeparator) firstModule;

        while (iterator.hasNext()) {
            Module module = iterator.next();
            if (module instanceof GUISeparator
                    && (boolean) module.getParameterValue(GUISeparator.SHOW_PROCESSING, null)) {
                maxIdx = count;
                if (prevSeparator == null)
                    groups.put(count++, new ModuleGroup(group, "", ""));
                else
                    groups.put(count++,
                            new ModuleGroup(group, prevSeparator.getNickname(), prevSeparator.getNotes()));

                group = new ArrayList<Module>();
                prevSeparator = (GUISeparator) module;
            } else {
                group.add(module);
            }
        }

        // Adding the final group
        maxIdx = count;
        if (prevSeparator == null)
            groups.put(count++, new ModuleGroup(group, "", ""));
        else
            groups.put(count++, new ModuleGroup(group, prevSeparator.getNickname(), prevSeparator.getNotes()));

        return groups;

    }

    private VBox getWorkflowControls(ModuleGroup group, Workspace workspace) {
        VBox controls = new VBox();
        ObservableList<Node> children = controls.getChildren();

        for (Module module : group.getModules()) {
            for (Parameter parameter : module.updateAndGetParameters().values()) {
                if (parameter.isVisible()) {
                    Label parameterLabel = new Label(parameter.getName());
                    parameterLabel.getStyleClass().add("cartoon-text");
                    parameterLabel.getStyleClass().add("normal-text");
                    parameterLabel.setAlignment(Pos.CENTER);
                    parameterLabel.setMaxWidth(Double.MAX_VALUE);
                    parameterLabel.setPadding(new Insets(10));
                    children.add(parameterLabel);

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
                                double sliderValue = parameter.getValue(workspace);
                                while (matcher.find()) {
                                    Pattern sliderPattern = Pattern.compile("([^\\|]+)\\|([^\\|]+)\\|([^\\|]+)");
                                    Matcher sliderMatcher = sliderPattern.matcher(matcher.group(1));
                                    if (sliderMatcher.find()) {
                                        sliderMin = Double.parseDouble(sliderMatcher.group(1));
                                        sliderMax = Double.parseDouble(sliderMatcher.group(2));
                                        sliderValue = Double.parseDouble(sliderMatcher.group(3));
                                    }
                                }
                                Slider slider = new Slider(sliderMin, sliderMax, sliderValue);
                                slider.valueProperty().addListener((observable, oldValue, newValue) -> {
                                    parameter.setValueFromString(String.valueOf(newValue));
                                    runCurrentGroup();
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
                                            runCurrentGroup();
                                        }
                                    }
                                });
                                parameterControls.put(parameter, textField);
                            }
                        }
                    }

                    children.add(parameterControls.get(parameter));

                }
            }

            module.execute(workspace);

        }

        WorkflowPane.setTitle(group.getTitle());
        WorkflowPane.setDescription(group.getDescription());

        return controls;

    }

    private HBox getControlButtons() {
        // Creating the back button
        EventHandler<ActionEvent> eventHandler = new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                groupIdx--;
                runCurrentGroup();
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
                runCurrentGroup();
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
