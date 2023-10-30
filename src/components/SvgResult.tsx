import { Box, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import parser from "prettier/plugins/html";
import prettier from "prettier/standalone";

interface SvgResultProps {
  svg: string;
  name: string;
}

function SvgResult({ svg, name }: SvgResultProps) {
  const [showCode, setShowCode] = useState(false);
  const [svgString, setSvgString] = useState("");

  useEffect(() => {
    if (showCode) {
      prettier
        .format(svg, {
          parser: "html",
          printWidth: 20,
          plugins: [parser],
        })
        .then((code) => setSvgString(code));
    } else {
      const box = document.getElementById(name);
      if (!box) return;

      box.innerHTML = svg;
    }
  }, [svg, showCode, name]);

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
          id={name}
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

export default SvgResult;
