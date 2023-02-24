package io.github.mianalysis.mia.forschools.gui.buttons;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;

public class ArrowButton extends CartoonButton {

    public ArrowButton(EventHandler<ActionEvent> eventHandler, TriangleMode triangleMode) {
        getStyleClass().add("arrow-button");        
        setStyle(createWonkyTrianglePath(triangleMode, 0.1));
        setOnAction(eventHandler);

    }
}
