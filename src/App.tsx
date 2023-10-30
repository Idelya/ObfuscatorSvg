import { ThemeProvider } from "@emotion/react";
import Obfuscator from "./components/Obfuscator";
import { CssBaseline, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#242b2b",
    },
    primary: {
      main: "#cec0ed",
    },
    secondary: {
      main: "#99b98b",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Obfuscator />
    </ThemeProvider>
  );
}

export default App;
