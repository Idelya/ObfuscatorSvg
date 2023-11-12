import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import { FormSchemaSvgGenerator, shapes } from "../../constant";
import { MuiColorInput } from "mui-color-input";

interface GeneratorFormProps {
  values: FormSchemaSvgGenerator;
  index: number;
  onChange: (e: React.ChangeEvent) => void;
  setFieldValue: (name: string, value: string) => void;
}

function GeneratorForm({
  values,
  index,
  onChange,
  setFieldValue,
}: GeneratorFormProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <FormControl fullWidth>
        <TextField
          select
          id="shape"
          name={`elements[${index}].shape`}
          value={values.shape}
          label="Select shape"
          onChange={onChange}
        >
          {shapes.map((shape) => (
            <MenuItem value={shape} key={shape}>
              {shape}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id="size"
          name={`elements[${index}].size`}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          value={values.size}
          label="Select size"
          onChange={onChange}
        />
      </FormControl>
      <MuiColorInput
        id="shapeColor"
        fullWidth
        name={`elements[${index}].shapeColor`}
        label="Select color"
        onChange={(value) =>
          setFieldValue(`elements[${index}].shapeColor`, value)
        }
        value={values.shapeColor}
      />
    </Box>
  );
}

export default GeneratorForm;
