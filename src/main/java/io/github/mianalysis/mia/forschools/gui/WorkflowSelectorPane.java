package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import ij.ImagePlus;
import ij.gui.ImageCanvas;
import io.github.mianalysis.mia.forschools.gui.css.BackButton;
import io.github.mianalysis.mia.module.Module;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.module.visualise.overlays.AddLine;
import io.github.mianalysis.mia.module.visualise.overlays.AddText;
import io.github.mianalysis.mia.object.Workspace;
import io.github.mianalysis.mia.object.Workspaces;
import io.github.mianalysis.mia.object.image.Image;
import io.github.mianalysis.mia.process.analysishandling.Analysis;
import io.github.mianalysis.mia.process.analysishandling.AnalysisReader;
import javafx.collections.ObservableList;
import javafx.embed.swing.SwingNode;
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
                String workflowPath = MIAForSchools.getWorkflowsPath() + workflowName;
                Analysis analysis = loadModules(workflowPath);

                Modules modules = analysis.getModules();
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

                BackButton backButton = new BackButton(selectorPane, buttonMinSize,
                        (int) Math.round(buttonMaxSize * 0.25));
                controlPane.getChildren().add(backButton);

                MIAForSchools.getMainPane().setControlPane(controlPane);

                // Display first image
                VBox imagePane = new VBox();

                Workspaces workspaces = new Workspaces();
                Workspace workspace = workspaces.getNewWorkspace(analysis.getModules().getInputControl().getRootFile(),
                        1);

                for (Module module : modules)
                    module.execute(workspace);

                // Getting image
                Image image = workspace.getImage("Output");
                ImagePlus ipl = image.getImagePlus();

                final AwtInitializerTask awtInitializerTask = new AwtInitializerTask(() -> {
                    JPanel jPanel = new JPanel();

                    System.out.println("Canvas: " + image.getImagePlus().getCanvas());
                    jPanel.add(new ImageCanvas(ipl));

                    return jPanel;
                });

                SwingUtilities.invokeLater(awtInitializerTask);

                SwingNode swingNode = new SwingNode();
                try {
                    swingNode.setContent(awtInitializerTask.get());
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }

                imagePane.getChildren().add(swingNode);
                // stage.setScene(new Scene(new Group(swingNode), W, H));
                // stage.setResizable(false);
                // stage.show();

                MIAForSchools.getMainPane().setImagePane(imagePane);

            }

        });

        return button;

    }

    private class AwtInitializerTask extends FutureTask<JPanel> {
        public AwtInitializerTask(Callable<JPanel> callable) {
            super(callable);
        }
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
