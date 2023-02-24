package io.github.mianalysis.mia.forschools.gui.buttons;

import javafx.scene.control.Button;
import javafx.scene.effect.DropShadow;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import javafx.scene.text.TextFlow;

public class CartoonButton extends Button {
    public enum TriangleMode {
        UP, DOWN, LEFT, RIGHT;
    }

    public CartoonButton() {
        getStyleClass().add("cartoon-button");
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

    }

    public static String createWonkySquarePath(double wobble) {
        double x1 = Math.random() * wobble - wobble / 2;
        double y1 = Math.random() * wobble - wobble / 2;
        double x2 = 1 + Math.random() * wobble - wobble / 2;
        double y2 = Math.random() * wobble - wobble / 2;
        double x3 = 1 + Math.random() * wobble - wobble / 2;
        double y3 = 1 + Math.random() * wobble - wobble / 2;
        double x4 = Math.random() * wobble - wobble / 2;
        double y4 = 1 + Math.random() * wobble - wobble / 2;

        return "-fx-shape: \"M " + x1 + ", " + y1 + " L " + x2 + " " + y2 + " L " + x3 + " " + y3 + " L " + x4
                + " " + y4 + " L " + x1 + " " + y1 + " Z\";";

    }

    public static String createWonkyTrianglePath(TriangleMode triangleMode, double wobble) {
        double x1 = Math.random() * wobble - wobble / 2;
        double y1 = Math.random() * wobble - wobble / 2;
        double x2 = Math.random() * wobble - wobble / 2;
        double y2 = Math.random() * wobble - wobble / 2;
        double x3 = Math.random() * wobble - wobble / 2;
        double y3 = Math.random() * wobble - wobble / 2;

        switch (triangleMode) {
            case UP:
                x1 += 0.5;
                x2++;
                y2++;
                y3++;
                break;

            case DOWN:
                x2++;
                x3 += 0.5;
                y3++;
                break;

            case LEFT:
                x1++;
                x2++;
                y2++;
                y3+=0.5;
                break;

            case RIGHT:
                x2++;
                y2 += 0.5;
                y3++;
                break;
        }

        return "-fx-shape: \"M " + x1 + ", " + y1 + " L " + x2 + " " + y2 + " L " + x3 + " " + y3 + " L " + x1
                + " " + y1 + " Z\";";

    }
}
