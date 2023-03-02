package io.github.mianalysis.mia.forschools.gui;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.control.Button;
import javafx.scene.layout.Pane;

public class BackButton extends Button {
    public BackButton(Pane targetPane, int width, int height) {
        setText("List of workflows");
        setMinWidth(width);
        setMaxWidth(width);
        setMinHeight(height);
        setMaxHeight(height);
        setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                MIAForSchools.getWorkflowPane().setControlPane(targetPane);   
            }
        });
    }
}
