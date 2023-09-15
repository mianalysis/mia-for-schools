package io.github.mianalysis.mia.forschools.module;

import org.scijava.Priority;
import org.scijava.plugin.Plugin;

import io.github.mianalysis.mia.module.AvailableModules;
import io.github.mianalysis.mia.module.Categories;
import io.github.mianalysis.mia.module.Category;
import io.github.mianalysis.mia.module.Module;
import io.github.mianalysis.mia.module.Modules;
import io.github.mianalysis.mia.module.images.process.FilterImage;
import io.github.mianalysis.mia.module.images.process.binary.ExtendedMinima;
import io.github.mianalysis.mia.module.objects.detect.IdentifyObjects;
import io.github.mianalysis.mia.module.script.RunSingleCommand;
import io.github.mianalysis.mia.object.Workspace;
import io.github.mianalysis.mia.object.parameters.InputImageP;
import io.github.mianalysis.mia.object.parameters.Parameters;
import io.github.mianalysis.mia.object.parameters.objects.OutputObjectsP;
import io.github.mianalysis.mia.object.parameters.text.IntegerP;
import io.github.mianalysis.mia.object.refs.collections.ImageMeasurementRefs;
import io.github.mianalysis.mia.object.refs.collections.MetadataRefs;
import io.github.mianalysis.mia.object.refs.collections.ObjMeasurementRefs;
import io.github.mianalysis.mia.object.refs.collections.ParentChildRefs;
import io.github.mianalysis.mia.object.refs.collections.PartnerRefs;
import io.github.mianalysis.mia.object.system.Status;
import net.imagej.ImageJ;

@Plugin(type = Module.class, priority = Priority.LOW, visible = true)
public class FindOnionCells extends Module {
    // Public parameters
    public static String INPUT_IMAGE = "Input image";
    public static String OUTPUT_CELL_OBJECTS = "Cells";
    public static String DYNAMIC = "Dynamic";

    public static void main(String[] args) {
        // Creating a new instance of ImageJ
        new ij.ImageJ();
        
        // Launching MIA
        new ImageJ().command().run("io.github.mianalysis.mia.MIA", false);

        // Adding the current module to MIA's list of available modules.
        AvailableModules.addModuleName(FindOnionCells.class);

    }

    public FindOnionCells(Modules modules) {
        super("Find onion cells", modules);

    }

    @Override
    public Category getCategory() {
        // return ForSchoolsCategories.FOR_SCHOOLS;
        return ForSchoolsCategories.FOR_SCHOOLS;
    }

    public String getDescription() {
        return "";
    }

    @Override
    public String getVersionNumber() {
        return "1.0.0";
    }

    @Override
    protected Status process(Workspace workspace) {
        // Getting parameters
        String rawImageName = parameters.getValue(INPUT_IMAGE, workspace);
        String outputCellsName = parameters.getValue(OUTPUT_CELL_OBJECTS, workspace);
        int dynamic = parameters.getValue(DYNAMIC, workspace);

        // Private parameters
        String filteredImageName = "Filtered";
        String markerImageName = "Markers";

        FilterImage filterImage = new FilterImage(modules);
        filterImage.updateParameterValue(FilterImage.INPUT_IMAGE, rawImageName);
        filterImage.updateParameterValue(FilterImage.APPLY_TO_INPUT, false);
        filterImage.updateParameterValue(FilterImage.OUTPUT_IMAGE, filteredImageName);
        filterImage.updateParameterValue(FilterImage.FILTER_MODE, FilterImage.FilterModes.GAUSSIAN2D);
        filterImage.updateParameterValue(FilterImage.FILTER_RADIUS, 1d);
        filterImage.updateParameterValue(FilterImage.CALIBRATED_UNITS, false);
        filterImage.process(workspace);

        RunSingleCommand runSingleCommand = new RunSingleCommand(modules);
        runSingleCommand.updateParameterValue(RunSingleCommand.INPUT_IMAGE, filteredImageName);
        runSingleCommand.updateParameterValue(RunSingleCommand.APPLY_TO_INPUT, true);
        runSingleCommand.updateParameterValue(RunSingleCommand.COMMAND, "Subtract Background...");
        runSingleCommand.updateParameterValue(RunSingleCommand.ARGUMENTS, "rolling=50 light");
        runSingleCommand.updateParameterValue(RunSingleCommand.ENABLE_MULTITHREADING, true);
        runSingleCommand.process(workspace);

        ExtendedMinima extendedMinima = new ExtendedMinima(modules);
        extendedMinima.updateParameterValue(ExtendedMinima.INPUT_IMAGE, filteredImageName);
        extendedMinima.updateParameterValue(ExtendedMinima.APPLY_TO_INPUT, false);
        extendedMinima.updateParameterValue(ExtendedMinima.OUTPUT_IMAGE, markerImageName);
        extendedMinima.updateParameterValue(ExtendedMinima.MINIMA_MAXIMA_MODE, ExtendedMinima.MinimaMaximaModes.MAXIMA);
        extendedMinima.updateParameterValue(ExtendedMinima.DYNAMIC, dynamic);
        extendedMinima.updateParameterValue(ExtendedMinima.CONNECTIVITY, ExtendedMinima.Connectivity.TWENTYSIX);
        extendedMinima.updateParameterValue(ExtendedMinima.BINARY_LOGIC, ExtendedMinima.BinaryLogic.BLACK_BACKGROUND);
        extendedMinima.updateParameterValue(ExtendedMinima.ENABLE_MULTITHREADING, true);
        extendedMinima.process(workspace);

        // Skipping some modules for speed of this first test

        IdentifyObjects identifyObjects = new IdentifyObjects(modules);
        identifyObjects.updateParameterValue(IdentifyObjects.INPUT_IMAGE, markerImageName);
        identifyObjects.updateParameterValue(IdentifyObjects.OUTPUT_OBJECTS, outputCellsName);
        identifyObjects.updateParameterValue(IdentifyObjects.BINARY_LOGIC,
                IdentifyObjects.BinaryLogic.BLACK_BACKGROUND);
        identifyObjects.updateParameterValue(IdentifyObjects.DETECTION_MODE, IdentifyObjects.DetectionModes.THREE_D);
        identifyObjects.updateParameterValue(IdentifyObjects.SINGLE_OBJECT, false);
        identifyObjects.updateParameterValue(IdentifyObjects.CONNECTIVITY, IdentifyObjects.Connectivity.TWENTYSIX);
        identifyObjects.updateParameterValue(IdentifyObjects.VOLUME_TYPE, IdentifyObjects.VolumeTypes.QUADTREE);
        identifyObjects.updateParameterValue(IdentifyObjects.ENABLE_MULTITHREADING, true);
        identifyObjects.updateParameterValue(IdentifyObjects.MIN_STRIP_WIDTH, 60);
        identifyObjects.process(workspace);

        return Status.PASS;

    }

    @Override
    protected void initialiseParameters() {
        parameters.add(new InputImageP(INPUT_IMAGE, this));
        parameters.add(new OutputObjectsP(OUTPUT_CELL_OBJECTS, this));
        parameters.add(new IntegerP(DYNAMIC, this, 50));
    }

    @Override
    public Parameters updateAndGetParameters() {
        return parameters;

    }

    @Override
    public ImageMeasurementRefs updateAndGetImageMeasurementRefs() {
        return null;
    }

    @Override
    public ObjMeasurementRefs updateAndGetObjectMeasurementRefs() {
        return null;
    }

    @Override
    public MetadataRefs updateAndGetMetadataReferences() {
        return null;
    }

    @Override
    public ParentChildRefs updateAndGetParentChildRefs() {
        return null;
    }

    @Override
    public PartnerRefs updateAndGetPartnerRefs() {
        return null;
    }

    @Override
    public boolean verify() {
        return true;
    }
}