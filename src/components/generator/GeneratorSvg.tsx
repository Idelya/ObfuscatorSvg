import { Grid, Typography } from "@mui/material";
import GeneratorForm from "./GeneratorForm";
import GeneratorResult from "../SvgResult";
import { useEffect, useState } from "react";
import { FormSchemaSvgGenerator, svgGeneratorInit } from "../../constant";
import { generateSvg } from "../../lib/generateSvg";

interface GeneratorSvgProps {
  onSubmit: (svg: string) => void;
  svg?: string;
}

function GeneratorSvg({ onSubmit, svg }: GeneratorSvgProps) {
  const [init, setInit] = useState(true);

  const handleSave = (newFormInputs: FormSchemaSvgGenerator) => {
    const svgAsString = generateSvg(newFormInputs);
    onSubmit(svgAsString);
  };

  useEffect(() => {
    if (init) {
      onSubmit(generateSvg(svgGeneratorInit));
      setInit(false);
    }
  }, [init, onSubmit]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" sx={{ marginBottom: "16px" }}>
            Generate svg
          </Typography>
          <GeneratorForm onSave={handleSave} />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {svg ? (
            <GeneratorResult svg={svg} name="before" />
          ) : (
            <Typography>Generate element</Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default GeneratorSvg;
