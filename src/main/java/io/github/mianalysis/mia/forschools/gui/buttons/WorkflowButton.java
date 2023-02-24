package io.github.mianalysis.mia.forschools.gui.buttons;

import java.io.File;

import io.github.mianalysis.mia.forschools.gui.MIAForSchools;
import io.github.mianalysis.mia.forschools.gui.WorkflowControlPane;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisReader;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Pos;
import javafx.scene.image.Image;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundImage;
import javafx.scene.layout.BackgroundPosition;
import javafx.scene.layout.BackgroundRepeat;
import javafx.scene.layout.BackgroundSize;

public class WorkflowButton extends CartoonButton {
    public WorkflowButton(String workflowName) {
        getStyleClass().add("workflow-button");

        setAlignment(Pos.CENTER);
        setMaxHeight(0);
        setStyle(createWonkySquarePath(0.2));
        setPickOnBounds(true);
        setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                String workflowPath = MIAForSchools.getWorkflowsPath() + workflowName;
                Analysis analysis = loadModules(workflowPath);

                MIAForSchools.enableMainPane();
                MIAForSchools.getMainPane().setControlPane(new WorkflowControlPane(analysis));

            }
        });

        String workflowNameString = workflowName.substring(0, workflowName.length() - 4);
        workflowNameString = workflowNameString.replace("Q$", "?");
        setStyledText(workflowNameString);

        Background normalBackground = loadBackground(workflowName, "");
        Background hoverBackground = loadBackground(workflowName, "_hover");

        if (normalBackground != null) {
            setBackground(normalBackground);

            if (hoverBackground != null) {
                hoverProperty().addListener((obs, wasHovered, isNowHovered) -> {
                    if (isNowHovered)
                        setBackground(hoverBackground);
                    else
                        setBackground(normalBackground);
                });
            }
        }
    }

    public static Background loadBackground(String workflowName, String suffix) {
        String rootPath = MIAForSchools.getWorkflowsPath() + workflowName.substring(0, workflowName.length() - 4);
        String imagePath = null;
        if (new File(rootPath + ".jpg").exists())
            imagePath = "file:/" + rootPath + suffix   + ".jpg";
        else if (new File(rootPath + ".png").exists())
            imagePath = "file:/" + rootPath + suffix   + ".png";
        else if (new File(rootPath + ".tif").exists())
            imagePath = "file:/" + rootPath + suffix   + ".tif";

        if (imagePath != null) {
            Image image = new Image(imagePath);
            BackgroundImage backgroundImage = new BackgroundImage(image, BackgroundRepeat.NO_REPEAT,
                    BackgroundRepeat.NO_REPEAT, BackgroundPosition.DEFAULT, BackgroundSize.DEFAULT);
            return new Background(backgroundImage);
        }

        return null;

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
}
