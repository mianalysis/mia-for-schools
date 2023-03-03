package io.github.mianalysis.mia.forschools.gui;

import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;

public class WorkflowPane extends HBox {
    private static final int PANE_CONTROL = 0;
    private static final int PANE_IMAGE = 1;

    public WorkflowPane() {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        getStyleClass().add("pane");
        
        getChildren().add(new Label("Controls"));
        getChildren().add(new Label("Image"));
        
        setSpacing(20);

    }

    public Pane getControlPane() {
        return (Pane) getChildren().get(PANE_CONTROL);
    }

    public void setControlPane(Pane pane) {
        ScrollPane scroll = new ScrollPane();
        scroll.setContent(pane); 
        getChildren().set(PANE_CONTROL,scroll);
    }

    public Pane getImagePane() {
        return (Pane) getChildren().get(PANE_IMAGE);
    }

    public void setImagePane(Pane pane) {
        getChildren().set(PANE_IMAGE,pane);
    }
}
