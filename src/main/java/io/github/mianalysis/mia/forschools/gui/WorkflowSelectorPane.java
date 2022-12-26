package io.github.mianalysis.mia.forschools.gui;

import java.util.List;

import io.github.mianalysis.mia.forschools.gui.css.BackButton;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;

public class WorkflowSelectorPane extends VBox {
    private static int buttonMinSize = 200;
    private static int buttonMaxSize = 200;

    public WorkflowSelectorPane(List<String> workflowNames, MainPane mainPane) {
        ObservableList<Node> workflowButtons = getChildren();

        for (String workflowName : workflowNames)
            workflowButtons.add(createButton(workflowName, mainPane));

        // pane.getStylesheets().add(MIAForSchools.class.getResource("css/style.css").toExternalForm());

    }

    public Button createButton(String workflowName, MainPane mainPane) {
        Button button = new Button();
        button.setText(workflowName);
        button.setMinWidth(buttonMinSize);
        button.setMinHeight(buttonMinSize);
        button.setMaxWidth(buttonMaxSize);
        button.setMaxHeight(buttonMaxSize);

        Pane selectorPane = this;

        button.setOnAction(new EventHandler<ActionEvent>() {

            @Override
            public void handle(ActionEvent event) {
                Label workflowLabel = new Label("Controls for " + workflowName);
                VBox vbox = new VBox();
                vbox.getChildren().add(workflowLabel);

                BackButton backButton = new BackButton(mainPane, selectorPane, buttonMinSize, (int) Math.round(buttonMaxSize*0.25));

                vbox.getChildren().add(backButton);

                mainPane.setControlPane(vbox);

            }

        });

        return button;

    }
}
