import { Grid, Typography } from '@mui/material';
import GeneratorForm from './GeneratorForm';
import GeneratorResult from './GeneratorResult';
import { useState } from 'react';
import { FormSchemaSvgGenerator, svgGeneratorInit } from '../../constant';
import { generateSvg } from '../../lib/generateSvg';

function GeneratorSvg() {
  const [formInput, setFormInput] = useState<FormSchemaSvgGenerator>(svgGeneratorInit);

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: '16px' }}>
        Generate svg
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <GeneratorForm onSave={setFormInput} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <GeneratorResult svgElement={generateSvg(formInput)} />
        </Grid>
      </Grid>
    </>
  );
}

export default GeneratorSvg;
