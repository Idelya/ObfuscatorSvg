import { Container, Typography } from '@mui/material';
import GeneratorSvg from './generator/GeneratorSvg';

function Obfuscator() {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Obfuscator svg
      </Typography>
      <GeneratorSvg />
    </Container>
  );
}

export default Obfuscator;
