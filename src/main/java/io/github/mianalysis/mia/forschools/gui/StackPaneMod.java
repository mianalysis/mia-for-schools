package io.github.mianalysis.mia.forschools.gui;

import javafx.scene.Node;
import javafx.scene.image.Image;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;

public class StackPaneMod extends StackPane {
    private WrappedImageView referenceImageView;
    // StackPaneMod(WrappedImageView referenceImageView) {
    //     this.referenceImageView = referenceImageView;
    //     // setPreserveRatio(true);
    // }

    // @Override
    // public double minWidth(double height) {
    //     return 40;
    // }

    // @Override
    // public double maxWidth(double height) {
    //     return 16384;
    // }

    // @Override
    // public double minHeight(double width) {
    //     return 40;
    // }

    // @Override
    // public double maxHeight(double width) {
    //     return 16384;
    // }

    @Override
    public boolean isResizable() {
        return true;
    }

    @Override
    public void resize(double width, double height) {      
        
        // Image image = getBackground().getImages().get(0).getImage();
        // double imW = image.getWidth();
        // double imH = image.getHeight();
        // double paneW = Double.MAX_VALUE;
        // double paneH = Double.MAX_VALUE;

        // // Parent should be a Pane, but we can't guarantee
        // if (getParent() instanceof Pane) {
        //     paneW = ((Pane) getParent()).getWidth();
        //     paneH = ((Pane) getParent()).getHeight();            
        //     prefWidthProperty().bind(((Pane) getParent()).widthProperty());
        //     prefHeightProperty().bind(((Pane) getParent()).heightProperty());
        // }

        // // System.out.println(paneW+"_"+paneH);  
        // // setMinSize(paneW, paneH);
        // // setMaxSize(paneW, paneH);
        // // setPrefSize(paneW, paneH);
        // // setPrefWidth(imW);
        // // setPrefHeight(imH);

    }
}
