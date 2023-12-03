import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import parser from "prettier/plugins/html";
import prettier from "prettier/standalone";
import { highlightSvgElements } from "../lib/highlightElements";
import { deleteStyles } from "../lib/deleteStyles";

interface SvgResultProps {
  svg: string;
  name: string;
}

function SvgResult({ svg, name }: SvgResultProps) {
  const [showCode, setShowCode] = useState(false);
  const [highlightElements, setHighlightElements] = useState(false);
  const [withStyles, setWithStyles] = useState(false);
  const [svgString, setSvgString] = useState("");

  useEffect(() => {
    if (showCode) {
      prettier
        .format(svg, {
          parser: "html",
          printWidth: 150,
          plugins: [parser],
        })
        .then((code) => setSvgString(code));
    } else {
      const box = document.getElementById(name);
      let svgStr = svg;
      if (!box) return;

      if (highlightElements) {
        svgStr = highlightSvgElements(svgStr);
      }
      if (withStyles) {
        svgStr = deleteStyles(svgStr);
      }
      box.innerHTML = svgStr;
    }
  }, [svg, showCode, highlightElements, name, withStyles]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={{ display: "flex", textAlign: "center", alignItems: "center" }}>
        <FormControlLabel
          value="showCode"
          control={<Switch color="primary" />}
          label="Show code"
          labelPlacement="end"
          onChange={() => setShowCode(!showCode)}
        />
        <FormControlLabel
          value="highlightSvg"
          control={<Switch color="secondary" />}
          label="Highlight svg elements"
          labelPlacement="end"
          onChange={() => setHighlightElements(!highlightElements)}
        />
        <FormControlLabel
          value="disableStyle"
          control={<Switch color="secondary" />}
          label="Disable <style>"
          labelPlacement="end"
          onChange={() => setWithStyles(!withStyles)}
        />
        {showCode && <Typography>Chars: {svgString.length}</Typography>}
      </Box>
      <Box
        sx={{
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
      >
        {!showCode ? (
          <Box
            id={name}
            sx={{
              backgroundColor: "#fff",
              boxShadow: "0px 0px 43px 0px rgba(7, 7, 7, 1)",
            }}
          ></Box>
        ) : (
          <SyntaxHighlighter
            language="javascript"
            style={materialDark}
            wrapLongLines
            customStyle={{
              fontSize: "12px",
            }}
            codeTagProps={{
              style: {
                lineHeight: "inherit",
                fontSize: "inherit",
              },
            }}
          >
            {svgString}
          </SyntaxHighlighter>
        )}
      </Box>
    </Box>
  );
}

export default SvgResult;
