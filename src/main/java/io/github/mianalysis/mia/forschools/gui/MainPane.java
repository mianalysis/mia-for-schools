package io.github.mianalysis.mia.forschools.gui;

import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;

public class MainPane extends HBox {
    private static final int PANE_CONTROL = 0;
    private static final int PANE_IMAGE = 1;

    public MainPane() {
        getChildren().add(new Label("Controls"));
        getChildren().add(new Label("Image"));
    }

    public Pane getControlPane() {
        return (Pane) getChildren().get(PANE_CONTROL);
    }

    public void setControlPane(Pane pane) {
        getChildren().set(PANE_CONTROL,pane);
    }

    public Pane getImagePane() {
        return (Pane) getChildren().get(PANE_IMAGE);
    }

    public void setImagePane(Pane pane) {
        getChildren().set(PANE_IMAGE,pane);
    }
}
