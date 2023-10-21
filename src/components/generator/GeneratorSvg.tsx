import { Grid, Typography } from '@mui/material';
import GeneratorForm from './GeneratorForm';
import GeneratorResult from './GeneratorResult';

function GeneratorSvg() {
  return (
    <>
      <Typography variant="h4">Generate svg</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <GeneratorForm />
        </Grid>
        <Grid item xs={12} md={6}>
          <GeneratorResult />
        </Grid>
      </Grid>
    </>
  );
}

export default GeneratorSvg;
