import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Slider,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { obfuscate } from "../../obfuscationMethods/obfuscationMethods";
import { useFormik } from "formik";
import {
  ELEMENT_TAG_PARAMS,
  FIGURE_SPLIT_BY_PARAMS,
  FILL_TYPE_PARAMS,
  ObfuscationParams,
} from "../../obfuscationMethods/obfuscationParams";

interface ObfuscationFormProps {
  generatedSvg: string;
  onObfuscate: (svg: string) => void;
}

const onChange = (
  generatedSvg: string,
  params: ObfuscationParams,
  onObfuscate: (svg: string) => void,
) => {
  const obfuscationResult = obfuscate(generatedSvg, params);
  onObfuscate(obfuscationResult);
};

function ObfuscationForm({ generatedSvg, onObfuscate }: ObfuscationFormProps) {
  const formik = useFormik({
    initialValues: {
      elementTag: ELEMENT_TAG_PARAMS.PATH,
      addIrrelevantFigures: false,
      addIrrelevantAttributes: false,
      randomizeElements: false,
      fillType: FILL_TYPE_PARAMS.ORIGNAL,
      divisionStrength: 2,
      circleParts: 2,
      figureSplitBy: FIGURE_SPLIT_BY_PARAMS.NO,
      glassEnabled: false,
      mosaicEnabled: false,
    } as ObfuscationParams,
    onSubmit: (values) => {
      onChange(generatedSvg, values, onObfuscate);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
          <FormLabel component="legend">Set parametrs of obfuscation</FormLabel>
          <br />
          <FormControl fullWidth>
            <TextField
              select
              id="elementTag"
              name="elementTag"
              value={formik.values.elementTag}
              label="Select Element Tag (Rect/Polygon)"
              onChange={formik.handleChange}
            >
              {Object.values(ELEMENT_TAG_PARAMS).map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="addIrrelevantFigures"
            label="Add irrelevant figures"
            onChange={() =>
              formik.setFieldValue(
                "addIrrelevantFigures",
                !formik.values.addIrrelevantFigures,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="addIrrelevantAttributes"
            label="Add irrelevant attributes"
            onChange={() =>
              formik.setFieldValue(
                "addIrrelevantAttributes",
                !formik.values.addIrrelevantAttributes,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="randomizeElements"
            label="Randomize elements"
            onChange={() =>
              formik.setFieldValue(
                "randomizeElements",
                !formik.values.randomizeElements,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="glassEnabled"
            label="Glass method"
            onChange={() =>
              formik.setFieldValue("glassEnabled", !formik.values.glassEnabled)
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="mosaicEnabled"
            label="Mosaic method (rect)"
            onChange={() =>
              formik.setFieldValue(
                "mosaicEnabled",
                !formik.values.mosaicEnabled,
              )
            }
          />
          <br />
          <FormLabel htmlFor="divisionStrength">
            Rect/Polygon division depth
          </FormLabel>
          <Slider
            name="divisionStrength"
            min={1}
            max={5}
            step={1}
            valueLabelDisplay="auto"
            value={formik.values.divisionStrength}
            onChange={formik.handleChange}
          />
          <FormLabel htmlFor="circleDivision">
            Circle division - number of parts
          </FormLabel>
          <Slider
            name="circleParts"
            min={2}
            max={360}
            step={1}
            valueLabelDisplay="auto"
            value={formik.values.circleParts}
            onChange={formik.handleChange}
          />
          <br />
          <FormControl fullWidth>
            <TextField
              select
              id="figureSplitBy"
              name="figureSplitBy"
              value={formik.values.figureSplitBy}
              label="Select Fill Type"
              onChange={formik.handleChange}
            >
              {Object.values(FIGURE_SPLIT_BY_PARAMS).map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <br />
          <Button type="submit" variant="contained">
            Obfuscate
          </Button>
        </Box>
      </form>
    </>
  );
}

export default ObfuscationForm;
