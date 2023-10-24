import * as React from "react";
import Svg, { Path } from "react-native-svg";

const LogOutIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={props.style?.width || "24"}
        height={props.style?.height || "24"}
        viewBox="0 0 24 24"
        {...props}>
        <Path
            fill={props.style?.color || "#F95A59"}
            d="M16.125 15.825a.74.74 0 0 1-.225-.544.7.7 0 0 1 .225-.531l2-2h-8a.723.723 0 0 1-.534-.217.732.732 0 0 1-.216-.537.731.731 0 0 1 .75-.746h7.95L16.05 9.225a.692.692 0 0 1-.2-.511c0-.208.077-.387.23-.538a.692.692 0 0 1 .528-.226c.211 0 .392.075.542.225l3.325 3.325a.75.75 0 0 1 .175.253c.033.086.05.178.05.275a.725.725 0 0 1-.05.272.762.762 0 0 1-.175.25l-3.3 3.3a.694.694 0 0 1-.512.2.734.734 0 0 1-.538-.225ZM4.5 21c-.4 0-.75-.15-1.05-.45-.3-.3-.45-.65-.45-1.05v-15c0-.4.15-.75.45-1.05.3-.3.65-.45 1.05-.45h6.525c.213 0 .39.072.534.217a.732.732 0 0 1 .216.537.731.731 0 0 1-.75.746H4.5v15h6.525c.213 0 .39.072.534.217a.732.732 0 0 1 .216.537.731.731 0 0 1-.75.746H4.5Z"
        />
    </Svg>
);
export default LogOutIcon;
