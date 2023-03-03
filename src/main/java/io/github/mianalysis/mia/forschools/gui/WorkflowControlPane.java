package io.github.mianalysis.mia.forschools.gui;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.TreeMap;

import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JTextField;

import org.apache.poi.ss.formula.functions.T;

import io.github.mianalysis.mia.forschools.gui.WonkyShapes.TriangleMode;
import io.github.mianalysis.mia.forschools.gui.buttons.ArrowButton;
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
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

public class WorkflowControlPane extends VBox {
    private Workspace workspace = null;
    private int groupIdx = 0;
    private int maxIdx = 0;
    private TreeMap<Integer, ArrayList<Module>> moduleGroups;

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
        
        Button imageButton = new Button();
        Image image = new Image(WorkflowControlPane.class.getResourceAsStream("/img/house-64.png"));
        ImageView imageView = new ImageView(image);
        imageView.maxWidth(32);
        imageView.maxHeight(32);
        imageButton.setGraphic(imageView);

        // imageButton.setPickOnBounds(true);
        imageButton.setMaxWidth(Double.MAX_VALUE);
        HBox.setHgrow(imageButton, Priority.ALWAYS);

        imageButton.setText("Choose another image");

        // imageButton.getStyleClass().add("workflow-selector-button");
        imageButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                MIAForSchools.enableWorkflowSelectorPane();
            }
        });
        getChildren().add(imageButton);

        VBox controls = getWorkflowControls(moduleGroups, groupIdx, workspace);
        getChildren().add(controls);

        // Pane spacer = new Pane();
        // VBox.setVgrow(spacer, Priority.ALWAYS);
        // getChildren().add(spacer);

        HBox buttonPane = getControlButtons();
        getChildren().add(buttonPane);

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

    private VBox getWorkflowControls(TreeMap<Integer, ArrayList<Module>> moduleGroups, int groupIdx,
            Workspace workspace) {
        VBox controls = new VBox();
        ObservableList<Node> children = controls.getChildren();

        for (Module module : moduleGroups.get(groupIdx)) {
            for (Parameter parameter : module.updateAndGetParameters().values()) {
                if (parameter.isVisible()) {
                    children.add(new Label(parameter.getName()));

                    JComponent jComponent = parameter.getControl().getComponent();
                    if (jComponent instanceof JCheckBox) {
                        CheckBox checkBox = new CheckBox();
                        checkBox.getStyleClass().add("cartoon-checkbox");
                        // checkBox.setSelected(parameter.getValue())
                        children.add(checkBox);
                    } else if (jComponent instanceof JTextField) {
                        TextField textField = new TextField(parameter.getRawStringValue());
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
                        children.add(textField);
                    }

                }
            }

            module.execute(workspace);

        }

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
        if (groupIdx >= maxIdx)
            nextButton.setDisable(true);

        HBox buttonPane = new HBox();
        buttonPane.getChildren().addAll(backButton, spacer, nextButton);

        return buttonPane;

    }
}
