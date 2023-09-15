package io.github.mianalysis.mia.forschools.gui;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.scene.text.TextAlignment;

public class WorkflowPane extends HBox {
    private static final int PANE_CONTROL = 0;
    private static final int PANE_IMAGE = 1;
    private static VBox imageSide = new VBox();
    private static Pane imagePane = new Pane();
    private static Label titleLabel = new Label();
    private static Label descriptionLabel = new Label();

    public WorkflowPane() {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        getStyleClass().add("pane");
        
        getChildren().add(new Label("Controls"));
        // setPadding(new Insets(20));

        VBox.setMargin(titleLabel, new Insets(0,0,20,0));
        titleLabel.getStyleClass().add("cartoon-text");
        titleLabel.getStyleClass().add("label-text");
        titleLabel.setWrapText(true);
        titleLabel.setTextAlignment(TextAlignment.CENTER);
        
        VBox.setMargin(descriptionLabel, new Insets(20));
        descriptionLabel.setPadding(new Insets(20));
        descriptionLabel.getStyleClass().add("cartoon-shape");
        descriptionLabel.getStyleClass().add("description-label");
        descriptionLabel.getStyleClass().add("cartoon-text");
        descriptionLabel.getStyleClass().add("normal-text");
        descriptionLabel.setStyle(WonkyShapes.createSquarePath(0.05));
        descriptionLabel.setWrapText(true);
        descriptionLabel.setTextAlignment(TextAlignment.CENTER);

        imagePane.setPrefHeight(100);
        imageSide.getChildren().addAll(titleLabel,imagePane,descriptionLabel);
        imageSide.setPadding(new Insets(20));
        HBox.setHgrow(imageSide, Priority.ALWAYS);
        getChildren().add(imageSide);        
        
        setSpacing(20);

    }

    public Pane getControlPane() {
        return (Pane) getChildren().get(PANE_CONTROL);
    }

    public void setControlPane(Pane pane) {
        ScrollPane scroll = new ScrollPane();
        scroll.setContent(pane); 
        scroll.setFitToWidth(true);
        scroll.setFitToHeight(true);
        getChildren().set(PANE_CONTROL,scroll);
    }

    public Pane getImagePane() {
        return (Pane) getChildren().get(PANE_IMAGE);
    }

    public void setImagePane(Pane pane) {
        VBox.setVgrow(pane, Priority.SOMETIMES);
        imageSide.setAlignment(Pos.CENTER);
        imageSide.getChildren().set(1,pane);
        // System.out.println(pane.getWidth());
    }

    public static void setTitle(String title) {
        titleLabel.setText(title);
    }

    public static void setDescription(String description) {
        descriptionLabel.setText(description);
    }
}
