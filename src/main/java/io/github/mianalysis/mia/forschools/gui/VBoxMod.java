package io.github.mianalysis.mia.forschools.gui;

import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;

public class VBoxMod extends VBox {
    @Override
    public void resize(double width, double height) {
        System.out.println("P "+getParent());
        // Parent should be a Pane, but we can't guarantee
        if (getParent() instanceof Pane) {
            setPrefWidth(((Pane) getParent()).getWidth());
            setPrefHeight(((Pane) getParent()).getHeight());
        }
    //     VBox.super(width,height);
    
        // System.out.println(getBackground().getImages().get(0).getImage().getWidth()+"_"+getBackground().getImages().get(0).getImage().getHeight());
    //     // Parent should be a Pane, but we can't guarantee
    //     // if (getParent() instanceof Pane) {
    //     //     setFitWidth(((Pane) getParent()).getWidth());
    //     //     setFitHeight(((Pane) getParent()).getHeight());
    //     // }
    }
}
