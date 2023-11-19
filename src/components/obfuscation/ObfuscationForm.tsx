import { FormControl, FormLabel, Box, Button, Slider } from "@mui/material";
import { obfuscate } from "../../obfuscationMethods/obfuscationMethods";
import { useFormik } from "formik";
import { ObfuscationParametrs } from "../../constant";

interface ObfuscationFormProps {
  generatedSvg: string;
  onObfuscate: (svg: string) => void;
}

const onChange = (
  generatedSvg: string,
  params: ObfuscationParametrs,
  onObfuscate: (svg: string) => void,
) => {
  const obfuscationResult = obfuscate(generatedSvg, params);
  onObfuscate(obfuscationResult);
};

function ObfuscationForm({ generatedSvg, onObfuscate }: ObfuscationFormProps) {
  const formik = useFormik({
    initialValues: {
      rectDivisionDepth: 2,
      circleDivision: 2,
      polygonDivisionDepth: 2,
    },
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
            <FormLabel htmlFor="rectDivisionDepth">
              Rect division depth
            </FormLabel>
            <Slider
              name="rectDivisionDepth"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="auto"
              value={formik.values.rectDivisionDepth}
              onChange={formik.handleChange}
            />
            <FormLabel htmlFor="circleDivision">
              Circle division - number of parts
            </FormLabel>
            <Slider
              name="circleDivision"
              min={1}
              max={360}
              step={1}
              valueLabelDisplay="auto"
              value={formik.values.circleDivision}
              onChange={formik.handleChange}
            />
            <FormLabel htmlFor="polygonDivisionDepth">
              Polygon division depth
            </FormLabel>
            <Slider
              name="polygonDivisionDepth"
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="auto"
              value={formik.values.polygonDivisionDepth}
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
