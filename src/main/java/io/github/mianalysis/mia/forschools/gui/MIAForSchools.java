package io.github.mianalysis.mia.forschools.gui;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import ij.IJ;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.object.image.Image;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MIAForSchools extends Application {
    public static Modules modules;
    private static WorkflowSelectorPane workflowSelectorPane;
    private static final MainPane mainPane = new MainPane(); 
    private static String workflowsPath = new File(
            IJ.getDirectory("imagej") + File.separator + "workflows" + File.separator).getAbsolutePath();
    
    public static void main(String[] args) {
        workflowsPath = "C:\\Users\\steph\\Documents\\Programming\\Java Projects\\mia-for-schools\\workflows\\";
    
        launch(args);

    }

    @Override
    public void start(Stage stage) throws Exception {
        // Images will automatically be shown using the ImagePaneRenderer
        Image.setDefaultRenderer(new ImagePaneRenderer());

        List<String> workflowNames = getWorkflowNames();
        workflowSelectorPane = new WorkflowSelectorPane(workflowNames);
        mainPane.setControlPane(workflowSelectorPane);

        ImagePane imagePane = new ImagePane();
        mainPane.setImagePane(imagePane);

        Scene scene = new Scene(mainPane);

        stage.setTitle("MIA for Schools");
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

    public static MainPane getMainPane() {
        return mainPane;
    }

    public static String getWorkflowsPath() {
        return workflowsPath;
    }

    public static WorkflowSelectorPane getWorkflowSelectorPane() {
        return workflowSelectorPane;
    }
}
