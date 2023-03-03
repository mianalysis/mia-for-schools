package io.github.mianalysis.mia.forschools.gui;

import java.awt.image.BufferedImage;

import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.Overlay;
import ij.process.LUT;
import io.github.mianalysis.mia.object.image.Image;
import io.github.mianalysis.mia.object.image.renderer.ImageRenderer;
import javafx.beans.value.ChangeListener;
import javafx.embed.swing.SwingFXUtils;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

public class ImagePaneRenderer implements ImageRenderer {
    private static final String squarePath = WonkyShapes.createSquarePath(0.1);
    private static double overallWidth = Double.NaN;
    private static double overallHeight = Double.NaN;

    @Override
    public void render(Image image, String title, LUT lut, boolean normalise, boolean composite, Overlay overlay) {        
        // Creating a pane to put the image in
        VBox imagePane = new VBox();
        imagePane.getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        imagePane.setAlignment(Pos.CENTER);
        HBox.setMargin(imagePane, new Insets(20, 20, 20, 20));
        HBox.setHgrow(imagePane, Priority.ALWAYS);

        // This method can't handle overlays, but is fine if we flatten the overlays out
        // first
        ImagePlus ipl = image.getImagePlus();
        ImageCanvas imageCanvas = new ImageCanvas(ipl.flatten());
        BufferedImage bufferedImage = new BufferedImage(ipl.getWidth(), ipl.getHeight(), BufferedImage.TYPE_INT_RGB);
        imageCanvas.paint(bufferedImage.createGraphics());
        javafx.scene.image.Image im = SwingFXUtils.toFXImage(bufferedImage, null);

        BackgroundImage backgroundImage = new BackgroundImage(im, BackgroundRepeat.NO_REPEAT,
                BackgroundRepeat.NO_REPEAT, BackgroundPosition.DEFAULT,
                new BackgroundSize(BackgroundSize.AUTO, BackgroundSize.AUTO, false, false, false, true));

        StackPane stackPane = new StackPane();
        stackPane.setBackground(new Background(backgroundImage));
        stackPane.setStyle(
                "-fx-border-style: solid inside; -fx-border-width: 2; -fx-border-insets: 0; -fx-border-radius: 0; -fx-border-color: black; -fx-effect: dropshadow( three-pass-box, black, 10, 0.0, 0, 1);"
                        + squarePath);

        if (!Double.isNaN(overallWidth)) {
            stackPane.setMinWidth(overallWidth);
            stackPane.setMaxWidth(overallWidth);
            stackPane.setPrefWidth(overallWidth);
            stackPane.setMinHeight(overallHeight);
            stackPane.setMaxHeight(overallHeight);
            stackPane.setPrefHeight(overallHeight);
        }

        VBox.setVgrow(stackPane, Priority.ALWAYS);
        imagePane.getChildren().add(stackPane);

        ChangeListener<Number> sizeListener = (observable, oldValue, newValue) -> {
            // Parent should be a Pane, but we can't guarantee
            double width2 = imagePane.getWidth();
            double aspectRatio2 = ipl.getWidth() / ipl.getHeight();

            stackPane.setMinHeight(width2 * aspectRatio2);
            stackPane.setMaxHeight(width2 * aspectRatio2);
            stackPane.setPrefHeight(width2 * aspectRatio2);

            overallWidth = width2;
            overallHeight = width2 * aspectRatio2;

        };

        // add the ChangeListener to the width and height properties of the region
        stackPane.widthProperty().addListener(sizeListener);
        stackPane.heightProperty().addListener(sizeListener);

        // Setting the image pane in the GUI
        MIAForSchools.getWorkflowPane().setImagePane(imagePane);

    }
}
