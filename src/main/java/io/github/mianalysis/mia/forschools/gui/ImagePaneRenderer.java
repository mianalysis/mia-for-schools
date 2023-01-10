package io.github.mianalysis.mia.forschools.gui;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import ij.ImagePlus;
import ij.gui.ImageCanvas;
import ij.gui.Overlay;
import ij.process.LUT;
import io.github.mianalysis.mia.object.image.Image;
import io.github.mianalysis.mia.object.image.renderer.ImageRenderer;
import javafx.embed.swing.SwingNode;
import javafx.scene.layout.VBox;

public class ImagePaneRenderer implements ImageRenderer {
    @Override
    public void render(Image image, String title, LUT lut, boolean normalise, boolean composite, Overlay overlay) {
        ImagePlus ipl = image.getImagePlus();

        final AwtInitializerTask awtInitializerTask = new AwtInitializerTask(() -> {
            JPanel jPanel = new JPanel();
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

        VBox imagePane = new VBox();
        imagePane.getChildren().add(swingNode);
        MIAForSchools.getMainPane().setImagePane(imagePane);

    }

    private class AwtInitializerTask extends FutureTask<JPanel> {
        public AwtInitializerTask(Callable<JPanel> callable) {
            super(callable);
        }
    }
}
