import { Container, Grid, Typography } from "@mui/material";
import GeneratorSvg from "./generator/GeneratorSvg";
import ObfuscationForm from "./obfuscation/ObfuscationForm";
import SvgResult from "./SvgResult";
import { useState } from "react";

function Obfuscator() {
  const [svgForObfuscation, setSvgForObfuscation] = useState<string>();
  const [svgAfterObfuscation, setSvgAfterObfuscation] = useState<string>();
  const [trigger, setTrigger] = useState<number>(0);

  const triggerReload = () => {
    setTrigger(trigger + 1);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Obfuscator svg
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <GeneratorSvg
            svg={svgForObfuscation}
            onSubmit={(svg) => {
              triggerReload();
              setSvgForObfuscation(svg);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {svgForObfuscation && (
            <ObfuscationForm
              generatedSvg={svgForObfuscation}
              onObfuscate={(svg) => setSvgAfterObfuscation(svg)}
              trigger={trigger}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {svgAfterObfuscation && (
            <SvgResult svg={svgAfterObfuscation} name="after" />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Obfuscator;
