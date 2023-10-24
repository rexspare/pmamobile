import * as React from "react";
import Svg, { Path } from "react-native-svg";

const MessageIcon = (props) => (
    <Svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="25" 
    height="24" 
    viewBox="0 0 25 24"  
        {...props}>
        <Path
            d="M17.5 13.713H7.5C7.21667 13.713 6.97933 13.617 6.788 13.425C6.596 13.2337 6.5 12.9963 6.5 12.713C6.5 12.4297 6.596 12.192 6.788 12C6.97933 11.8087 7.21667 11.713 7.5 11.713H17.5C17.7833 11.713 18.021 11.8087 18.213 12C18.4043 12.192 18.5 12.4297 18.5 12.713C18.5 12.9963 18.4043 13.2337 18.213 13.425C18.021 13.617 17.7833 13.713 17.5 13.713ZM17.5 9.5H7.5C7.21667 9.5 6.97933 9.40433 6.788 9.213C6.596 9.021 6.5 8.78333 6.5 8.5C6.5 8.21667 6.596 7.979 6.788 7.787C6.97933 7.59567 7.21667 7.5 7.5 7.5H17.5C17.7833 7.5 18.021 7.59567 18.213 7.787C18.4043 7.979 18.5 8.21667 18.5 8.5C18.5 8.78333 18.4043 9.021 18.213 9.213C18.021 9.40433 17.7833 9.5 17.5 9.5ZM4.2 20.99L6.5 18.69H20.5C21.05 18.69 21.5207 18.4943 21.912 18.103C22.304 17.711 22.5 17.24 22.5 16.69V4.69C22.5 4.14 22.304 3.669 21.912 3.277C21.5207 2.88567 21.05 2.69 20.5 2.69H4.5C3.95 2.69 3.479 2.88567 3.087 3.277C2.69567 3.669 2.5 4.14 2.5 4.69V20.265C2.5 20.715 2.704 21.0273 3.112 21.202C3.52067 21.3773 3.88333 21.3067 4.2 20.99ZM20.5 4.69V16.69H5.675L4.5 17.865V4.69H20.5Z"
            fill={props.style?.color || "#727C94"}
        />
    </Svg>
);
export default MessageIcon;