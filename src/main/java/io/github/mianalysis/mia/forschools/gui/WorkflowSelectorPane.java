package io.github.mianalysis.mia.forschools.gui;

import java.util.List;

import io.github.mianalysis.mia.forschools.gui.buttons.WorkflowButton;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.ScrollPane;
import javafx.scene.effect.DropShadow;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;

public class WorkflowSelectorPane extends VBox {
    public WorkflowSelectorPane(List<String> workflowNames) {
        getStylesheets().add(MIAForSchools.class.getResource("/styles/style.css").toExternalForm());
        setAlignment(Pos.CENTER);
        getStyleClass().add("pane");

        Text t = new Text();
        t.setText("Select an image to work with");
        t.setTextAlignment(TextAlignment.CENTER);
        t.getStyleClass().add("cartoon-text");
        t.getStyleClass().add("title-text");
        t.setEffect(new DropShadow());
        getChildren().add(t);
        setMargin(t, new Insets(100,50,0,50));

        FlowPane buttons = new FlowPane();
        buttons.setAlignment(Pos.CENTER);
        buttons.getStyleClass().add("invisible");

        ScrollPane scrollPane = new ScrollPane(buttons);
        scrollPane.getStyleClass().add("invisible");
        scrollPane.setFitToWidth(true);
        scrollPane.setFitToHeight(true);
        
        buttons.getStyleClass().add("selector-pane");
        getChildren().add(scrollPane);
        ObservableList<Node> workflowButtons = buttons.getChildren();
        for (String workflowName : workflowNames)
            workflowButtons.add(new WorkflowButton(workflowName));

    }
}
