import {
  FormLabel,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import { DeobfuscateParams } from "../../deobfuscateMethods/deobfuscateParams";
import { deobfuscate } from "../../deobfuscateMethods/deobfuscate";

interface DecoderFormProps {
  generatedSvg: string;
  onDeobfuscate: (svg: string) => void;
}

const onChange = (
  sourceSvg: string,
  params: DeobfuscateParams,
  onDeobfuscate: (svg: string) => void,
) => {
  const obfuscationResult = deobfuscate(sourceSvg, params);
  onDeobfuscate(obfuscationResult);
};

function DeobfuscatorForm({ generatedSvg, onDeobfuscate }: DecoderFormProps) {
  const formik = useFormik({
    initialValues: {
      removeUnnecessaryAttributes: false,
      revertTransform: false,
    } as DeobfuscateParams,
    onSubmit: (values) => {
      onChange(generatedSvg, values, onDeobfuscate);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
          <FormLabel component="legend">
            Set parametrs of deobfuscation
          </FormLabel>
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="removeUnnecessaryAttributes"
            label="Remove unnecessary attributes"
            onChange={() =>
              formik.setFieldValue(
                "removeUnnecessaryAttributes",
                !formik.values.removeUnnecessaryAttributes,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="removeUnnecessaryElements"
            label="Remove unnecessary elements"
            onChange={() =>
              formik.setFieldValue(
                "removeUnnecessaryElements",
                !formik.values.removeUnnecessaryElements,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="removeStyles"
            label="Remove styles"
            onChange={() =>
              formik.setFieldValue("removeStyles", !formik.values.removeStyles)
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="revertGlass"
            label="Revert Glass"
            onChange={() =>
              formik.setFieldValue("revertGlass", !formik.values.revertGlass)
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="revertTransform"
            label="Revert Transform"
            onChange={() =>
              formik.setFieldValue(
                "revertTransform",
                !formik.values.revertTransform,
              )
            }
          />
          <br />
          <FormControlLabel
            control={<Checkbox />}
            name="concatenateElements"
            label="Concatenate Elements"
            onChange={() =>
              formik.setFieldValue(
                "concatenateElements",
                !formik.values.concatenateElements,
              )
            }
          />
          <br />
          <Button type="submit" variant="contained">
            Deobfuscate
          </Button>
        </Box>
      </form>
    </>
  );
}

export default DeobfuscatorForm;
