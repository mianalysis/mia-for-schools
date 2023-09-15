package io.github.mianalysis.mia.forschools.gui.buttons;

import io.github.mianalysis.mia.forschools.gui.MIAForSchools;
import io.github.mianalysis.mia.forschools.gui.WonkyShapes;
import io.github.mianalysis.mia.forschools.gui.WorkflowControlPane;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.HBox;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.text.TextFlow;

public class HomeButton extends CartoonButton {
    private static final String squarePath = WonkyShapes.createSquarePath(0.1);

    public HomeButton() {
        getStyleClass().add("home-button");

        setAlignment(Pos.CENTER);
        setMaxHeight(0);
        setMaxWidth(Double.MAX_VALUE);
        setPickOnBounds(true);
        setStyle(squarePath);
        setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                MIAForSchools.enableWorkflowSelectorPane();
            }
        });

        Image image = new Image(WorkflowControlPane.class.getResourceAsStream("/img/house-64.png"));
        
        ImageView imageView = new ImageView(image);
        imageView.setFitWidth(32);
        imageView.setFitHeight(32);

        Text t = new Text();
        t.getStyleClass().add("cartoon-text");
        t.getStyleClass().add("normal-text");
        t.setText("Choose another image");
        t.setTextAlignment(TextAlignment.RIGHT);
        TextFlow tf = new TextFlow(t);
        tf.setMaxHeight(0);
        tf.setTextAlignment(TextAlignment.RIGHT);        
        tf.setPadding(new Insets(0,0,0,20));

        HBox h = new HBox();
        h.setAlignment(Pos.CENTER);
        h.getChildren().addAll(imageView,tf);
        setGraphic(h);

    }
}
