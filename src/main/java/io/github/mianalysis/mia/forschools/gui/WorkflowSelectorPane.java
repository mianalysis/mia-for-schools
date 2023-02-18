package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.List;

import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisReader;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;

public class WorkflowSelectorPane extends VBox {
    public WorkflowSelectorPane(List<String> workflowNames) {
        getStylesheets().add(MIAForSchools.class.getResource("css/style.css").toExternalForm());

        ObservableList<Node> workflowButtons = getChildren();

        for (String workflowName : workflowNames)
            workflowButtons.add(createButton(workflowName));

    }

    public Button createButton(String workflowName) {
        Button button = new Button();
        button.setText(workflowName);
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

        return button;

    }

    public static Analysis loadModules(String path) {
        File file = new File(path);
        if (!file.exists()) {
            System.err.println("Can't find file to load: " + path);
            return null;
        }
        try {
            System.out.println(file.getAbsolutePath());
            return AnalysisReader.loadAnalysis(file);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;

    }

    public static String createWonkySquarePath() {
        double mag = 0.2;
        double x1 = Math.random()*mag-mag/2;
        double y1 = Math.random()*mag-mag/2;
        double x2 = 1+Math.random()*mag-mag/2;
        double y2 = Math.random()*mag-mag/2;
        double x3 = 1+Math.random()*mag-mag/2;
        double y3 = 1+Math.random()*mag-mag/2;
        double x4 = Math.random()*mag-mag/2;
        double y4 = 1+Math.random()*mag-mag/2;
        String path = "-fx-shape: \"M "+x1+", "+y1+" L "+x2+" "+y2+" L "+x3+" "+y3+" L "+x4+" "+y4+" L "+x1+" "+y1+" Z\";";
        System.out.println(path);
        return path;

    }
}
