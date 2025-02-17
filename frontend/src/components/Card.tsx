import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface MyCard {
    title:string;
    children:React.ReactNode
}

export default function BasicCard({ children , title }: MyCard) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
                    {title}
                </Typography>
                {children}
            </CardContent>
          
        </Card>
    );
}
