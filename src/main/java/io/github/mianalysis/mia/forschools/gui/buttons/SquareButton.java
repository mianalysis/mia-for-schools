package io.github.mianalysis.mia.forschools.gui.buttons;

import io.github.mianalysis.mia.forschools.gui.WonkyShapes;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;

public class SquareButton extends CartoonButton {
    public SquareButton(EventHandler<ActionEvent> eventHandler) {
        getStyleClass().add("cartoon-text");
        getStyleClass().add("button-text");
        setStyle(WonkyShapes.createSquarePath(0.1));
        setOnAction(eventHandler);        
        
    }
}
