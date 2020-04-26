import React from 'react';
import './Button-Component.css';


const Button = ({onClick, className, children}) =>
    <button type = "button" onClick = {onClick } className = {className} >{children}</button>
        
export default Button;