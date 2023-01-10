package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.List;

import io.github.mianalysis.mia.forschools.gui.css.BackButton;
import io.github.mianalysis.mia.module.Module;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.object.Workspace;
import io.github.mianalysis.mia.object.Workspaces;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisReader;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;

public class WorkflowSelectorPane extends VBox {
    private static int buttonMinSize = 200;
    private static int buttonMaxSize = 200;
    private Modules modules = null;
    private Workspace workspace = null;
    private int moduleIdx = -1;

    public WorkflowSelectorPane(List<String> workflowNames) {
        ObservableList<Node> workflowButtons = getChildren();

        for (String workflowName : workflowNames)
            workflowButtons.add(createButton(workflowName));

        // pane.getStylesheets().add(MIAForSchools.class.getResource("css/style.css").toExternalForm());

    }

    public Button createButton(String workflowName) {
        Button button = new Button();
        button.setText(workflowName);
        button.setMinWidth(buttonMinSize);
        button.setMinHeight(buttonMinSize);
        button.setMaxWidth(buttonMaxSize);
        button.setMaxHeight(buttonMaxSize);

        Pane selectorPane = this;

        button.setOnAction(new EventHandler<ActionEvent>() {

            @Override
            public void handle(ActionEvent event) {
                moduleIdx = -1;
                
                String workflowPath = MIAForSchools.getWorkflowsPath() + workflowName;
                Analysis analysis = loadModules(workflowPath);

                modules = analysis.getModules();
                if (modules == null)
                    return;
                else
                    MIAForSchools.modules = modules;

                StringBuilder sb = new StringBuilder("Controls for " + workflowName + ":");
                for (Module module : modules)
                    sb.append("\n" + module.getName());

                // Display controls
                Label workflowLabel = new Label(sb.toString());
                VBox controlPane = new VBox();
                controlPane.getChildren().add(workflowLabel);

                // Display first image
                Workspaces workspaces = new Workspaces();
                workspace = workspaces.getNewWorkspace(analysis.getModules().getInputControl().getRootFile(),
                        1);

                // Running the first module
                modules.get(++moduleIdx).execute(workspace);

                Button nextButton = new Button();
                nextButton.setText("Next step");
                nextButton.setMinWidth(buttonMinSize);
                nextButton.setMinHeight((int) Math.round(buttonMaxSize * 0.25));
                nextButton.setMaxWidth(buttonMaxSize);
                nextButton.setMaxHeight((int) Math.round(buttonMaxSize * 0.25));
                nextButton.setOnAction(new EventHandler<ActionEvent>() {
                    @Override
                    public void handle(ActionEvent event) {
                        modules.get(++moduleIdx).execute(workspace);
                    }                    
                });       
                controlPane.getChildren().add(nextButton);     
                
                BackButton backButton = new BackButton(selectorPane, buttonMinSize,
                        (int) Math.round(buttonMaxSize * 0.25));
                controlPane.getChildren().add(backButton);

                MIAForSchools.getMainPane().setControlPane(controlPane);

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
}
