package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import ij.IJ;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.object.image.Image;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.text.Font;
import javafx.stage.Stage;

public class MIAForSchools extends Application {
    public static Modules modules;
    private static WorkflowSelectorPane workflowSelectorPane;
    private static Scene scene;
    private static final WorkflowPane workflowPane = new WorkflowPane();
    private static String workflowsPath = new File(
            IJ.getDirectory("imagej") + File.separator + "workflows" + File.separator).getAbsolutePath();

    public static void main(String[] args) {
        workflowsPath = "C:\\Users\\steph\\Documents\\Programming\\Java Projects\\mia-for-schools\\workflows\\";

        Font.loadFont(MIAForSchools.class.getResourceAsStream("/styles/ShantellSans.ttf"), 16);

        launch(args);

    }

    @Override
    public void start(Stage stage) throws Exception {
        // Images will automatically be shown using the ImagePaneRenderer
        Image.setDefaultRenderer(new ImagePaneRenderer());

        List<String> workflowNames = getWorkflowNames();
        workflowSelectorPane = new WorkflowSelectorPane(workflowNames);
        scene = new Scene(workflowSelectorPane);

        stage.setTitle("MIA for Schools");
        stage.setWidth(1100);
        stage.setHeight(900);
        stage.setScene(scene);
        stage.show();

    }

    private static List<String> getWorkflowNames() {
        List<String> workflowNames = new ArrayList<>();
        for (String file : new File(workflowsPath).list())
            if (file.contains(".mia"))
                workflowNames.add(file);

        return workflowNames;

    }

    public static WorkflowPane getWorkflowPane() {
        return workflowPane;
    }

    public static String getWorkflowsPath() {
        return workflowsPath;
    }

    public static void enableWorkflowSelectorPane() {
        scene.setRoot(workflowSelectorPane);
    }

    public static void enableWorkflowPane() {
        scene.setRoot(workflowPane);
    }

    public static WorkflowSelectorPane getWorkflowSelectorPane() {
        return workflowSelectorPane;
    }
}
