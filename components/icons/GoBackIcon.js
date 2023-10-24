import * as React from "react";
import Svg, { Path } from "react-native-svg";

const GoBackIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "26"}
        height={props.style?.height || "27"}
        viewBox="0 0 26 27"
        {...props}>
        <Path
            fill={props.style?.colors || "#011B34"}
            d="M18.011 12.375H9.967l3.498-3.698c.2-.212.311-.499.311-.798 0-.3-.112-.587-.311-.798-.2-.212-.47-.331-.753-.331-.282 0-.553.119-.752.33l-5.3 5.62a1.136 1.136 0 0 0-.222.372c-.106.274-.106.58 0 .854.05.138.126.264.223.371l5.299 5.62c.098.106.216.19.345.247a1.009 1.009 0 0 0 1.16-.247c.1-.104.178-.228.232-.365a1.184 1.184 0 0 0-.232-1.23l-3.498-3.699h8.044c.281 0 .55-.118.75-.33.198-.21.31-.496.31-.794a1.16 1.16 0 0 0-.31-.795 1.03 1.03 0 0 0-.75-.329Z"
        />
    </Svg>
);
export default GoBackIcon;
