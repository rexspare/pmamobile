import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CheckMarkIcon = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 632 376" width={props.style?.width || "10"} height={props.style?.height || "9"} {...props}>
        <Path
            fill={props.style?.color || "#727C94"}
            d="M504.502 75.496c-9.997-9.998-26.205-9.998-36.204 0L161.594 382.203 43.702 264.311c-9.997-9.998-26.205-9.997-36.204 0-9.998 9.997-9.998 26.205 0 36.203l135.994 135.992c9.994 9.997 26.214 9.99 36.204 0L504.502 111.7c9.998-9.997 9.997-26.206 0-36.204z"
        />
    </Svg>
);
export default CheckMarkIcon;
