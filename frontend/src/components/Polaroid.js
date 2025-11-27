import { Paper, Box } from '@mui/material';

const Polaroid = ({ imageUrl, rotation, sx }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        display: { xs: 'none', md: 'block' },
        width: { xs: '100px', sm: '150px', md: '200px', lg: '300px' },
        p: '10px',
        pb: '40px',
        backgroundColor: '#ffffff',
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: `scale(1.1)`,
          zIndex: 10,
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Random Polaroid"
        sx={{
          width: '100%',
          height: { xs: '80px', sm: '120px', md: '160px', lg: '240px' },
          objectFit: 'cover',
          backgroundColor: '#ccc',
        }}
      />
    </Paper>
  );
};

export default Polaroid;
