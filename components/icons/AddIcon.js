import * as React from "react";
import Svg, { Path } from "react-native-svg";

const AddIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.style?.width || "24"}
        height={props.style?.height || "24"}
        viewBox="0 0 24 24"
        fill="none"
        {...props}>
        <Path fill={props.style?.color || "#00B3C7"} d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z" />
    </Svg>
);
export default AddIcon;
