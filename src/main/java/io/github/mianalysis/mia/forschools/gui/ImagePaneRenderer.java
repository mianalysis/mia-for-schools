package io.github.mianalysis.mia.forschools.gui;

import java.awt.Color;
import java.awt.image.BufferedImage;

import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.Overlay;
import ij.process.LUT;
import io.github.mianalysis.mia.object.image.Image;
import io.github.mianalysis.mia.object.image.renderer.ImageRenderer;
import javafx.beans.value.ChangeListener;
import javafx.embed.swing.SwingFXUtils;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.image.ImageView;
import javafx.scene.image.PixelReader;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;

public class ImagePaneRenderer implements ImageRenderer {
    private static final String squarePath = WonkyShapes.createSquarePath(0.05);
    private static double overallWidth = Double.NaN;
    private static double overallHeight = Double.NaN;
    private Label pixelLabel = new Label();

    @Override
    public void render(Image image, String title, LUT lut, boolean normalise, boolean composite, Overlay overlay) {
        // Creating a pane to put the image in
        VBox imagePane = new VBox();
        imagePane.getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        imagePane.setAlignment(Pos.CENTER);
        imagePane.setFillWidth(true);
        HBox.setMargin(imagePane, new Insets(20, 20, 20, 20));
        HBox.setHgrow(imagePane, Priority.ALWAYS);
        VBox.setVgrow(imagePane, Priority.ALWAYS);

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

        // StackPane stackPane = new StackPane();
        imagePane.setBackground(new Background(backgroundImage));
        imagePane.setStyle(
                "-fx-border-style: solid inside; -fx-border-width: 2; -fx-border-insets: 0; -fx-border-radius: 0; -fx-border-color: black; -fx-effect: dropshadow( three-pass-box, black, 10, 0.0, 0, 1);"
                        + squarePath);

        // ChangeListener<Number> sizeListener = (observable, oldValue, newValue) -> {
        // double width2 = imagePane.getWidth();
        // double aspectRatio2 = ipl.getWidth() / ipl.getHeight();

        // // System.out.println(width2 + "_" + oldValue + "_" + newValue);

        // overallWidth = width2;
        // overallHeight = width2 * aspectRatio2;

        // imagePane.setPrefWidth(overallWidth);
        // imagePane.setPrefHeight(overallHeight);

        // };

        // // Add the ChangeListener to the width and height properties of the region
        // imagePane.widthProperty().addListener(sizeListener);
        // imagePane.heightProperty().addListener(sizeListener);

        imagePane.setMinWidth(600);
        imagePane.setMinHeight(600);
        imagePane.setPrefWidth(600);
        imagePane.setPrefHeight(600);
        imagePane.setMaxWidth(600);
        imagePane.setMaxHeight(600);

        PixelReader pixelReader = im.getPixelReader();
        imagePane.setOnMouseMoved(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                int x = (int) Math.max(Math.min(Math.floor(event.getX()) * im.getWidth()
                        / (imagePane.getWidth() + imagePane.getInsets().getLeft() + imagePane.getInsets().getRight()),
                        im.getWidth() - 1), 0);
                int y = (int) Math.max(Math.min(Math.floor(event.getY()) * im.getHeight()
                        / (imagePane.getHeight() + imagePane.getInsets().getTop() + imagePane.getInsets().getBottom()),
                        im.getHeight() - 1), 0);

                int argb = pixelReader.getArgb((int) Math.round(x), (int) Math.round(y));
                pixelLabel.setText(String.valueOf(new Color(argb).getGreen()));

            }
        });

        imagePane.setOnMouseExited(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                pixelLabel.setVisible(false);
            }
        });

        imagePane.setOnMouseEntered(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                pixelLabel.setVisible(true);
            }
        });

        pixelLabel.getStyleClass().add("cartoon-text");
        pixelLabel.getStyleClass().add("title-text");
        pixelLabel.getStyleClass().add("overlay-text");

        imagePane.getChildren().add(pixelLabel);
        imagePane.setAlignment(Pos.TOP_LEFT);
        VBox.setMargin(pixelLabel, new Insets(20));

        // Setting the image pane in the GUI
        MIAForSchools.getWorkflowPane().setImagePane(imagePane);

    }
}
