import { Box, Button, FormControl, MenuItem, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { FormSchemaSvgGenerator, shapes, svgGeneratorInit } from '../../constant';
import { MuiColorInput } from 'mui-color-input';

interface GeneratorFormProps {
  onSave: (formInputs: FormSchemaSvgGenerator) => void;
}

function GeneratorForm({ onSave }: GeneratorFormProps) {
  const formik = useFormik({
    initialValues: svgGeneratorInit,
    onSubmit: (values) => {
      onSave(values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
        <FormControl fullWidth>
          <TextField
            select
            id="shape"
            name="shape"
            value={formik.values.shape}
            label="Select shape"
            onChange={formik.handleChange}>
            {shapes.map((shape) => (
              <MenuItem value={shape} key={shape}>
                {shape}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <MuiColorInput
          id="shapeColor"
          fullWidth
          name="shapeColor"
          label="Select color"
          onChange={(value) => formik.setFieldValue('shapeColor', value)}
          value={formik.values.shapeColor}
        />
        <Button type="submit" variant="contained">
          Generate
        </Button>
      </Box>
    </form>
  );
}

export default GeneratorForm;
