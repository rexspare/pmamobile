import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SortIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={props.style?.width || 24}
        height={props.style?.height || 24}
        {...props}>
        <Path fill="#727C94" d="M3 18h6v-2H3v2ZM3 6v2h18V6H3Zm0 7h12v-2H3v2Z" />
    </Svg>
);
export default SortIcon;
