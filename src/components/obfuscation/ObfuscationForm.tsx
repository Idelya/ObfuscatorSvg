import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";
import { obfuscate, obfuscationMethods } from "../../obfuscationMethods";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

interface ObfuscationFormProps {
  generatedSvg: string;
  onObfuscate: (svg: string) => void;
  trigger: number;
}

const methodsAsString = Object.keys(obfuscationMethods);

const onChange = (
  values: { [k: string]: boolean },
  generatedSvg: string,
  onObfuscate: (svg: string) => void,
) => {
  const methodsList = methodsAsString.filter((key) => values[key]);
  const obfuscationResult = obfuscate(generatedSvg, methodsList);
  onObfuscate(obfuscationResult);
};

function ObfuscationForm({
  generatedSvg,
  onObfuscate,
  trigger,
}: ObfuscationFormProps) {
  const formik = useFormik({
    initialValues: Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(obfuscationMethods).map(([key, _]) => [key, false]),
    ),
    onSubmit: () => {},
  });

  useEffect(() => {
    onChange(formik.values, generatedSvg, onObfuscate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <>
      <form>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">
              Select methods of obfuscation
            </FormLabel>
            <FormGroup>
              {methodsAsString.map((method) => (
                <FormControlLabel
                  key={method}
                  control={
                    <Checkbox checked={formik.values[method]} name={method} />
                  }
                  label={method}
                  onChange={(e, value) => {
                    formik.handleChange(e);
                    onChange(
                      {
                        ...formik.values,
                        [method]: value,
                      },
                      generatedSvg,
                      onObfuscate,
                    );
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </form>
    </>
  );
}

export default ObfuscationForm;
