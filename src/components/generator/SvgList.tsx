import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useFormik } from "formik";
import {
  FormSchemaSvgGenerator,
  initElement,
  svgGeneratorInit,
} from "../../constant";
import { useState } from "react";
import GeneratorForm from "./GeneratorForm";

interface SvgListProps {
  onSave: (formInputs: { elements: FormSchemaSvgGenerator[] }) => void;
}

function SvgList({ onSave }: SvgListProps) {
  const [visibleId, setVisibleId] = useState(0);
  const formik = useFormik({
    initialValues: svgGeneratorInit,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <List>
              {formik.values.elements.map((_, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    border: index === visibleId ? "solid 1px #eee" : "none",
                  }}
                >
                  <ListItemButton
                    onClick={() => setVisibleId(index)}
                  >{`Element ${index}`}</ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <GeneratorForm
              onChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              values={formik.values.elements[visibleId]}
              index={visibleId}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", marginTop: "16px", gap: "16px" }}>
          <Button
            variant="outlined"
            onClick={() =>
              formik.setFieldValue("elements", [
                ...formik.values.elements,
                initElement,
              ])
            }
          >
            Add element
          </Button>
          <Button type="submit" variant="contained">
            Generate
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default SvgList;
