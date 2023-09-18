import { Paper, Typography } from '@mui/material';
import React from 'react';
// import { makeStyles } from '@mui/system';
import styled from '@emotion/styled';
// import Paper from '@material-ui/core/Paper';
import hospital from '../../assets/projectImages/hospital.jpg';
import heartSmall from '../../assets/projectImages/heartSmall.png';



const BannerPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#5393ff', // Change to your desired background color
    color: '#FFFFFF', // Change to your desired text color
    padding: theme.spacing(2), // Adjust padding as needed
    display: 'flex',
    flexDirection: 'column', // Stack elements vertically
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    borderRadius: '15px'
}));

const ImageWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

function SimpleBanner() {

    return (
        <BannerPaper elevation={3}>
            <Typography variant="h1" component="div">
                Welcome to Heart2Hub
            </Typography>
            <Typography variant="body1">
                The integrated system to manage all your hospital needs
            </Typography>
            <ImageWrapper>
                <img
                    src={heartSmall}
                    alt=""
                    width={700}
                    height={400}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }}
                />
            </ImageWrapper>
        </BannerPaper>

    );
}

export default SimpleBanner;
