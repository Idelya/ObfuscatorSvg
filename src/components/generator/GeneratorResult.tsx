import { Box } from '@mui/material';
import { useEffect } from 'react';

interface GeneratorResultProps {
  svgElement: SVGElement;
}

function GeneratorResult({ svgElement }: GeneratorResultProps) {
  useEffect(() => {
    const svgAsStr = new XMLSerializer().serializeToString(svgElement);
    const box = document.getElementById('displayBox');
    if (!box) return;

    box.innerHTML = svgAsStr;
  }, [svgElement]);
  return (
    <Box
      id="displayBox"
      sx={{
        width: '300px',
        height: '300px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 43px 0px rgba(7, 7, 7, 1)'
      }}></Box>
  );
}

export default GeneratorResult;
