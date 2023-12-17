import { FormLabel, Box, Button } from "@mui/material";
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
    initialValues: {} as DeobfuscateParams,
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
          <Button type="submit" variant="contained">
            Deobfuscate
          </Button>
        </Box>
      </form>
    </>
  );
}

export default DeobfuscatorForm;
