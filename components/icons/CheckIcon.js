import * as React from "react";
import Svg, { G, Rect, Path, Defs, ClipPath } from "react-native-svg";

const CheckIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "30"}
        height={props.style?.height || "30"}
        viewBox="0 0 30 30"
        {...props}>
        <G clipPath="url(#a)">
            <Rect width={30} height={30} fill="#00B3C7" rx={15} />
            <Path
                fill="#fff"
                d="m12.644 18.469-2.892-2.892a.83.83 0 1 0-1.175 1.175l3.483 3.483a.83.83 0 0 0 1.175 0l8.817-8.816a.83.83 0 1 0-1.175-1.175l-8.233 8.225Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Rect width={30} height={30} fill="#fff" rx={15} />
            </ClipPath>
        </Defs>
    </Svg>
);
export default CheckIcon;
