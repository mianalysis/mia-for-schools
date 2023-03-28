package io.github.mianalysis.mia.forschools.gui;

import javafx.beans.property.SimpleBooleanProperty;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

public class ToggleSwitch extends HBox {
    private Label label = new Label();
    private Button button = new Button();
    private SimpleBooleanProperty switchedOn;

    public ToggleSwitch(boolean state) {
        switchedOn = new SimpleBooleanProperty(state);
        
        setStyle(WonkyShapes.createSquarePath(0.1));
        getStyleClass().add("cartoon-shape");
        getStyleClass().add("toggle-switch");
        getStyleClass().add("toggle-switch-off");

        label.setText("Off");
        label.getStyleClass().add("cartoon-text");
        label.getStyleClass().add("normal-text");
        label.prefWidthProperty().bind(widthProperty().divide(2));

        button.setStyle(WonkyShapes.createSquarePath(0.2));
        button.getStyleClass().add("cartoon-shape");
        button.getStyleClass().add("toggle-switch-slider");
        button.prefWidthProperty().bind(widthProperty().divide(2));

        getChildren().addAll(label, button);
        button.setOnAction((e) -> {
            switchedOn.set(!switchedOn.get());
        });
        label.setOnMouseClicked((e) -> {
            switchedOn.set(!switchedOn.get());
        });

        switchedOn.addListener((a, b, c) -> {
            if (c) {
                label.setText("On");
                getStyleClass().remove("toggle-switch-off");
                getStyleClass().add("toggle-switch-on");
                label.toFront();
            } else {
                label.setText("Off");
                getStyleClass().remove("toggle-switch-on");
                getStyleClass().add("toggle-switch-off");
                button.toFront();
            }
        });
        label.setAlignment(Pos.CENTER);
        setAlignment(Pos.CENTER_LEFT);

    }

    public SimpleBooleanProperty valueProperty() {
        return switchedOn;
    }

    public boolean getState() {
        return switchedOn.get();
    }

    public void setState(boolean state) {
        switchedOn.set(state);
    }
}