import { FormControl, FormLabel, Box, Button } from "@mui/material";
import { obfuscate } from "../../obfuscationMethods/obfuscationMethods";
import { useFormik } from "formik";

interface ObfuscationFormProps {
  generatedSvg: string;
  onObfuscate: (svg: string) => void;
}

const onChange = (generatedSvg: string, onObfuscate: (svg: string) => void) => {
  const obfuscationResult = obfuscate(generatedSvg);
  onObfuscate(obfuscationResult);
};

function ObfuscationForm({ generatedSvg, onObfuscate }: ObfuscationFormProps) {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      onChange(generatedSvg, onObfuscate);
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
