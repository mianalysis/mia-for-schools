package io.github.mianalysis.mia.forschools.gui.buttons;

import io.github.mianalysis.mia.forschools.gui.WonkyShapes;
import io.github.mianalysis.mia.forschools.gui.WonkyShapes.TriangleMode;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;

public class ArrowButton extends CartoonButton {

    public ArrowButton(EventHandler<ActionEvent> eventHandler, TriangleMode triangleMode) {
        getStyleClass().add("arrow-button");        
        getStyleClass().add("cartoon-text");
        getStyleClass().add("normal-text");
        setStyle(WonkyShapes.createTrianglePath(triangleMode, 0.1));
        setOnAction(eventHandler);        
        
    }
}
