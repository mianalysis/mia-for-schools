package io.github.mianalysis.mia.forschools.gui;

public class WonkyShapes {
    public enum TriangleMode {
        UP, DOWN, LEFT, RIGHT;
    }

    // public static void main(String[] args) {
    //     System.out.println(createTrianglePath(TriangleMode.DOWN, 0.1));
    // }

    public static String createSquarePath(double wobble) {
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

    public static String createTrianglePath(TriangleMode triangleMode, double wobble) {
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
                y3 += 0.5;
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
