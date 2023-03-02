package io.github.mianalysis.mia.forschools.gui;

import javafx.scene.image.ImageView;
import javafx.scene.layout.Pane;

class WrappedImageView extends ImageView {
    WrappedImageView() {
        setPreserveRatio(true);
    }

    @Override
    public double minWidth(double height) {
        return 40;
    }

    @Override
    public double maxWidth(double height) {
        return 16384;
    }

    @Override
    public double minHeight(double width) {
        return 40;
    }

    @Override
    public double maxHeight(double width) {
        return 16384;
    }

    @Override
    public boolean isResizable() {
        return true;
    }

    @Override
    public void resize(double width, double height) {
        // Parent should be a Pane, but we can't guarantee
        if (getParent() instanceof Pane) {
            setFitWidth(((Pane) getParent()).getWidth());
            setFitHeight(((Pane) getParent()).getHeight());
        }
    }
}