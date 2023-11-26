import { FormControl, FormLabel, Box, Button, Slider } from "@mui/material";
import { obfuscate } from "../../obfuscationMethods/obfuscationMethods";
import { useFormik } from "formik";
import { ObfuscationParams } from "../../obfuscationMethods/obfuscationParams";

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
      elementTag: "original",
      addIrrelevantFigures: false,
      addIrrelevantAttributes: false,
      randomizeElements: false,
      fillType: "original",
      divisionStrength: 2,
      circleParts: 2,
      figureSplitBy: "no",
    } as ObfuscationParams,
    onSubmit: (values) => {
      onChange(generatedSvg, values, onObfuscate);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
              Set parametrs of obfuscation
            </FormLabel>
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
              min={1}
              max={360}
              step={1}
              valueLabelDisplay="auto"
              value={formik.values.circleParts}
              onChange={formik.handleChange}
            />
          </FormControl>
          <Button type="submit" variant="contained">
            Obfuscate
          </Button>
        </Box>
      </form>
    </>
  );
}

export default ObfuscationForm;
