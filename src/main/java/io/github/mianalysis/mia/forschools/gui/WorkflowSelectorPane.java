package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.List;

import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisReader;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.scene.image.Image;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.text.TextFlow;

public class WorkflowSelectorPane extends VBox {
    public WorkflowSelectorPane(List<String> workflowNames) {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        getStyleClass().add("control-pane");

        ObservableList<Node> workflowButtons = getChildren();

        for (String workflowName : workflowNames)
            workflowButtons.add(createButton(workflowName));

    }

    public Button createButton(String workflowName) {
        Button button = new Button();
        button.setAlignment(Pos.CENTER);
        button.setMaxHeight(0);
        button.getStyleClass().add("cartoon-button");
        button.setStyle(createWonkySquarePath());
        button.setPickOnBounds(true);
        button.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                String workflowPath = MIAForSchools.getWorkflowsPath() + workflowName;
                Analysis analysis = loadModules(workflowPath);

                MIAForSchools.getMainPane().setControlPane(new WorkflowControlPane(analysis));

            }
        });

        DropShadow ds = new DropShadow();
        ds.setColor(Color.color(1.0f, 1.0f, 1.0f));
        ds.setRadius(50);
        ds.setSpread(0.92);

        Text t = new Text();
        t.setEffect(ds);
        t.setText(workflowName.substring(0, workflowName.length() - 4));
        t.setTextAlignment(TextAlignment.CENTER);
        t.getStyleClass().add("cartoon-text");
        TextFlow tf = new TextFlow(t);
        tf.setMaxHeight(0);
        tf.setTextAlignment(TextAlignment.CENTER);
        button.setGraphic(tf);
        

        String rootPath = MIAForSchools.getWorkflowsPath() + workflowName.substring(0, workflowName.length() - 4);
        String normalImagePath = null;
        if (new File(rootPath + ".jpg").exists())
            normalImagePath = "file:/" + rootPath + ".jpg";
        else if (new File(rootPath + ".png").exists())
            normalImagePath = "file:/" + rootPath + ".png";
        else if (new File(rootPath + ".tif").exists())
            normalImagePath = "file:/" + rootPath + ".tif";

        Background normalBackground;
        if (normalImagePath != null) {
            Image normalImage = new Image(normalImagePath);
            BackgroundImage normalBackgroundImage = new BackgroundImage(normalImage, BackgroundRepeat.NO_REPEAT,
                    BackgroundRepeat.NO_REPEAT, BackgroundPosition.DEFAULT, BackgroundSize.DEFAULT);
            normalBackground = new Background(normalBackgroundImage);
            button.setBackground(normalBackground);
        } else {
            normalBackground = null;
        }

        String hoverImagePath = null;
        if (new File(rootPath + ".jpg").exists())
            hoverImagePath = "file:/" + rootPath + "_hover.jpg";
        else if (new File(rootPath + ".png").exists())
            hoverImagePath = "file:/" + rootPath + "_hover.png";
        else if (new File(rootPath + ".tif").exists())
            hoverImagePath = "file:/" + rootPath + "_hover.tif";

        Background hoverBackground;
        if (hoverImagePath != null) {
            Image hoverImage = new Image(hoverImagePath);
            BackgroundImage hoverBackgroundImage = new BackgroundImage(hoverImage, BackgroundRepeat.NO_REPEAT,
                    BackgroundRepeat.NO_REPEAT, BackgroundPosition.DEFAULT, BackgroundSize.DEFAULT);
            hoverBackground = new Background(hoverBackgroundImage);
        } else {
            hoverBackground = null;
        }

        if (normalBackground != null && hoverBackground != null) {
            button.hoverProperty().addListener((obs, wasHovered, isNowHovered) -> {
                if (isNowHovered)
                    button.setBackground(hoverBackground);
                else
                    button.setBackground(normalBackground);
            });
        }

        DropShadow shadow = new DropShadow();
        button.setEffect(shadow);

        return button;

    }

    public static Analysis loadModules(String path) {
        File file = new File(path);
        if (!file.exists()) {
            System.err.println("Can't find file to load: " + path);
            return null;
        }
        try {
            return AnalysisReader.loadAnalysis(file);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;

    }

    public static String createWonkySquarePath() {
        double mag = 0.2;
        double x1 = Math.random() * mag - mag / 2;
        double y1 = Math.random() * mag - mag / 2;
        double x2 = 1 + Math.random() * mag - mag / 2;
        double y2 = Math.random() * mag - mag / 2;
        double x3 = 1 + Math.random() * mag - mag / 2;
        double y3 = 1 + Math.random() * mag - mag / 2;
        double x4 = Math.random() * mag - mag / 2;
        double y4 = 1 + Math.random() * mag - mag / 2;

        String path = "-fx-shape: \"M " + x1 + ", " + y1 + " L " + x2 + " " + y2 + " L " + x3 + " " + y3 + " L " + x4
                + " " + y4 + " L " + x1 + " " + y1 + " Z\";";

        return path;

    }
}
