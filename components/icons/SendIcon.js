import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SendIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "24"}
        height={props.style?.height || "24"}
        viewBox="0 0 24 24"
        {...props}>
        <Path fill={props.style.fill || "#209F8B"} d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" />
        <Path
            fill={props.style.color || "#fff"}
            fillRule="evenodd"
            d="M17.748 6.816a.612.612 0 0 0-.828-.527L4.66 10.58a.614.614 0 0 0-.046 1.14l5.307 2.36 2.36 5.307a.613.613 0 0 0 1.14-.047l4.29-12.26a.616.616 0 0 0 .037-.263Zm-2.947 1.515-8.274 2.896 3.724 1.655 4.55-4.55Zm-3.683 5.418 4.55-4.55-2.895 8.274-1.655-3.723Z"
            clipRule="evenodd"
        />
    </Svg>
);
export default SendIcon;
