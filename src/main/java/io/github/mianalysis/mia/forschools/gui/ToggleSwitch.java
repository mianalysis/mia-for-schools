package io.github.mianalysis.mia.forschools.gui;

import java.util.Iterator;

import javafx.beans.property.SimpleBooleanProperty;
import javafx.collections.ObservableList;
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

        if (state) {
            getStyleClass().add("toggle-switch-on");
            label.setText("On");
        } else {
            getStyleClass().add("toggle-switch-off");
            label.setText("Off");
        }
        
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
            ObservableList styles = getStyleClass();
            Iterator it = styles.iterator();
            while (it.hasNext()) {
                String style = (String) it.next();            
                if (((String) style).contains("toggle-switch-off"))
                    it.remove();
                else if (((String) style).contains("toggle-switch-on"))
                    it.remove();
            }

            if (c) {
                label.setText("On");
                styles.add("toggle-switch-on");
                label.toFront();
            } else {
                label.setText("Off");
                styles.add("toggle-switch-off");
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