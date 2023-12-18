import { Box, Divider, Grid, Typography } from "@mui/material";
import GeneratorSvg from "./generator/GeneratorSvg";
import ObfuscationForm from "./obfuscation/ObfuscationForm";
import SvgResult from "./SvgResult";
import { useState } from "react";
import DeobfuscatorForm from "./deobfuscator/DeobfuscatorForm";

function Obfuscator() {
  const [svgForObfuscation, setSvgForObfuscation] = useState<string>();
  const [svgAfterObfuscation, setSvgAfterObfuscation] = useState<string>();
  const [svgAfterDeobfuscation, setSvgAfterDeobfuscation] = useState<string>();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "16px",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Obfuscator svg
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h2" variant="h4" sx={{ textAlign: "left" }}>
            Generate svg
          </Typography>
          <Divider sx={{ marginY: 5 }} />
        </Grid>
        <Grid item xs={12}>
          <GeneratorSvg
            svg={svgForObfuscation}
            onSubmit={(svg) => {
              setSvgForObfuscation(svg);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            component="h2"
            variant="h4"
            sx={{ textAlign: "left", marginTop: 5 }}
          >
            Obfuscate svg
          </Typography>
          <Divider sx={{ marginY: 5 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          {svgForObfuscation ? (
            <ObfuscationForm
              generatedSvg={svgForObfuscation}
              onObfuscate={(svg) => setSvgAfterObfuscation(svg)}
            />
          ) : (
            <Typography>Generate svg to obfuscate</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          {svgAfterObfuscation && (
            <SvgResult svg={svgAfterObfuscation} name="after" />
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            component="h2"
            variant="h4"
            sx={{ textAlign: "left", marginTop: 5 }}
          >
            Deobfuscate svg
          </Typography>
          <Divider sx={{ marginY: 5 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          {svgAfterObfuscation ? (
            <DeobfuscatorForm
              generatedSvg={svgAfterObfuscation}
              onDeobfuscate={(svg) => setSvgAfterDeobfuscation(svg)}
            />
          ) : (
            <Typography>Obfuscate to test deobfuscator</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={8} sx={{ marginBottom: 5 }}>
          {svgAfterDeobfuscation && (
            <SvgResult svg={svgAfterDeobfuscation} name="decoder" />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Obfuscator;
