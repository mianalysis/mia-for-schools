package io.github.mianalysis.mia.forschools.gui;

import java.awt.Color;
import java.awt.image.BufferedImage;

import ij.IJ;
import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.Overlay;
import ij.process.LUT;
import io.github.mianalysis.mia.object.image.Image;
import io.github.mianalysis.mia.object.image.renderer.ImageRenderer;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.embed.swing.SwingFXUtils;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
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
    private ImagePlus ipl = null;
    private VBox imagePane = new VBox();
    private javafx.scene.image.Image im = null;
    private ImageCanvas imageCanvas;
    private BufferedImage bufferedImage;

    private VBox imageAndControlPane = new VBox();
    Slider cSlider = null;
    Slider zSlider = null;
    Slider tSlider = null;
    HBox cSliderBox = new HBox();
    HBox zSliderBox = new HBox();
    HBox tSliderBox = new HBox();
    int nChannels = 0;
    int nSlices = 0;
    int nFrames = 0;

    public ImagePaneRenderer() {
        imagePane.getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());

        imageAndControlPane.setAlignment(Pos.CENTER);

        HBox.setMargin(imagePane, new Insets(20, 20, 20, 20));
        // HBox.setHgrow(imagePane, Priority.ALWAYS);
        VBox.setVgrow(imagePane, Priority.ALWAYS);

        imagePane.setStyle(
                "-fx-border-style: solid inside; -fx-border-width: 2; -fx-border-insets: 0; -fx-border-radius: 0; -fx-border-color: black; -fx-effect: dropshadow( three-pass-box, black, 10, 0.0, 0, 1);"
                        + squarePath);

        ChangeListener<Number> sizeListener = (observable, oldValue, newValue) -> {
            double height2 = imagePane.getHeight();
            double aspectRatio2 = ipl.getHeight() / ipl.getWidth();

            overallWidth = height2 / aspectRatio2;
            overallHeight = height2;

            imagePane.setPrefWidth(overallWidth);
            imagePane.setMinWidth(overallWidth);
            imagePane.setMaxWidth(overallWidth);
            imagePane.setPrefHeight(overallHeight);

        };

        imagePane.setPrefWidth(500);
        imagePane.setMinWidth(500);
        imagePane.setMaxWidth(500);
        imagePane.setPrefHeight(500);

        // Add the ChangeListener to the width and height properties of the region
        imagePane.widthProperty().addListener(sizeListener);
        imagePane.heightProperty().addListener(sizeListener);

        imagePane.setOnMouseMoved(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                if (im == null)
                    return;

                PixelReader pixelReader = im.getPixelReader();
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

        VBox.setMargin(pixelLabel, new Insets(20));
        imagePane.getChildren().add(pixelLabel);

        imageAndControlPane.getChildren().add(imagePane);

        // Creating sliders
        Label dimLabel = new Label("Channel");
        dimLabel.getStyleClass().add("cartoon-text");
        dimLabel.getStyleClass().add("dim-label");
        Label valLabel = new Label("1");
        valLabel.getStyleClass().add("cartoon-text");
        valLabel.getStyleClass().add("val-label");
        cSlider = createSlider(1, valLabel);
        cSliderBox = new HBox(dimLabel, cSlider, valLabel);
        cSliderBox.setAlignment(Pos.CENTER);
        HBox.setHgrow(cSlider, Priority.ALWAYS);
        VBox.setMargin(cSliderBox, new Insets(10));
        imageAndControlPane.getChildren().add(cSliderBox);

        dimLabel = new Label("Slice");
        dimLabel.getStyleClass().add("cartoon-text");
        dimLabel.getStyleClass().add("dim-label");
        valLabel = new Label("1");
        valLabel.getStyleClass().add("cartoon-text");
        valLabel.getStyleClass().add("val-label");
        zSlider = createSlider(1, valLabel);
        zSliderBox = new HBox(dimLabel, zSlider, valLabel);
        zSliderBox.setAlignment(Pos.CENTER);
        HBox.setHgrow(zSlider, Priority.ALWAYS);
        VBox.setMargin(zSliderBox, new Insets(10));
        imageAndControlPane.getChildren().add(zSliderBox);

        dimLabel = new Label("Time");
        dimLabel.getStyleClass().add("cartoon-text");
        dimLabel.getStyleClass().add("dim-label");
        valLabel = new Label("1");
        valLabel.getStyleClass().add("cartoon-text");
        valLabel.getStyleClass().add("val-label");
        tSlider = createSlider(1, valLabel);
        tSliderBox = new HBox(dimLabel, tSlider, valLabel);
        tSliderBox.setAlignment(Pos.CENTER);
        HBox.setHgrow(tSlider, Priority.ALWAYS);
        VBox.setMargin(tSliderBox, new Insets(10));
        imageAndControlPane.getChildren().add(tSliderBox);

    }

    @Override
    public void render(Image image, String title, LUT lut, boolean normalise, boolean composite, Overlay overlay) {
        ipl = image.getImagePlus();
        if (composite)
            ipl.setDisplayMode(IJ.COMPOSITE);
        else
            ipl.setDisplayMode(IJ.COLOR);

        cSlider.setMax(ipl.getNChannels());
        zSlider.setMax(ipl.getNSlices());
        tSlider.setMax(ipl.getNFrames());

        cSliderBox.setVisible(ipl.getNChannels() > 1 & !composite);
        cSliderBox.setManaged(ipl.getNChannels() > 1 & !composite);
        zSliderBox.setVisible(ipl.getNSlices() > 1);
        zSliderBox.setManaged(ipl.getNSlices() > 1);
        tSliderBox.setVisible(ipl.getNFrames() > 1);
        tSliderBox.setManaged(ipl.getNFrames() > 1);

        if (ipl.getOverlay() != null)
            ipl.flattenStack();

        imageCanvas = new ImageCanvas(ipl);
        bufferedImage = new BufferedImage(ipl.getWidth(), ipl.getHeight(), BufferedImage.TYPE_INT_RGB);

        updateImage();

        // Setting the image pane in the GUI
        MIAForSchools.getWorkflowPane().setImagePane(imageAndControlPane);

    }

    private Slider createSlider(int max, Label label) {
        Slider slider = new Slider(1, max, 1);
        slider.getStyleClass().add("dim-slider");
        slider.valueProperty().addListener((observable, oldValue, newValue) -> {
            label.setText(String.valueOf((int) Math.round(slider.getValue())));
            updateImage();
        });

        return slider;

    }

    public void updateImage() {
        int c = cSlider.isVisible() ? (int) Math.round(cSlider.getValue()) : 1;
        int z = zSlider.isVisible() ? (int) Math.round(zSlider.getValue()) : 1;
        int t = tSlider.isVisible() ? (int) Math.round(tSlider.getValue()) : 1;

        ipl.setPosition(c, z, t);
        ipl.updateAndDraw();

        imageCanvas.paint(bufferedImage.createGraphics());
        im = SwingFXUtils.toFXImage(bufferedImage, null);

        BackgroundImage backgroundImage = new BackgroundImage(im, BackgroundRepeat.NO_REPEAT,
                BackgroundRepeat.NO_REPEAT, BackgroundPosition.DEFAULT,
                new BackgroundSize(BackgroundSize.AUTO, BackgroundSize.AUTO, false, false, false, true));

        // StackPane stackPane = new StackPane();
        imagePane.setBackground(new Background(backgroundImage));

    }
}
