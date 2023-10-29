import { Box, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import parser from "prettier/plugins/html";
import prettier from "prettier/standalone";

interface GeneratorResultProps {
  svgElement: SVGElement;
}

function GeneratorResult({ svgElement }: GeneratorResultProps) {
  const [showCode, setShowCode] = useState(false);
  const [svgString, setSvgString] = useState("");

  useEffect(() => {
    const svgAsStr = new XMLSerializer().serializeToString(svgElement);

    if (showCode) {
      prettier
        .format(svgAsStr, {
          parser: "html",
          printWidth: 20,
          plugins: [parser],
        })
        .then((code) => setSvgString(code));
    } else {
      const box = document.getElementById("displayBox");
      if (!box) return;

      box.innerHTML = svgAsStr;
    }
  }, [svgElement, showCode]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <FormControlLabel
        value="showCode"
        control={<Switch color="primary" />}
        label="Show code"
        labelPlacement="end"
        onChange={() => setShowCode(!showCode)}
      />
      {!showCode ? (
        <Box
          id="displayBox"
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 0px 43px 0px rgba(7, 7, 7, 1)",
          }}
        ></Box>
      ) : (
        <SyntaxHighlighter language="javascript" style={materialDark}>
          {svgString}
        </SyntaxHighlighter>
      )}
    </Box>
  );
}

export default GeneratorResult;
