import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ContactIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "21"}
        height={props.style?.height || "20"}
        viewBox="0 0 21 20"
        {...props}>
        <Path
            fill={props.style?.color || "#00B3C7"}
            d="M10.5 4.167v-2.5L7.166 5 10.5 8.333v-2.5c2.758 0 5 2.242 5 5 0 2.475-1.809 4.525-4.167 4.925v1.684a6.657 6.657 0 0 0 5.833-6.609A6.665 6.665 0 0 0 10.5 4.167ZM5.5 10.833c0-1.375.558-2.625 1.466-3.533L5.783 6.117a6.679 6.679 0 0 0-1.95 4.716c0 3.4 2.542 6.2 5.833 6.609v-1.684c-2.358-.4-4.166-2.45-4.166-4.925Z"
        />
    </Svg>
);
export default ContactIcon;
