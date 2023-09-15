package io.github.mianalysis.mia.forschools.gui.buttons;

import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.text.TextFlow;

public class CartoonButton extends Button {
    public CartoonButton() {
        getStyleClass().add("cartoon-shape");
    }

    public void setStyledText(String text) {
        DropShadow ds = new DropShadow();
        ds.setColor(Color.color(1.0f, 1.0f, 1.0f));
        ds.setRadius(50);
        ds.setSpread(0.92);

        Text t = new Text();
        t.setEffect(ds);
        t.setText(text);
        t.setTextAlignment(TextAlignment.CENTER);
        t.getStyleClass().add("cartoon-text");
        TextFlow tf = new TextFlow(t);
        tf.setMaxHeight(0);
        tf.setTextAlignment(TextAlignment.CENTER);
        setGraphic(tf);

        setPadding(new Insets(20));

    }    
}
